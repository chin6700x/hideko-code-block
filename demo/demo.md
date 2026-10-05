# Hideko Code Block — Comprehensive Demo Suite & Test Specifications

The `demo/` directory contains standalone HTML pages testing every aspect of the built artifacts in `dist/`. Each demo exercises `dist/` in a distinct environment and usage scenario to ensure that all distribution bundles function flawlessly before public release.

---

## 📂 Demo Folder Structure

```
demo/
├── 00-file-viewer.html         # Interactive full-viewport code viewer (w-full, h-full, FAB, live settings)
├── 01-basic-iife.html          # Browser UMD/IIFE bundle loaded via classic <script> tag
├── 02-esm-module.html          # ES Module bundle loaded via <script type="module">
├── 03-all-themes.html          # Side-by-side comparison of all 7 built-in themes
├── 04-multi-languages.html     # Concurrent multi-language highlighting (JS, Python, SQL, CSS, HTML, JSON)
├── 05-auto-scanner.html        # DOM auto-scanner highlightAll() covering all selector variations
├── 06-manual-highlight.html    # Low-level highlight() API called programmatically on raw code strings
├── 07-dynamic-inject.html      # Dynamic code block injection (SPA / AJAX / streaming scenarios)
├── 08-copy-button.html         # One-click copy button functionality & clipboard verification
├── 09-lazy-scroll.html         # Viewport lazy-loading via IntersectionObserver
├── 10-virtual-scroll.html      # VirtualBuffer & adaptive scrolling engine (50,000+ lines stress test)
├── 11-line-numbers.html        # Line numbers gutter & line range highlighting
├── demo.md                     # Demo suite specifications & verification guide (this file)
└── index.html                  # Demo Hub landing page & navigation index
```

---

## 📋 Demo Details & Verification Objectives

### Demo 00: Interactive File Viewer (`00-file-viewer.html`)
**Goal:** Interactive desktop-grade code viewer application supporting full viewport (`w-full`, `h-full`) and real-time Hideko configuration.
- **Layout:** Full viewport height and width (`100vw`, `100vh`), custom sleek scrollbars, zero layout overflows.
- **Floating Action Button (FAB):** Prominent gradient button in bottom-right corner triggering native file picker or via keyboard shortcut `Ctrl+O` / `Cmd+O`.
- **Drag & Drop:** Instant drag-and-drop file ingestion anywhere on the browser window with an animated dropzone overlay.
- **Auto Language Detection:** Detects languages automatically from file extensions (e.g., `.py` → Python, `.ts`/`.tsx` → TypeScript, `.sql` → SQL).
- **Floating Settings Panel:**
  - Instant live switching between all 7 themes (`dark`, `light`, `dracula`, `one-dark`, `nord`, `monokai`, `github-dark`).
  - Manual language override select.
  - Line numbers toggle switch.
  - Highlight line ranges input (e.g. `3, 7-10, 15`).
  - Start line offset number input.
  - Virtual Scroll Engine mode (Auto / Always Virtual / Normal Mode).
  - Font size slider (11px – 24px) with instant rem recalculation.
  - Word wrap toggle switch.
  - One-click sample file loaders: React TSX Component, Python ML Pipeline, Complex SQL query, or 2,500-line stress test.
- **Telemetry Bar:** Displays active filename, formatted file size, line count, render duration in milliseconds, and active virtualization mode.

---

### Demo 01: Basic IIFE / UMD (`01-basic-iife.html`)
**Goal:** Verify that `dist/hideko-code-block.umd.js` works in browser global scope when included via standard `<script>` tag.
- Loads `dist/hideko-code-block.umd.js` + `dist/style.min.css`.
- Loads language grammar `dist/languages/javascript.js`.
- Calls `HidekoCodeBlock.highlightAll()` on DOM elements.
- **Assertion:** Token classes (`.mtk5`, `.mtk7`, `.mtk11`) exist in DOM with correct theme styling.

---

### Demo 02: ESM Module (`02-esm-module.html`)
**Goal:** Verify that `dist/hideko-code-block.js` (ES Module) works correctly with `<script type="module">`.
- Imports `highlight` and `highlightAll` from `../dist/hideko-code-block.js`.
- Dynamically imports language module: `await import('../dist/languages/python.js')`.
- **Assertion:** ESM output matches UMD output pixel-for-pixel and token-for-token.

---

### Demo 03: All Themes Showcase (`03-all-themes.html`)
**Goal:** Display identical code blocks across all 7 built-in themes for visual contrast and style verification.
- Tested Themes: `dark`, `light`, `dracula`, `one-dark`, `nord`, `monokai`, `github-dark`.
- Renders 7 stacked code blocks with identical JavaScript code, each isolated with its own `data-theme`.
- **Assertion:** Theme CSS variables (`--hideko-bg`, `--hideko-fg`, `--mtk*`) apply properly without style leakage.

---

### Demo 04: Multi Languages (`04-multi-languages.html`)
**Goal:** Verify simultaneous loading and highlighting of diverse programming and markup languages.
- Tested Languages: JavaScript, Python, SQL, CSS, HTML, JSON, Rust, Go.
- **Assertion:** Each language renders corresponding semantic token classes according to its grammar specification (keywords, strings, numbers, properties).

---

