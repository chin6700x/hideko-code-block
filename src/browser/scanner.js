import { highlight as v8Highlight, highlightLines as v8HighlightLines, registerLanguage as v8RegisterLanguage } from '../core/hideko-v8.js';
import { languageAliases, detectLanguage } from '../languages/language-aliases.js';
import { createCopyButton, parseHighlightLines } from '../core/utils.js';
import { VirtualBuffer } from '../core/virtual-buffer.js';

// Cache for dynamically loaded language modules
const loadedLanguages = new Map();
const pendingLoads = new Map();

/**
 * Isolated registry mapping DOM containers to their own VirtualBuffer instance (1:1 WeakMap)
 */
export const virtualRegistry = new WeakMap();

/**
 * Wrap highlighted HTML into individual .hideko-line rows with optional line numbers and highlight styling
 */
function wrapLinesHtml(formattedHtml, totalLines, startLine, showNumbers, hlSet, gutterWidth) {
    if (!showNumbers && (!hlSet || hlSet.size === 0)) {
        return formattedHtml;
    }
    const cleanHtml = String(formattedHtml).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    let lines = cleanHtml.split('\n');

    // Prevent trailing ghost line if input had trailing newline and exceeds total lines
    if (typeof totalLines === 'number' && lines.length > totalLines && lines[lines.length - 1] === '') {
        lines.pop();
    }

    const widthStyle = gutterWidth ? ` style="--hideko-gutter-width: ${gutterWidth}px;"` : '';

    return lines.map((content, idx) => {
        const lineNum = startLine + idx;
        const isHl = hlSet && hlSet.has(lineNum);
        const lineClass = `hideko-line${isHl ? ' hideko-line-highlighted' : ''}`;
        const numHtml = showNumbers 
            ? `<span class="hideko-line-number"${widthStyle} aria-hidden="true">${lineNum}</span>` 
            : '';
        return `<span class="${lineClass}">${numHtml}<span class="hideko-line-content">${content || ' '}</span></span>`;
    }).join('');
}

/**
 * Setup Virtual Buffer & Adaptive Scrolling on large code blocks
 */
