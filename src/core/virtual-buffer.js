/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

/**
 * VirtualBuffer — Lightweight In-Memory Line Buffer for Hideko Lite
 * Manages raw code lines in memory with O(1) access and zero DOM overhead.
 */
export class VirtualBuffer {
    /**
     * @param {string} [initialText='']
     */
    constructor(initialText = '') {
        this.lines = [''];
        this.setText(initialText);
    }

    /**
     * Set buffer text, normalizing line endings
     * @param {string} text 
     */
    setText(text) {
        if (!text) {
            this.lines = [''];
            return;
        }
        const normalized = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        this.lines = normalized.split('\n');
        if (this.lines.length === 0) {
            this.lines = [''];
        }
    }

    /**
     * Get full text (used by clipboard copy)
     * @returns {string}
     */
    getText() {
        return this.lines.join('\n');
    }

    /**
     * Get line count
     * @returns {number}
     */
    getLineCount() {
        return this.lines.length;
    }

    /**
     * Get a single line by 0-based index
     * @param {number} index 
     * @returns {string}
     */
    getLine(index) {
        if (index < 0 || index >= this.lines.length) return '';
        return this.lines[index];
    }

    /**
     * Get a slice of lines
     * @param {number} startIndex 
     * @param {number} endIndex 
     * @returns {string[]}
     */
    getLines(startIndex, endIndex) {
        const start = Math.max(0, startIndex);
        const end = Math.min(this.lines.length, endIndex);
        return this.lines.slice(start, end);
    }
}
