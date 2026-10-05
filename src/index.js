/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

import { highlight, highlightLines, tokenizeLinesToState, registerLanguage } from './core/hideko-v8.js';
import { highlightAll, highlightElement, virtualRegistry } from './browser/scanner.js';
import { highlightMarkdown, createMarkedExtension } from './browser/markdown-scanner.js';
import { detectLanguage, languageAliases } from './languages/language-aliases.js';
import { VirtualBuffer } from './core/virtual-buffer.js';
import { parseHighlightLines, createCopyButton } from './core/utils.js';

export const version = '1.0.0';

export const HidekoHighlight = {
    version,
    highlight,
    highlightLines,
    tokenizeLinesToState,
    registerLanguage,
    highlightAll,
    highlightElement,
    highlightMarkdown,
    createMarkedExtension,
    detectLanguage,
    languageAliases,
    VirtualBuffer,
    virtualRegistry,
    parseHighlightLines,
    createCopyButton,

    // Aliases for developer convenience
    run: highlightAll,
    Run: highlightAll
};

export {
    highlight,
    highlightLines,
    tokenizeLinesToState,
    registerLanguage,
    highlightAll,
    highlightElement,
    highlightMarkdown,
    createMarkedExtension,
    detectLanguage,
    languageAliases,
    VirtualBuffer,
    virtualRegistry,
    parseHighlightLines,
    createCopyButton
};

export const HidekoCodeBlock = HidekoHighlight;

if (typeof window !== 'undefined') {
    window.HidekoHighlight = HidekoHighlight;
    window.HidekoCodeBlock = HidekoCodeBlock;
    window.Hideko = window.Hideko || HidekoHighlight;
}

export default HidekoHighlight;