function setupVirtualScroll(el, container, rawCode, langDef, conf, options, theme, lang, lineOpts = {}) {
    const buffer = new VirtualBuffer(rawCode);
    virtualRegistry.set(container, buffer);

    const { showLineNumbers, hlSet, startLine: startLineOffset = 1 } = lineOpts;

    const maxHeight = options.maxHeight 
        || container.getAttribute('data-height') 
        || container.getAttribute('data-max-height') 
        || el.getAttribute('data-height') 
        || el.getAttribute('data-max-height') 
        || '500px';

    const isFullHeight = Boolean(
        options.fullHeight ||
        maxHeight === '100%' ||
        maxHeight === '100vh' ||
        container.classList.contains('h-full') ||
        el.classList.contains('h-full')
    );

    const lineHeight = options.lineHeight || 21;
    const overscan = options.overscan || 10;
    const lineCount = buffer.getLineCount();
    const totalHeight = lineCount * lineHeight;
    const maxH = isFullHeight ? (container.clientHeight || window.innerHeight || 500) : (parseInt(maxHeight) || 500);
    const effectiveHeight = Math.min(totalHeight, maxH);

    const maxLineDigits = String(startLineOffset + lineCount).length;
    const gutterWidth = Math.max(32, maxLineDigits * 8 + 18);

    container.classList.add('hideko-pre-block', 'hideko-theme-block', 'hideko-virtual-container');
    if (isFullHeight) {
        container.style.height = '100%';
        container.style.maxHeight = 'none';
    } else {
        container.style.height = `${effectiveHeight}px`;
        container.style.maxHeight = maxHeight;
    }
    container.style.position = 'relative';
    container.setAttribute('data-theme', theme);
    container.setAttribute('data-lang', lang);
    container.setAttribute('data-virtual-active', 'true');

    // Create phantom scroll wrapper & viewport
    container.innerHTML = '';
    const phantom = document.createElement('div');
    phantom.className = 'hideko-virtual-phantom';
    phantom.style.height = `${totalHeight}px`;

    const viewport = document.createElement('div');
    viewport.className = 'hideko-virtual-viewport';

    const codeEl = document.createElement('code');
    codeEl.className = el.className || `language-${lang}`;
    viewport.appendChild(codeEl);

    phantom.appendChild(viewport);
    container.appendChild(phantom);

    // Add Copy Button if enabled
    if (options.copyButton !== false) {
        container.appendChild(createCopyButton(() => buffer.getText()));
    }

    let lastStart = -1;
    let lastEnd = -1;

    function renderWindow() {
        const scrollTop = container.scrollTop;
        const clientHeight = container.clientHeight || window.innerHeight || 500;

        let startLineIdx = Math.floor(scrollTop / lineHeight) - overscan;
        if (startLineIdx < 0) startLineIdx = 0;

        let visibleCount = Math.ceil(clientHeight / lineHeight) + (overscan * 2);
        let endLineIdx = Math.min(lineCount, startLineIdx + visibleCount);

        if (startLineIdx === lastStart && endLineIdx === lastEnd) return;
        lastStart = startLineIdx;
        lastEnd = endLineIdx;

        const topOffset = startLineIdx * lineHeight;
        viewport.style.transform = `translateY(${topOffset}px)`;

        const sliceLines = buffer.getLines(startLineIdx, endLineIdx);
        const sliceText = sliceLines.join('\n');
        const { html } = v8HighlightLines(sliceText, langDef, conf, ['root']);

        const windowStartLine = startLineOffset + startLineIdx;
        codeEl.innerHTML = wrapLinesHtml(html, sliceLines.length, windowStartLine, showLineNumbers, hlSet, gutterWidth);
    }

    let ticking = false;
    container.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                renderWindow();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
            renderWindow();
        });
        ro.observe(container);
    }

    // Initial window render
    renderWindow();
}

/**
 * Extract language name from classList or attributes
 * @param {HTMLElement} el 
 * @returns {string}
 */
