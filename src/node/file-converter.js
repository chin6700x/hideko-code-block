import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { highlight, highlightLines, registerLanguage } from '../core/hideko-v8.js';
import { detectLanguage, languageAliases } from '../languages/language-aliases.js';
import { parseHighlightLines } from '../core/utils.js';

export { parseHighlightLines };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory language cache for Node runtime
const loadedLanguages = new Map();

/**
 * Load language grammar definition in Node.js
 * @param {string} langName 
 */
export async function loadLanguageNode(langName) {
    if (!langName) return null;
    const actualLang = languageAliases[langName.toLowerCase()] || langName.toLowerCase();

    if (loadedLanguages.has(actualLang)) {
        return loadedLanguages.get(actualLang);
    }

    try {
        const candidatePaths = [
            path.resolve(__dirname, `../languages/${actualLang}.js`),
            path.resolve(__dirname, `../dist/languages/${actualLang}.js`),
            path.resolve(__dirname, `../../dist/languages/${actualLang}.js`),
            path.resolve(__dirname, `../src/languages/${actualLang}.js`)
        ];
        let foundPath = candidatePaths.find(p => fs.existsSync(p));
        if (foundPath) {
            const mod = await import(`file://${foundPath}`);
            const langDef = mod.language || (mod.default && mod.default.language);
            const conf = mod.conf || (mod.default && mod.default.conf) || {};

            if (langDef) {
                registerLanguage(actualLang, langDef);
                registerLanguage(langName.toLowerCase(), langDef);
                const result = { language: langDef, conf };
                loadedLanguages.set(actualLang, result);
                return result;
            }
        }
    } catch (err) {
        console.warn(`Hideko: Warning loading language "${langName}":`, err.message);
    }
    return null;
}

/**
 * Read the bundled CSS for standalone HTML generation
 */
let cachedCss = null;
export function getEmbeddedCss() {
    if (cachedCss) return cachedCss;
    try {
        const candidateCssPaths = [
            path.resolve(__dirname, '../style.css'),
            path.resolve(__dirname, '../dist/style.css'),
            path.resolve(__dirname, '../../dist/style.css'),
            path.resolve(__dirname, '../css/hideko-highlight.css'),
            path.resolve(__dirname, '../src/css/hideko-highlight.css')
        ];
        let foundCss = candidateCssPaths.find(p => fs.existsSync(p));
        if (foundCss) {
            cachedCss = fs.readFileSync(foundCss, 'utf8');
            return cachedCss;
        }
    } catch (e) {}
    return '';
}



/**
 * Highlight a raw code string in Node.js
 * @param {string} code - Raw code string
 * @param {object} options
 * @param {string} [options.lang='javascript'] - Language identifier
 * @param {string} [options.theme='dark'] - Theme name ('dark', 'light', 'dracula', 'one-dark', 'nord', 'monokai', 'github-dark')
 * @param {boolean} [options.lineNumbers=false] - Show line numbers
 * @param {string|number[]} [options.highlightLines] - Highlighted line ranges
 * @param {boolean} [options.standalone=false] - Return complete HTML document
 * @param {string} [options.title] - Page title for standalone document
 * @returns {Promise<string>} HTML string
 */
export async function highlightString(code, options = {}) {
    const rawCode = String(code || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lang = options.lang || 'javascript';
    const theme = options.theme || 'dark';
    const standalone = options.standalone ?? false;
    const title = options.title || `Code (${lang})`;

    const mod = await loadLanguageNode(lang);
    const langDef = mod ? (mod.language || {}) : {};
    const conf = mod ? (mod.conf || {}) : {};

    const hlSet = parseHighlightLines(options.highlightLines);
    const needsLineWrap = Boolean(options.lineNumbers || hlSet.size > 0);

    const { html: formatted } = needsLineWrap
        ? highlightLines(rawCode, langDef, conf, ['root'])
        : highlight(rawCode, langDef, conf, ['root']);

    let bodyHtml = formatted;

    if (needsLineWrap) {
        const cleanHtml = String(formatted).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const rawLines = cleanHtml.split('\n');
        const totalLines = rawLines.length;
        const startLine = options.startLine || 1;
        const maxLineDigits = String(startLine + totalLines).length;
        const gutterWidth = Math.max(32, maxLineDigits * 8 + 18);
        const widthStyle = ` style="--hideko-gutter-width: ${gutterWidth}px;"`;

        bodyHtml = rawLines.map((lineContent, idx) => {
            const lineNum = startLine + idx;
            const isHl = hlSet.has(lineNum);
            const lineClass = `hideko-line${isHl ? ' hideko-line-highlighted' : ''}`;
            const numPrefix = options.lineNumbers ? `<span class="hideko-line-number"${widthStyle} aria-hidden="true">${lineNum}</span>` : '';
            return `<span class="${lineClass}">${numPrefix}<span class="hideko-line-content">${lineContent || ' '}</span></span>`;
        }).join('');
    }

    const snippetHtml = `
<pre class="hideko-pre-block hideko-theme-block" data-theme="${theme}" data-lang="${lang}"><code>${bodyHtml}</code></pre>
`.trim();

    if (!standalone) {
        return snippetHtml;
    }

    const cssContent = getEmbeddedCss();
    return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 24px;
            background-color: var(--hideko-bg, #1e1e1e);
            color: var(--hideko-fg, #d4d4d4);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        ${cssContent}
    </style>
</head>
<body data-theme="${theme}">
${snippetHtml}
</body>
</html>`;
}

/**
 * Highlight a file from disk in Node.js
 * @param {string} inputPath - Path to input file
 * @param {object} options
 * @param {string} [options.lang] - Override language detection
 * @param {string} [options.theme='dark'] - Theme name
 * @param {string} [options.output] - Optional output file path
 * @param {boolean} [options.standalone=false] - Return complete HTML document
 * @returns {Promise<{ html: string, rawCode: string, lang: string, outputPath?: string }>}
 */
export async function highlightFile(inputPath, options = {}) {
    const fullInputPath = path.resolve(process.cwd(), inputPath);
    if (!fs.existsSync(fullInputPath)) {
        throw new Error(`Hideko: File not found "${inputPath}"`);
    }

    const rawCode = await fs.promises.readFile(fullInputPath, 'utf8');
    const detectedLang = options.lang || detectLanguage(path.basename(fullInputPath));
    const title = options.title || path.basename(fullInputPath);

    const html = await highlightString(rawCode, {
        ...options,
        lang: detectedLang,
        title
    });

    let outputPath = null;
    if (options.output) {
        outputPath = path.resolve(process.cwd(), options.output);
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            await fs.promises.mkdir(dir, { recursive: true });
        }
        await fs.promises.writeFile(outputPath, html, 'utf8');
    }

    return {
        html,
        rawCode,
        lang: detectedLang,
        outputPath
    };
}
