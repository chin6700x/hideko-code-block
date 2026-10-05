/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

import { highlight as v8Highlight } from '../core/hideko-v8.js';
import { loadLanguageBrowser } from './scanner.js';

/**
 * Scan and transform fenced code blocks in raw Markdown text
 * ```lang
 * code...
 * ```
 * @param {string} markdownText - Raw markdown text
 * @param {object} options
 * @param {string} [options.theme='dark'] - Theme to apply
 * @param {string} [options.environment='auto'] - 'node' | 'browser' | 'auto'
 * @param {function} [options.loader] - Optional custom language loader
 * @returns {Promise<string>} Markdown text with highlighted HTML code blocks
 */
export async function highlightMarkdown(markdownText, options = {}) {
    if (!markdownText || typeof markdownText !== 'string') return '';

    const theme = options.theme || 'dark';
    let loadFn = options.loader;
    if (!loadFn) {
        if (options.environment === 'node' || (typeof window === 'undefined' && typeof process !== 'undefined')) {
            try {
                let nodeConv;
                try {
                    nodeConv = await import(/* @vite-ignore */ './node/file-converter.js');
                } catch (e1) {
                    try {
                        nodeConv = await import(/* @vite-ignore */ '../node/file-converter.js');
                    } catch (e2) {
                        nodeConv = await import(/* @vite-ignore */ '../dist/node/file-converter.js');
                    }
                }
                loadFn = nodeConv.loadLanguageNode;
            } catch (e) {
                loadFn = (lang) => loadLanguageBrowser(lang, options.basePath);
            }
        } else {
            loadFn = (lang) => loadLanguageBrowser(lang, options.basePath);
        }
    }

    // Regex matching ```[lang]\n[code]\n```
    const codeBlockRegex = /(^|\n)```([a-zA-Z0-9_#+-]*)\r?\n([\s\S]*?)\r?\n```/g;

    const matches = [];
    let match;
    while ((match = codeBlockRegex.exec(markdownText)) !== null) {
        matches.push({
            fullMatch: match[0],
            prefix: match[1],
            lang: match[2].trim() || 'javascript',
            code: match[3],
            index: match.index
        });
    }

    if (matches.length === 0) {
        return markdownText;
    }

    // Process all matches
    let result = '';
    let lastIndex = 0;

    for (const m of matches) {
        result += markdownText.substring(lastIndex, m.index);

        const mod = await loadFn(m.lang);
        const langDef = mod ? (mod.language || {}) : {};
        const conf = mod ? (mod.conf || {}) : {};

        const { html: formatted } = v8Highlight(m.code, langDef, conf, ['root']);
        const replacement = `${m.prefix}<pre class="hideko-pre-block hideko-theme-block" data-theme="${theme}" data-lang="${m.lang}"><code>${formatted}</code></pre>`;

        result += replacement;
        lastIndex = m.index + m.fullMatch.length;
    }

    result += markdownText.substring(lastIndex);
    return result;
}

/**
 * Adapter extension for marked.js
 * Usage: marked.use(createMarkedExtension({ theme: 'dracula' }));
 */
export function createMarkedExtension(options = {}) {
    const theme = options.theme || 'dark';
    return {
        renderer: {
            code(code, infostring) {
                const lang = (infostring || '').match(/\S*/)[0] || 'javascript';
                return `<pre class="hideko-pre-block hideko-theme-block" data-theme="${theme}" data-lang="${lang}"><code>${code}</code></pre>`;
            }
        }
    };
}