export function extractLanguage(el) {
    if (!el) return 'javascript';

    // 1. Check data-lang or h-lang
    const attrLang = el.getAttribute('data-lang') || el.getAttribute('h-lang');
    if (attrLang) return attrLang.toLowerCase();

    // 2. Check parent element (e.g. <pre data-lang="py"><code>...</code></pre>)
    if (el.parentElement) {
        const parentLang = el.parentElement.getAttribute('data-lang') || el.parentElement.getAttribute('h-lang');
        if (parentLang) return parentLang.toLowerCase();
    }

    // 3. Check classList for language-*, lang-*, hljs-*
    const classes = Array.from(el.classList);
    if (el.parentElement) {
        classes.push(...Array.from(el.parentElement.classList));
    }

    for (const cls of classes) {
        const match = cls.match(/^(?:language|lang|hljs)-([a-zA-Z0-9_#+-]+)$/i);
        if (match && match[1]) {
            return match[1].toLowerCase();
        }
    }

    return 'javascript';
}

/**
 * Auto-detect language folder path relative to hideko script if not explicitly provided
 */
export function resolveBasePath(basePath) {
    if (basePath) {
        return basePath.endsWith('/') ? basePath : basePath + '/';
    }
    if (typeof document !== 'undefined') {
        const scriptEl = document.currentScript || document.querySelector('script[src*="hideko-highlight"]');
        if (scriptEl && scriptEl.src) {
            try {
                const scriptUrl = new URL(scriptEl.src, window.location.href);
                return new URL('./languages/', scriptUrl.href).href;
            } catch (e) {}
        }
    }
    return './languages/';
}

/**
 * Load language grammar definition in Browser
 * @param {string} langName 
 * @param {string} [basePath] 
 */
export async function loadLanguageBrowser(langName, basePath) {
    if (!langName) return null;
    const actualLang = languageAliases[langName.toLowerCase()] || langName.toLowerCase();

    if (loadedLanguages.has(actualLang)) {
        const mod = loadedLanguages.get(actualLang);
        if (mod && mod.language) {
            v8RegisterLanguage(langName.toLowerCase(), mod.language);
        }
        return mod;
    }

    if (pendingLoads.has(actualLang)) {
        return pendingLoads.get(actualLang);
    }

    const pathUrl = resolveBasePath(basePath);

    const loadPromise = (async () => {
        try {
            const base = typeof window !== 'undefined' ? window.location.href : 'file:///';
            const scriptUrl = new URL(`${pathUrl}${actualLang}.js`, base).href;

            const mod = await import(scriptUrl);
            const langDef = mod.language || (mod.default && mod.default.language);
            const conf = mod.conf || (mod.default && mod.default.conf) || {};

            if (langDef) {
                v8RegisterLanguage(actualLang, langDef);
                v8RegisterLanguage(langName.toLowerCase(), langDef);
                const res = { language: langDef, conf };
                loadedLanguages.set(actualLang, res);
                return res;
            }
        } catch (e) {
            console.warn(`Hideko: Could not load language grammar "${langName}" from ${pathUrl}`);
        } finally {
            pendingLoads.delete(actualLang);
        }
        return null;
    })();

    pendingLoads.set(actualLang, loadPromise);
    return loadPromise;
}

/**
 * Automatically scan and highlight matching code blocks in the DOM
 * @param {string|HTMLElement|object} [target='pre code, pre[class*="language-"], div[data-lang], .hideko']
 * @param {object} [options={}]
 */
export async function highlightAll(target = 'pre code, pre[class*="language-"], div[data-lang], .hideko', options = {}) {
    if (typeof document === 'undefined') return;

    if (target && typeof target === 'object' && !(target instanceof HTMLElement) && !Array.isArray(target) && !('length' in target)) {
        options = target;
        target = 'pre code, pre[class*="language-"], div[data-lang], .hideko';
    }

    let elements = [];
    if (typeof target === 'string') {
        elements = Array.from(document.querySelectorAll(`${target}:not([data-hideko-processed="true"])`));
    } else if (target instanceof HTMLElement) {
        elements = [target];
    } else if (target && target.length) {
        elements = Array.from(target);
    }

    // Viewport Lazy Loading via IntersectionObserver
    if (options.lazy && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const rootMargin = options.lazyRootMargin || '150px 0px';
        const targetMap = new WeakMap();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                    const targetEl = targetMap.get(entry.target) || entry.target;
                    highlightElement(targetEl, options);
                }
            });
        }, { rootMargin });

        for (const el of elements) {
            const isCodeInPre = el.tagName === 'CODE' && el.parentElement && el.parentElement.tagName === 'PRE';
            const observeEl = isCodeInPre ? el.parentElement : el;
            targetMap.set(observeEl, el);
            observer.observe(observeEl);
        }
        return elements;
    }

    for (const el of elements) {
        await highlightElement(el, options);
    }
}

/**
 * Highlight a single DOM element
 * @param {HTMLElement} el 
 * @param {object} options 
 */