### Demo 05: Auto Scanner (`05-auto-scanner.html`)
**Goal:** Verify that `highlightAll()` discovers and processes all supported DOM markup variations.
- Supported selector variants tested:
  1. `<pre><code class="language-javascript">...</code></pre>` (Standard markdown HTML)
  2. `<pre class="language-python">...</pre>` (Language class directly on `<pre>`)
  3. `<div data-lang="sql">...</div>` (Explicit `data-lang` attribute)
  4. `<div h-lang="css">...</div>` (Hideko custom `h-lang` attribute)
  5. `<pre><code class="lang-go">...</code></pre>` (Legacy `lang-` prefix)
  6. `<div class="hideko" data-lang="json">...</div>` (`.hideko` marker class)
- **Assertion:** 100% of declared elements are highlighted without omitting any selectors.

---

### Demo 06: Manual Highlight API (`06-manual-highlight.html`)
**Goal:** Verify low-level programmatic highlighting API without DOM mutation.
- Calls `HidekoHighlight.highlight(codeString, langDef, conf, ['root'])`.
- Manually injects `result.html` into a target element.
- **Assertion:** Complete manual control over highlighted string output.

---

### Demo 07: Dynamic Inject (`07-dynamic-inject.html`)
**Goal:** Verify highlighting in dynamic applications (SPA, AJAX, WebSocket, LLM streaming output).
- Button click generates new `<pre><code>` elements and calls `HidekoHighlight.highlightElement(el)`.
- Repeated button clicks verify idempotency (`data-hideko-processed="true"` prevents double-processing).
- **Assertion:** Dynamically appended elements highlight immediately without duplication bugs.

---

### Demo 08: Copy Button (`08-copy-button.html`)
**Goal:** Verify automated copy button injection and clipboard interaction.
- Verifies copy button DOM presence in all generated pre blocks.
- Clicking copy button writes raw text (without line numbers or HTML tags) to `navigator.clipboard`.
- Verifies transient visual feedback ("Copied!" status badge).
- **Assertion:** Pasted text matches raw code with 100% fidelity.

---

### Demo 09: Viewport Lazy Loading (`09-lazy-scroll.html`)
**Goal:** Verify performance optimization using `IntersectionObserver` with `{ lazy: true }`.
- Blocks in initial viewport highlight immediately.
- Offscreen blocks defer highlighting and language bundle network fetches until scrolled near viewport.
- Real-time telemetry HUD displays lazy observation lifecycle states.

---

### Demo 10: Virtual Buffer & Adaptive Scrolling (`10-virtual-scroll.html`)
**Goal:** Stress-test the VirtualBuffer and Adaptive Smart Threshold engine across code sizes from 10 lines to 50,000+ lines.
- Block #1 (10 lines): Normal Mode (auto-height, no virtual scrollbar overhead).
- Block #2 (400 lines): Automatic transition to Virtual Mode with 350px viewport.
- Block #3 (1,000 lines): Virtual Mode with 400px viewport.
- Block #4 (20,000 lines): Virtual Mode with 450px viewport rendering only ~40 DOM nodes (99.8% DOM reduction).
- Real-time Telemetry HUD displays line count, active DOM nodes, and memory savings.
- Paste test arena confirms one-click copy extracts all 20,000 lines intact directly from the virtual buffer.

#### 📊 Performance Benchmark Comparison (21,410 lines):
| Metric | ⚡ With VirtualBuffer | ❌ Without VirtualBuffer (Full DOM) | Difference |
|---|:---:|:---:|:---:|
| **JS Tokenizer Time** | **2.7 ms** (0.0027 s) | **244.7 ms** (0.25 s) | **90x faster** |
| **HTML String Size** | **101 KB** | **21.59 MB** | **218x smaller** |
| **DOM Span Count** | **~1,600 nodes** | **~760,000 nodes** | **99.8% reduction** |
| **Browser Render Time** | **~15 - 30 ms** | **~3,000 - 5,000 ms** (3-5 s) | **100x+ faster** |
| **UI Responsiveness** | **Silky Smooth (60 FPS)** | **UI Frozen for 3-5 s** | **Zero UI freezing** |
| **Browser Tab Memory** | **~2 - 3 MB** | **~250 - 400 MB** | **Huge RAM savings** |

---

### Demo 11: Line Numbers & Line Highlighting (`11-line-numbers.html`)
**Goal:** Test line numbers gutter and line highlighting in both Normal and Virtual Scroll modes.
- Block #1: 10 lines with neat line numbers (1–10).
- Block #2: 12 lines with highlighted ranges `data-line="3, 6-8, 11"` featuring golden accent borders.
- Block #3: 400-line Virtual Scroll with live line numbers and highlighting ranges (5-8, 50, 100-105) synchronized during scrolling.
- Block #4: 5,000-line Virtual Scroll with automatic gutter width expansion for 4+ digits without wrapping code lines.
- Paste test box confirms copying extracts clean raw source code without copying line numbers.

---

### Demo Hub: `index.html`
- Modern responsive landing page showcasing links to all 12 demo scenarios.
- Live feature highlights, badges, and quick links.
- Version telemetry and distribution bundle footprint summary.

---

## ⚙️ General Principles
1. All demo files load built artifacts from `../dist/` (`dist/hideko-code-block.umd.js`, `dist/hideko-code-block.js`, `dist/style.min.css`).
2. Every demo page includes an automated assertion panel (✅ / ❌) providing instantaneous pass/fail telemetry.
3. Clean modern UI aesthetics with dark mode default, subtle glowing accents, and responsive layout.
