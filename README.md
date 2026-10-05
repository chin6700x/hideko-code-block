# hideko-code-block ⚡

> **Ultra-lightweight, High-Performance Code Syntax Highlighter with Adaptive Virtual Scroll, Monarch Lexer Engine & CLI Tool**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/bundler-Vite%205-646CFF.svg)](https://vitejs.dev/)
[![Dependencies](https://img.shields.io/badge/dependencies-0%20runtime-brightgreen.svg)]()
[![Bundle Size](https://img.shields.io/badge/core%20size-~12KB%20gzip-orange.svg)]()

**hideko-code-block** is an ultra-fast, zero-dependency code syntax highlighting engine extracted and optimized from the Hideko project. It focuses purely on lightning-fast syntax parsing (Monarch Lexer), adaptive virtual scroll rendering, Node.js file conversion, a terminal CLI tool, and automated Markdown/DOM code block scanning — completely stripped of heavy editor overhead.

* **Author**: Wirot Chookeaw Chin6700x (<Chin6700X@gmail.com>)
* **License**: MIT License

---

## 🚀 Key Features

* **⚡ Lightning Fast (< 10ms)**: Parses and highlights syntax directly to ready-to-render HTML in milliseconds.
* **🖼️ Adaptive Virtual Scrolling**: Easily handles large files from 1,000 to **50,000+ lines** with smooth 60 FPS scrolling and minimal DOM nodes (< 2,500 active nodes).
* **🖥️ Built-in Node.js CLI**: Highlight single files, batches, or directories directly from the terminal.
* **📄 Standalone & Snippet Modes**: Export either lightweight HTML code snippets or self-contained HTML documents with embedded CSS.
* **📝 Smart Markdown Scanner**: Detects and highlights fenced code blocks (```` ```lang ````) in Markdown content.
* **🌐 Browser DOM Scanner**: Automatically discovers and highlights `<pre><code>`, `<div data-lang="...">`, and custom blocks across your pages.
* **🔢 Line Numbers & Line Highlighting**: Built-in line numbering and specific line range highlighting (e.g. `highlight: "1,3-5"`).
* **📋 Automatic Copy Button**: One-click code copying to clipboard with visual feedback.
* **🎨 7 Built-in Themes**: `dark`, `light`, `dracula`, `one-dark`, `nord`, `monokai`, and `github-dark`.
* **🌐 33+ Language Grammars**: Modular Monarch grammar definitions with dynamic on-demand loading.
* **📦 Zero Runtime Dependencies**: Pure vanilla JavaScript for both Browser and Node.js environments.

---

## 💻 Quick Start & Development

```bash
# Install dependencies
npm install

# Run Vite dev server & open the Demo Hub
npm run dev

# Build production bundle (ESM, UMD, minified CSS, modular languages, Node CLI)
npm run build

# Preview production build
npm run preview

# Run the test suite
npm test
```

---

## 🌐 Browser Usage

### 1. UMD / Script Tag (IIFE)

```html
<!-- 1. Include CSS theme stylesheet -->
<link rel="stylesheet" href="dist/style.min.css">

<!-- 2. Include hideko-code-block UMD bundle -->
<script src="dist/hideko-code-block.umd.js"></script>

<!-- 3. Pre-formatted code block -->
<pre data-line-numbers="true"><code class="language-javascript">
import { useState } from 'react';

export function Counter() {
    const [count, setCount] = useState(0);
    return &lt;button onClick={() => setCount(c => c + 1)}&gt;Count: {count}&lt;/button&gt;;
}
</code></pre>

<script>
    // Automatically highlight all code blocks on the page
    HidekoCodeBlock.highlightAll('pre code', {
        basePath: 'dist/languages/',  // Path to language grammar files
        theme: 'dracula',             // Choose theme
        lineNumbers: true,            // Display line numbers
        copyButton: true,             // Add one-click copy button
        virtual: true,                // Enable adaptive virtual scroll
        virtualThreshold: 300         // Auto-activate virtual scroll above 300 lines
    });
</script>
```

### 2. ES Module (ESM)

```html
<link rel="stylesheet" href="dist/style.min.css">

<script type="module">
    import { highlightAll, highlight } from './dist/hideko-code-block.js';

    // Scan DOM elements
    await highlightAll('pre code', { basePath: './dist/languages/' });

    // Or highlight raw code string directly
    const result = highlight('const answer = 42;', 'javascript');
    console.log(result.html);
</script>
```

---

## 🖥️ Command Line Interface (CLI)

You can run the CLI directly using Node.js:

```bash
# 1. Convert a JavaScript file to a standalone HTML page with Dracula theme
node bin/hideko.js convert app.js -o app.html --theme dracula --standalone

# 2. Convert with line numbers and highlight lines 1 and 3 through 5
node bin/hideko.js convert query.sql -o query.html --theme nord --line-numbers --highlight "1,3-5"

# 3. Highlight a Markdown file and render all fenced code blocks
node bin/hideko.js convert README.md -o output.html --markdown --standalone

# 4. List all 33+ supported programming languages
node bin/hideko.js languages
```

### CLI Options:

| Option | Shorthand | Description | Default |
| :--- | :--- | :--- | :--- |
| `--output <file>` | `-o` | Output file path | `stdout` |
| `--lang <lang>` | `-l` | Language syntax identifier | Auto-detected |
| `--theme <theme>` | `-t` | Theme name (`dark`, `light`, `dracula`, etc.) | `dark` |
| `--line-numbers` | `-n` | Include line numbers in gutter | `false` |
| `--highlight <range>`| `-H` | Highlight line ranges (e.g. `1,3-5`) | None |
| `--standalone` | `-s` | Output full HTML document with embedded CSS | `false` |
| `--markdown` | `-m` | Parse and highlight fenced code blocks in Markdown | `false` |

---

## 🛠️ Node.js API (Backend)

```javascript
import { highlightFile, highlightString, highlightMarkdown } from 'hideko-code-block/node';

// 1. Highlight a code string
const snippet = await highlightString('const greeting = "Hello, World!";', {
    lang: 'javascript',
    theme: 'dracula',
    lineNumbers: true
});
console.log(snippet.html);

// 2. Highlight a file and save as standalone HTML
await highlightFile('./src/index.js', {
    theme: 'one-dark',
    output: './dist/code.html',
    standalone: true,
    lineNumbers: true,
    highlightLines: '5-12'
});

// 3. Highlight all code blocks in a Markdown string
const markdown = `
# Sample
\`\`\`python
def add(a, b):
    return a + b
\`\`\`
`;
const rendered = await highlightMarkdown(markdown, { theme: 'monokai' });
```

---

## 📂 Project Structure

```
hideko-code-block/
├── bin/                 # CLI executable (`hideko`)
├── demo/                # Interactive Demo Hub & 12 comprehensive sample pages
│   ├── 00-file-viewer.html    # Fullscreen interactive file viewer
│   ├── 01-basic-iife.html     # UMD/IIFE script loading demo
│   ├── 02-esm-module.html     # ES Module import demo
│   ├── 03-all-themes.html     # Theme showcase (all 7 themes)
│   ├── 04-multi-languages.html# Multi-language demo (JS, Python, SQL, Rust, Go...)
│   ├── 05-auto-scanner.html   # Automated DOM scanner test
│   ├── 06-manual-highlight.html # Manual low-level highlight() API
│   ├── 07-dynamic-inject.html # Dynamic DOM injection & reactivity
│   ├── 08-copy-button.html    # One-click copy-to-clipboard button
│   ├── 09-lazy-scroll.html    # Viewport lazy loading with IntersectionObserver
│   ├── 10-virtual-scroll.html # Adaptive virtual scrolling (50,000+ lines)
│   ├── 11-line-numbers.html   # Line numbers & line highlighting
│   └── index.html             # Demo Hub Dashboard
├── dist/                # Production distribution (bundled via build-dist.js)
│   ├── demo/                  # Self-contained runnable demos
│   ├── languages/             # 33+ standalone modular languages
│   ├── node/                  # Node.js backend entry points
│   ├── hideko-code-block.js   # ESM bundle
│   ├── hideko-code-block.umd.js # UMD / Browser bundle
│   ├── style.css              # Full CSS stylesheets
│   └── style.min.css          # Minified CSS
├── scripts/             # Post-build compiler script (build-dist.js)
├── src/
│   ├── browser/         # DOM scanner, IntersectionObserver, Markdown parser
│   ├── core/            # Monarch lexer engine, VirtualBuffer, utilities
│   ├── css/             # CSS theme variables and tokens
│   ├── languages/       # 33 modular Monarch language definitions
│   ├── node/            # CLI runner and backend file converter
│   └── index.js         # Library main entry point
├── test/                # Unit test runner and test cases
├── vite.config.js       # Vite library-mode configuration
├── LICENSE              # MIT License
└── package.json
```

---

## 🎭 Supported Themes

| Theme | CSS Identifier | Style |
| :--- | :--- | :--- |
| **Dark** | `dark` | Modern sleek dark theme (default) |
| **Light** | `light` | Clean, high-contrast light theme |
| **Dracula** | `dracula` | Popular vibrant gothic theme |
| **One Dark** | `one-dark` | Atom / VS Code inspired dark palette |
| **Nord** | `nord` | Arctic, north-bluish clean palette |
| **Monokai** | `monokai` | Classic vibrant developer palette |
| **GitHub Dark** | `github-dark` | Official GitHub dark mode styling |

---

## 📜 License

Distributed under the [MIT License](./LICENSE).  
Copyright (c) 2026 **Chin6700x** (<Chin6700X@gmail.com>).
