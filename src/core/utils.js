/**
 * Shared Utilities for Hideko
 */

export const COPY_ICON_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
export const CHECK_ICON_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

/**
 * Creates a reusable Copy button element with SVG icons and clipboard handler
 * @param {Function|string} getText - callback returning text to copy, or string
 * @returns {HTMLButtonElement}
 */
export function createCopyButton(getText) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hideko-copy-btn';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.innerHTML = `${COPY_ICON_SVG} <span>Copy</span>`;

    btn.onclick = () => {
        const text = typeof getText === 'function' ? getText() : (getText || '');
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                btn.innerHTML = `${CHECK_ICON_SVG} <span>Copied!</span>`;
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = `${COPY_ICON_SVG} <span>Copy</span>`;
                    btn.classList.remove('copied');
                }, 2000);
            }).catch(() => {});
        }
    };
    return btn;
}

/**
 * Parse line highlight ranges (e.g., "3, 5-8, 12" or [3, [5, 8], 12]) into a Set of line numbers
 * @param {string|number[]|any} input
 * @returns {Set<number>}
 */
export function parseHighlightLines(input) {
    const lines = new Set();
    if (!input) return lines;

    if (Array.isArray(input)) {
        input.forEach(item => {
            if (typeof item === 'number') lines.add(item);
            else if (Array.isArray(item) && item.length >= 2) {
                for (let i = item[0]; i <= item[1]; i++) lines.add(i);
            } else if (typeof item === 'string') {
                parseHighlightLines(item).forEach(n => lines.add(n));
            }
        });
        return lines;
    }

    const parts = String(input).split(',');
    for (const p of parts) {
        const part = p.trim();
        if (!part) continue;
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                    lines.add(i);
                }
            }
        } else {
            const num = parseInt(part, 10);
            if (!isNaN(num)) lines.add(num);
        }
    }
    return lines;
}