export async function highlightElement(el, options = {}) {
    if (!el) return;
    if (!options.force && el.getAttribute('data-hideko-processed') === 'true') return;

    // Check if target is a <code> inside a <pre>
    const isCodeInPre = el.tagName === 'CODE' && el.parentElement && el.parentElement.tagName === 'PRE';
    const container = isCodeInPre ? el.parentElement : el;

    if (options.force) {
        el.removeAttribute('data-hideko-processed');
        if (container) {
            container.removeAttribute('data-hideko-processed');
            container.removeAttribute('data-virtual-active');
            container.classList.remove('hideko-virtual-container');
            const oldCopyBtns = container.querySelectorAll('.hideko-copy-btn');
            oldCopyBtns.forEach(btn => btn.remove());
            if (!isCodeInPre) {
                container.innerHTML = '';
            } else {
                container.innerHTML = '';
                container.appendChild(el);
            }
        }
    }

    el.setAttribute('data-hideko-processed', 'true');
    if (container) container.setAttribute('data-hideko-processed', 'true');

    const theme = options.theme || el.getAttribute('data-theme') || (container && container.getAttribute('data-theme')) || 'dark';
    const lang = options.lang || extractLanguage(el);
    const rawInput = options.code !== undefined ? String(options.code) : el.textContent;
    const rawCode = rawInput.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/^\n/, '');

    const mod = await loadLanguageBrowser(lang, options.basePath);
    const langDef = mod ? (mod.language || {}) : {};
    const conf = mod ? (mod.conf || {}) : {};

    // Extract Line Numbers and Line Highlighting options
    const showLineNumbers = Boolean(
        options.lineNumbers ||
        el.getAttribute('data-line-numbers') === 'true' ||
        el.hasAttribute('data-line-numbers') ||
        el.classList.contains('line-numbers') ||
        (container && (
            container.getAttribute('data-line-numbers') === 'true' ||
            container.hasAttribute('data-line-numbers') ||
            container.classList.contains('line-numbers')
        ))
    );

    const rawHighlight = options.highlightLines 
        || el.getAttribute('data-line') 
        || el.getAttribute('data-highlight')
        || el.getAttribute('data-highlight-lines')
        || (container && (
            container.getAttribute('data-line') ||
            container.getAttribute('data-highlight') ||
            container.getAttribute('data-highlight-lines')
        ));

    const hlSet = parseHighlightLines(rawHighlight);

    const startLine = parseInt(
        options.startLine 
        || el.getAttribute('data-start-line') 
        || (container && container.getAttribute('data-start-line'))
        || '1',
        10
    ) || 1;

    const lineOpts = { showLineNumbers, hlSet, startLine };

    // Check adaptive virtual scroll threshold
    const lineCount = rawCode.split('\n').length;
    const threshold = options.virtualThreshold ?? 300;
    const isExplicitVirtual = el.getAttribute('data-virtual') === 'true' 
        || (container && container.getAttribute('data-virtual') === 'true')
        || (options.virtual === true && !options.virtualThreshold);
    const isExplicitDisabled = el.getAttribute('data-virtual') === 'false' 
        || (container && container.getAttribute('data-virtual') === 'false' || options.virtual === false);

    const shouldVirtualize = !isExplicitDisabled && (isExplicitVirtual || lineCount >= threshold);

    if (shouldVirtualize) {
        setupVirtualScroll(el, container, rawCode, langDef, conf, options, theme, lang, lineOpts);
        return;
    }

    // Standard Normal Mode (< threshold lines)
    const needsLineWrap = showLineNumbers || (hlSet && hlSet.size > 0);
    const { html: formatted } = needsLineWrap
        ? v8HighlightLines(rawCode, langDef, conf, ['root'])
        : v8Highlight(rawCode, langDef, conf, ['root']);

    container.classList.add('hideko-pre-block', 'hideko-theme-block');
    container.setAttribute('data-theme', theme);
    container.setAttribute('data-lang', lang);

    const maxLineDigits = String(startLine + lineCount).length;
    const gutterWidth = Math.max(32, maxLineDigits * 8 + 18);
    const finalHtml = wrapLinesHtml(formatted, lineCount, startLine, showLineNumbers, hlSet, gutterWidth);

    const codeEl = isCodeInPre ? el : document.createElement('code');
    codeEl.innerHTML = finalHtml;

    if (!isCodeInPre) {
        container.innerHTML = '';
        container.appendChild(codeEl);
    }

    if (options.copyButton !== false) {
        container.style.position = 'relative';
        container.appendChild(createCopyButton(rawCode));
    }
}

