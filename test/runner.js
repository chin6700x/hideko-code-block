/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { highlightString, highlightFile } from '../dist/node/file-converter.js';
import { highlightMarkdown, detectLanguage } from '../dist/hideko-highlight.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let failed = 0;

async function test(name, fn) {
    try {
        await fn();
        console.log(`  ✓ ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ✗ ${name}`);
        console.error(err);
        failed++;
    }
}

async function runTests() {
    console.log('\n🧪 Running hideko-code-block Test Suite...\n');

    // 1. Language Detection
    console.log('--- Language Detection ---');
    await test('detects javascript from .js and .mjs', () => {
        assert.strictEqual(detectLanguage('app.js'), 'javascript');
        assert.strictEqual(detectLanguage('index.mjs'), 'javascript');
    });

    await test('detects python from .py', () => {
        assert.strictEqual(detectLanguage('script.py'), 'python');
    });

    await test('detects sql from .sql', () => {
        assert.strictEqual(detectLanguage('query.sql'), 'sql');
    });

    // 2. String Highlighting (Node.js API)
    console.log('\n--- Node.js String Highlighting ---');
    await test('highlights basic JavaScript code with tokens', async () => {
        const code = 'const greeting = "Hello Hideko";';
        const html = await highlightString(code, { lang: 'javascript', theme: 'dracula' });
        assert(html.includes('data-theme="dracula"'), 'Missing theme attribute');
        assert(html.includes('mtk5'), 'Missing keyword token class');
        assert(html.includes('mtk7'), 'Missing string token class');
    });

    await test('highlights Python code correctly', async () => {
        const code = 'def calculate(n):\n    return n * 2';
        const html = await highlightString(code, { lang: 'python', theme: 'one-dark' });
        assert(html.includes('data-theme="one-dark"'), 'Missing theme attribute');
        assert(html.includes('mtk5'), 'Missing keyword token class (def/return)');
    });

    await test('generates standalone HTML document with embedded CSS', async () => {
        const code = 'SELECT id, name FROM users;';
        const html = await highlightString(code, {
            lang: 'sql',
            theme: 'github-dark',
            standalone: true,
            title: 'SQL Test'
        });
        assert(html.includes('<!DOCTYPE html>'), 'Missing doctype');
        assert(html.includes('<title>SQL Test</title>'), 'Missing title');
        assert(html.includes('--hideko-bg: #0d1117'), 'Missing embedded CSS variables');
    });

    // 3. File Highlighting (Node.js API)
    console.log('\n--- Node.js File Highlighting ---');
    await test('reads and highlights file from disk', async () => {
        const testFilePath = path.resolve(__dirname, 'fixtures/sample.js');
        const fixtureDir = path.dirname(testFilePath);
        if (!fs.existsSync(fixtureDir)) fs.mkdirSync(fixtureDir, { recursive: true });
        fs.writeFileSync(testFilePath, 'function add(a, b) { return a + b; }');

        const outPath = path.resolve(__dirname, 'fixtures/sample.html');
        const result = await highlightFile(testFilePath, {
            theme: 'nord',
            output: outPath,
            standalone: true
        });

        assert.strictEqual(result.lang, 'javascript');
        assert(fs.existsSync(outPath), 'Output file was not created');
        const savedHtml = fs.readFileSync(outPath, 'utf8');
        assert(savedHtml.includes('<!DOCTYPE html>'));

        // Clean up fixtures
        fs.rmSync(fixtureDir, { recursive: true, force: true });
    });

    // 4. Markdown Code Block Scanner
    console.log('\n--- Markdown Code Block Scanner ---');
    await test('scans and transforms fenced code blocks in Markdown', async () => {
        const markdown = `
# Markdown Test
Here is some JS:
\`\`\`javascript
const score = 100;
\`\`\`

And some Python:
\`\`\`python
x = True
\`\`\`
`.trim();

        const transformed = await highlightMarkdown(markdown, { theme: 'monokai' });
        assert(transformed.includes('data-theme="monokai"'), 'Missing theme on code blocks');
        assert(transformed.includes('data-lang="javascript"'), 'Missing JS block');
        assert(transformed.includes('data-lang="python"'), 'Missing Python block');
        assert(transformed.includes('# Markdown Test'), 'Markdown headers preserved');
    });

    // 5. Line Numbers & Line Highlighting
    console.log('\n--- Line Numbers & Line Highlighting ---');
    await test('parses line highlight ranges correctly', async () => {
        const { parseHighlightLines } = await import('../dist/hideko-highlight.js');
        const set1 = parseHighlightLines('3, 5-8, 12');
        assert.deepStrictEqual(Array.from(set1).sort((a, b) => a - b), [3, 5, 6, 7, 8, 12]);

        const set2 = parseHighlightLines([1, [4, 6], 10]);
        assert.deepStrictEqual(Array.from(set2).sort((a, b) => a - b), [1, 4, 5, 6, 10]);
    });

    await test('wraps lines with line numbers and highlighted lines', async () => {
        const code = 'line one\nline two\nline three\nline four\nline five';
        const html = await highlightString(code, {
            lang: 'javascript',
            lineNumbers: true,
            highlightLines: '2, 4-5'
        });

        assert(html.includes('hideko-line-number'), 'Missing hideko-line-number element');
        assert(html.includes('hideko-line-highlighted'), 'Missing hideko-line-highlighted class');
        assert(html.includes('hideko-line-content'), 'Missing hideko-line-content wrapper');
    });

    await test('correctly normalizes Windows CRLF without creating extra empty lines', async () => {
        const crlfCode = "const a = 1;\r\nconst b = 2;\r\nconst c = 3;";
        const html = await highlightString(crlfCode, {
            lang: 'javascript',
            lineNumbers: true
        });

        assert(!html.includes('\r'), 'HTML must not contain any carriage return (\\r) characters');
        const matchCount = (html.match(/class="hideko-line"/g) || []).length;
        assert.strictEqual(matchCount, 3, 'Must produce exactly 3 lines matching source without phantom empty lines');
    });

    console.log(`\n================================`);
    console.log(`Tests: ${passed} passed, ${failed} failed`);
    console.log(`================================\n`);

    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
