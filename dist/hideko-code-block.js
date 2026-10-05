/**
 * hideko-code-block
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */
/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */
function I(t) {
  if (!t) return "";
  let e = "", i = 0;
  for (let n = 0; n < t.length; n++) {
    let s;
    switch (t.charCodeAt(n)) {
      case 38:
        s = "&amp;";
        break;
      case 60:
        s = "&lt;";
        break;
      case 62:
        s = "&gt;";
        break;
      case 34:
        s = "&quot;";
        break;
      case 39:
        s = "&#039;";
        break;
      default:
        continue;
    }
    i < n && (e += t.substring(i, n)), e += s, i = n + 1;
  }
  return i === 0 ? t : (i < t.length && (e += t.substring(i)), e);
}
const J = /* @__PURE__ */ new Map();
function ce(t) {
  if (!t || typeof t != "string") return "";
  let e = J.get(t);
  if (e !== void 0) return e;
  let i;
  return t.includes("comment") ? i = "mtk4" : t.includes("regexp") || t.includes("escape") ? i = "mtk14" : t.includes("string") ? i = "mtk7" : t.includes("constant") || t.includes("boolean") ? i = "mtk13" : t.includes("directive") || t.includes("metatag") || t.includes("preprocessor") || t.includes("macro") ? i = "mtk15" : t.includes("keyword") ? i = "mtk5" : t.includes("number") ? i = "mtk6" : t.includes("operator") ? i = "mtk12" : t.includes("tag") || t.includes("delimiter") || t.includes("bracket") ? i = "mtk8" : t.includes("type") || t.includes("class") || t.includes("attribute.name") ? i = "mtk9" : t.includes("function") || t.includes("method") ? i = "mtk10" : t.includes("variable") || t.includes("identifier") || t.includes("parameter") || t.includes("attribute.value") ? i = "mtk11" : i = "mtk1", J.set(t, i), i;
}
const Q = {};
function O(t, e) {
  const i = I(e);
  if (t) {
    let n = ce(t);
    if (n) {
      let s = Q[n];
      return s || (s = '<span class="' + n + '">', Q[n] = s), s + i + "</span>";
    }
  }
  return i;
}
class ee {
  constructor(e) {
    this.langDef = e, this.tokenizer = e.tokenizer || {}, this.keywords = new Set(Array.isArray(e.keywords) ? e.keywords : []), this.types = new Set(Array.isArray(e.types) ? e.types : []), this.compiled = {};
    for (let i in this.tokenizer) {
      let n = this.compileState(i), s = "", l = [], a = 1, c = "ym" + (n.some((o) => o.ignoreCase) ? "i" : "");
      for (let o of n) {
        let u = `(${o.regexStr})`, h = new RegExp(u + "|").exec("").length - 1;
        s && (s += "|"), s += u, l.push({
          groupIndex: a,
          numGroups: h,
          rule: o
        }), a += h;
      }
      this.compiled[i] = {
        megaRegex: s ? new RegExp(s, c) : null,
        ruleMap: l
      };
    }
  }
  compileState(e, i = /* @__PURE__ */ new Set()) {
    if (i.has(e)) return [];
    i.add(e);
    const n = this.tokenizer[e] || [];
    let s = [];
    for (let l of n)
      if (l.include) {
        const a = l.include.replace(/^@/, "");
        s.push(...this.compileState(a, i));
      } else if (Array.isArray(l)) {
        let a = l[0], r = l[1], c = l[2], o = null, u = null, h = null, f = r;
        Array.isArray(r) ? f = r.map((d) => {
          let w = null, k = null, x = null, y = d;
          return typeof d == "object" && d !== null && (w = d.next || null, k = d.switchTo || null, x = d.nextEmbedded || null, y = d.token), { token: y, next: w, switchTo: k, nextEmbedded: x };
        }) : typeof r == "object" && r !== null && !r.cases && (o = r, r.token && (f = r.token), o.next && (c = o.next), o.switchTo && (u = o.switchTo), o.nextEmbedded && (h = o.nextEmbedded));
        let p = "", m = "";
        if (typeof a == "string" ? p = a : a instanceof RegExp && (p = a.source, m = a.ignoreCase ? "i" : ""), p.indexOf("@") !== -1) {
          let d = p, w;
          do
            w = d, d = d.replace(/@([a-zA-Z0-9_]+)/g, (k, x) => {
              if (this.langDef && this.langDef[x] !== void 0) {
                let y = this.langDef[x];
                return y instanceof RegExp ? y.source : Array.isArray(y) ? y.join("|") : y;
              }
              return k;
            });
          while (d !== w);
          p = d;
        }
        s.push({
          regexStr: p,
          ignoreCase: m.includes("i"),
          action: f,
          switchTo: u,
          nextEmbedded: h,
          next: c
        });
      }
    return s;
  }
  resolveAction(e, i) {
    if (typeof e == "string")
      return e[0] === "@" ? "delimiter" : e.replace("$0", i);
    if (e && e.cases) {
      let n = this.keywords.has(i) ? e.cases["@keywords"] : this.types.has(i) && e.cases["@types"] || e.cases["@default"];
      if (!n) return "identifier";
      if (typeof n == "object" && n.token)
        return n.token.replace("$0", i);
      if (typeof n == "string")
        return n.replace("$0", i);
    }
    return "";
  }
  applyNext(e, i, n, s, l) {
    let a = e.length;
    n && (e[a - 1] = n[0] === "@" ? n.substring(1) : n, l = e[a - 1]);
    let r = null;
    if (s && s !== "@pop" && (r = s, r[0] === "$" && r[1] === "S")) {
      let c = parseInt(r.substring(2)) - 1;
      r = l.split(".")[c] || r;
    }
    if (i === "@pop")
      a > 1 && (e.length = a - 1);
    else if (i === "@popall")
      e.length = 1;
    else if (i && i[0] === "@") {
      let c = i.substring(1);
      r && (c += "!emb:" + r + "|root"), e[e.length] = c;
    } else if (!i && r) {
      let c = e[e.length - 1];
      c = c.split("!emb:")[0] + "!emb:" + r + "|root", e[e.length - 1] = c;
    }
  }
  /**
   * Core tokenization loop — shared between tokenizeText() and tokenizeLine().
   * Uses string concatenation for HTML output instead of array + join.
   */
  _tokenizeCore(e, i, n) {
    let s = 0, l = [], a = "", r = /* @__PURE__ */ new Set(), c = -1, o = 0;
    for (; s < e.length; ) {
      if (s === c) {
        if (o++, o > 50) {
          console.error(`Hideko V8: Infinite loop detected at index ${s}, state: ${i[i.length - 1]}. Bailing out.`), n && (a += I(e.substring(s)));
          break;
        }
      } else
        c = s, o = 0;
      let u = i[i.length - 1], h = u.split("!emb:")[0], f = this.compiled[h];
      if (!f) {
        let m = h.split(".")[0];
        f = this.compiled[m] || this.compiled.root;
      }
      let p = !1;
      if (f && f.megaRegex) {
        f.megaRegex.lastIndex = s;
        let m = f.megaRegex.exec(e);
        if (m) {
          p = !0;
          let d = m[0], w = null;
          for (let g = 0; g < f.ruleMap.length; g++)
            if (m[f.ruleMap[g].groupIndex] !== void 0) {
              w = f.ruleMap[g];
              break;
            }
          let k = w.rule, x = [d];
          for (let g = 1; g <= w.numGroups; g++)
            x.push(m[w.groupIndex + g - 1]);
          let y = k.next, j = k.switchTo, A = k.nextEmbedded;
          if (j && (j = j.replace(/\$(\d+)/g, (g, b) => x[parseInt(b) + 1] || "")), A && (A = A.replace(/\$(\d+)/g, (g, b) => x[parseInt(b) + 1] || "")), Array.isArray(k.action))
            for (let g = 0; g < k.action.length; g++) {
              let b = x[g + 2];
              if (b !== void 0 && b.length > 0) {
                let L = k.action[g], v = this.resolveAction(L.token, b);
                v !== "@rematch" && (n ? a += O(v, b) : l[l.length] = { type: v, text: b }), this.applyNext(i, L.next, L.switchTo, L.nextEmbedded, h);
              }
            }
          else {
            let g = this.resolveAction(k.action, d);
            if (g === "@rematch")
              d = "";
            else if (u.includes("!emb:")) {
              let b = u.split("!emb:"), L = b[0], v = b[1].split("|"), C = v[0], T = v.slice(1), E = ue(C), H = R(E);
              if (H) {
                let $ = H.tokenizeLine(d, T, n);
                n ? a += $.html : l.push(...$.tokens);
                let B = $.endStateStack;
                i[i.length - 1] = L + "!emb:" + C + "|" + B.join("|");
              } else
                n ? a += O(g, d) : l[l.length] = { type: g, text: d }, r.add(E);
            } else
              n ? a += O(g, d) : l[l.length] = { type: g, text: d };
            this.applyNext(i, y, j, A, h);
          }
          d.length === 0 ? i[i.length - 1] === u && s++ : s += d.length;
        }
      }
      p || (n ? a += I(e[s]) : l[l.length] = { type: "", text: e[s] }, s++);
    }
    return n ? { html: a, endStateStack: i, missingLanguages: Array.from(r) } : { tokens: l, endStateStack: i, missingLanguages: Array.from(r) };
  }
  /**
   * Tokenize an entire code block at once (used by solo highlight).
   * Uses multiline-capable mega regex.
   */
  tokenizeText(e, i = !1) {
    let n = ["root"];
    return this._tokenizeCore(e, n, i);
  }
  /**
   * Tokenize a single line (used by editor for line-by-line state tracking).
   */
  tokenizeLine(e, i, n = !1) {
    let s = [...i];
    return s.length === 0 && (s = ["root"]), this._tokenizeCore(e, s, n);
  }
}
const S = /* @__PURE__ */ new Map();
function ue(t) {
  return t.includes("javascript") ? "javascript" : t.includes("css") ? "css" : t.includes("json") ? "json" : t.includes("html") ? "html" : t;
}
function N(t, e) {
  if (!e) return;
  let i = new ee(e);
  S.set(t.toLowerCase(), i), e.tokenPostfix && S.set(e.tokenPostfix.toLowerCase(), i);
}
function R(t) {
  if (!t) return null;
  if (typeof t == "string") {
    let n = t.toLowerCase(), s = n.startsWith(".") ? n : "." + n;
    return S.get(s) || S.get(n) || null;
  }
  if (!t.tokenizer) return null;
  let e = (t.tokenPostfix || "unknown").toLowerCase(), i = S.get(e);
  return i || (i = new ee(t), S.set(e, i)), i;
}
function W(t, e, i, n) {
  let s = R(e);
  if (!s)
    return { html: I(t), endStateStack: n || ["root"], missingLanguages: [] };
  let l = s.tokenizeText(t, !0);
  return { html: l.html, endStateStack: l.endStateStack, missingLanguages: l.missingLanguages };
}
function de(t, e, i = ["root"]) {
  let n = R(e);
  if (!n) return { endStateStack: i, missingLanguages: [] };
  let s = [...i], l = /* @__PURE__ */ new Set();
  for (let a = 0; a < t.length; a++) {
    let r = n.tokenizeLine(t[a], s);
    s = r.endStateStack, r.missingLanguages && r.missingLanguages.forEach((c) => l.add(c));
  }
  return { endStateStack: s, missingLanguages: Array.from(l) };
}
function F(t, e, i, n = ["root"]) {
  let s = R(e);
  if (!s)
    return { html: I(t), endStateStack: n, missingLanguages: [] };
  let l = [], a = [...n], r = /* @__PURE__ */ new Set(), c = 0;
  for (; c <= t.length; ) {
    let o = t.indexOf(`
`, c), u = o === -1 ? t.substring(c) : t.substring(c, o), h = s.tokenizeLine(u, a, !0);
    if (a = h.endStateStack, h.missingLanguages)
      for (let f of h.missingLanguages)
        r.add(f);
    if (l[l.length] = h.html, o === -1) break;
    c = o + 1;
  }
  return { html: l.join(`
`), endStateStack: a, missingLanguages: Array.from(r) };
}
/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */
const Z = {
  assembly: "asm",
  asm: "asm",
  s: "asm",
  bash: "bash",
  sh: "shell",
  shell: "shell",
  bat: "bat",
  cmd: "bat",
  c: "c",
  h: "c",
  "c++": "cpp",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  hh: "cpp",
  hxx: "cpp",
  "c#": "csharp",
  csharp: "csharp",
  cs: "csharp",
  csx: "csharp",
  cake: "csharp",
  css: "css",
  dart: "dart",
  dockerfile: "dockerfile",
  docker: "dockerfile",
  go: "go",
  graphql: "graphql",
  html: "html",
  htm: "html",
  xhtml: "html",
  shtml: "html",
  mdoc: "html",
  jsp: "html",
  asp: "html",
  aspx: "html",
  jshtm: "html",
  ini: "ini",
  java: "java",
  jav: "java",
  javascript: "javascript",
  js: "javascript",
  es6: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  kotlin: "kotlin",
  kt: "kotlin",
  lua: "lua",
  markdown: "markdown",
  md: "markdown",
  mdown: "markdown",
  mkdn: "markdown",
  mkd: "markdown",
  mdwn: "markdown",
  mdtxt: "markdown",
  mdtext: "markdown",
  php: "php",
  php4: "php",
  php5: "php",
  phtml: "php",
  ctp: "php",
  powershell: "powershell",
  ps: "powershell",
  ps1: "powershell",
  python: "python",
  py: "python",
  rpy: "python",
  pyw: "python",
  cpy: "python",
  gyp: "python",
  gypi: "python",
  r: "r",
  ruby: "ruby",
  rb: "ruby",
  rust: "rust",
  rs: "rust",
  rlib: "rust",
  scala: "scala",
  sql: "sql",
  swift: "swift",
  typescript: "typescript",
  ts: "typescript",
  tsx: "typescript",
  cts: "typescript",
  mts: "typescript",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml"
};
function he(t, e = Z) {
  if (!t || typeof t != "string") return "javascript";
  const n = t.split("?")[0].split("#")[0].split("/").pop().toLowerCase();
  if (e[n]) return e[n];
  const s = n.includes(".") ? n.split(".").pop() : n;
  return e[s] || s;
}
/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */
const X = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>', ge = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
function Y(t) {
  const e = document.createElement("button");
  return e.type = "button", e.className = "hideko-copy-btn", e.setAttribute("aria-label", "Copy code to clipboard"), e.innerHTML = `${X} <span>Copy</span>`, e.onclick = () => {
    const i = typeof t == "function" ? t() : t || "";
    typeof navigator < "u" && navigator.clipboard && navigator.clipboard.writeText(i).then(() => {
      e.innerHTML = `${ge} <span>Copied!</span>`, e.classList.add("copied"), setTimeout(() => {
        e.innerHTML = `${X} <span>Copy</span>`, e.classList.remove("copied");
      }, 2e3);
    }).catch(() => {
    });
  }, e;
}
function D(t) {
  const e = /* @__PURE__ */ new Set();
  if (!t) return e;
  if (Array.isArray(t))
    return t.forEach((n) => {
      if (typeof n == "number") e.add(n);
      else if (Array.isArray(n) && n.length >= 2)
        for (let s = n[0]; s <= n[1]; s++) e.add(s);
      else typeof n == "string" && D(n).forEach((s) => e.add(s));
    }), e;
  const i = String(t).split(",");
  for (const n of i) {
    const s = n.trim();
    if (s)
      if (s.includes("-")) {
        const [l, a] = s.split("-").map((r) => parseInt(r.trim(), 10));
        if (!isNaN(l) && !isNaN(a))
          for (let r = Math.min(l, a); r <= Math.max(l, a); r++)
            e.add(r);
      } else {
        const l = parseInt(s, 10);
        isNaN(l) || e.add(l);
      }
  }
  return e;
}
/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */
class te {
  /**
   * @param {string} [initialText='']
   */
  constructor(e = "") {
    this.lines = [""], this.setText(e);
  }
  /**
   * Set buffer text, normalizing line endings
   * @param {string} text 
   */
  setText(e) {
    if (!e) {
      this.lines = [""];
      return;
    }
    const i = String(e).replace(/\r\n/g, `
`).replace(/\r/g, `
`);
    this.lines = i.split(`
`), this.lines.length === 0 && (this.lines = [""]);
  }
  /**
   * Get full text (used by clipboard copy)
   * @returns {string}
   */
  getText() {
    return this.lines.join(`
`);
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
  getLine(e) {
    return e < 0 || e >= this.lines.length ? "" : this.lines[e];
  }
  /**
   * Get a slice of lines
   * @param {number} startIndex 
   * @param {number} endIndex 
   * @returns {string[]}
   */
  getLines(e, i) {
    const n = Math.max(0, e), s = Math.min(this.lines.length, i);
    return this.lines.slice(n, s);
  }
}
/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */
const V = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), ne = /* @__PURE__ */ new WeakMap();
function ie(t, e, i, n, s, l) {
  if (!n && (!s || s.size === 0))
    return t;
  let r = String(t).replace(/\r\n/g, `
`).replace(/\r/g, `
`).split(`
`);
  typeof e == "number" && r.length > e && r[r.length - 1] === "" && r.pop();
  const c = l ? ` style="--hideko-gutter-width: ${l}px;"` : "";
  return r.map((o, u) => {
    const h = i + u, p = `hideko-line${s && s.has(h) ? " hideko-line-highlighted" : ""}`, m = n ? `<span class="hideko-line-number"${c} aria-hidden="true">${h}</span>` : "";
    return `<span class="${p}">${m}<span class="hideko-line-content">${o || " "}</span></span>`;
  }).join("");
}
function fe(t, e, i, n, s, l, a, r, c = {}) {
  const o = new te(i);
  ne.set(e, o);
  const { showLineNumbers: u, hlSet: h, startLine: f = 1 } = c, p = l.maxHeight || e.getAttribute("data-height") || e.getAttribute("data-max-height") || t.getAttribute("data-height") || t.getAttribute("data-max-height") || "500px", m = !!(l.fullHeight || p === "100%" || p === "100vh" || e.classList.contains("h-full") || t.classList.contains("h-full")), d = l.lineHeight || 21, w = l.overscan || 10, k = o.getLineCount(), x = k * d, y = m ? e.clientHeight || window.innerHeight || 500 : parseInt(p) || 500, j = Math.min(x, y), A = String(f + k).length, g = Math.max(32, A * 8 + 18);
  e.classList.add("hideko-pre-block", "hideko-theme-block", "hideko-virtual-container"), m ? (e.style.height = "100%", e.style.maxHeight = "none") : (e.style.height = `${j}px`, e.style.maxHeight = p), e.style.position = "relative", e.setAttribute("data-theme", a), e.setAttribute("data-lang", r), e.setAttribute("data-virtual-active", "true"), e.innerHTML = "";
  const b = document.createElement("div");
  b.className = "hideko-virtual-phantom", b.style.height = `${x}px`;
  const L = document.createElement("div");
  L.className = "hideko-virtual-viewport";
  const v = document.createElement("code");
  v.className = t.className || `language-${r}`, L.appendChild(v), b.appendChild(L), e.appendChild(b), l.copyButton !== !1 && e.appendChild(Y(() => o.getText()));
  let C = -1, T = -1;
  function E() {
    const $ = e.scrollTop, B = e.clientHeight || window.innerHeight || 500;
    let M = Math.floor($ / d) - w;
    M < 0 && (M = 0);
    let se = Math.ceil(B / d) + w * 2, P = Math.min(k, M + se);
    if (M === C && P === T) return;
    C = M, T = P;
    const re = M * d;
    L.style.transform = `translateY(${re}px)`;
    const K = o.getLines(M, P), le = K.join(`
`), { html: ae } = F(le, n, s, ["root"]), oe = f + M;
    v.innerHTML = ie(ae, K.length, oe, u, h, g);
  }
  let H = !1;
  e.addEventListener("scroll", () => {
    H || (requestAnimationFrame(() => {
      E(), H = !1;
    }), H = !0);
  }, { passive: !0 }), typeof ResizeObserver < "u" && new ResizeObserver(() => {
    E();
  }).observe(e), E();
}
function pe(t) {
  if (!t) return "javascript";
  const e = t.getAttribute("data-lang") || t.getAttribute("h-lang");
  if (e) return e.toLowerCase();
  if (t.parentElement) {
    const n = t.parentElement.getAttribute("data-lang") || t.parentElement.getAttribute("h-lang");
    if (n) return n.toLowerCase();
  }
  const i = Array.from(t.classList);
  t.parentElement && i.push(...Array.from(t.parentElement.classList));
  for (const n of i) {
    const s = n.match(/^(?:language|lang|hljs)-([a-zA-Z0-9_#+-]+)$/i);
    if (s && s[1])
      return s[1].toLowerCase();
  }
  return "javascript";
}
function me(t) {
  if (t)
    return t.endsWith("/") ? t : t + "/";
  if (typeof document < "u") {
    const e = document.currentScript || document.querySelector('script[src*="hideko-highlight"]');
    if (e && e.src)
      try {
        const i = new URL(e.src, window.location.href);
        return new URL("./languages/", i.href).href;
      } catch {
      }
  }
  return "./languages/";
}
async function q(t, e) {
  if (!t) return null;
  const i = Z[t.toLowerCase()] || t.toLowerCase();
  if (V.has(i)) {
    const l = V.get(i);
    return l && l.language && N(t.toLowerCase(), l.language), l;
  }
  if (z.has(i))
    return z.get(i);
  const n = me(e), s = (async () => {
    try {
      const l = typeof window < "u" ? window.location.href : "file:///", r = await import(new URL(`${n}${i}.js`, l).href), c = r.language || r.default && r.default.language, o = r.conf || r.default && r.default.conf || {};
      if (c) {
        N(i, c), N(t.toLowerCase(), c);
        const u = { language: c, conf: o };
        return V.set(i, u), u;
      }
    } catch {
      console.warn(`Hideko: Could not load language grammar "${t}" from ${n}`);
    } finally {
      z.delete(i);
    }
    return null;
  })();
  return z.set(i, s), s;
}
async function _(t = 'pre code, pre[class*="language-"], div[data-lang], .hideko', e = {}) {
  if (typeof document > "u") return;
  t && typeof t == "object" && !(t instanceof HTMLElement) && !Array.isArray(t) && !("length" in t) && (e = t, t = 'pre code, pre[class*="language-"], div[data-lang], .hideko');
  let i = [];
  if (typeof t == "string" ? i = Array.from(document.querySelectorAll(`${t}:not([data-hideko-processed="true"])`)) : t instanceof HTMLElement ? i = [t] : t && t.length && (i = Array.from(t)), e.lazy && typeof window < "u" && "IntersectionObserver" in window) {
    const n = e.lazyRootMargin || "150px 0px", s = /* @__PURE__ */ new WeakMap(), l = new IntersectionObserver((a) => {
      a.forEach((r) => {
        if (r.isIntersecting) {
          l.unobserve(r.target);
          const c = s.get(r.target) || r.target;
          G(c, e);
        }
      });
    }, { rootMargin: n });
    for (const a of i) {
      const c = a.tagName === "CODE" && a.parentElement && a.parentElement.tagName === "PRE" ? a.parentElement : a;
      s.set(c, a), l.observe(c);
    }
    return i;
  }
  for (const n of i)
    await G(n, e);
}
async function G(t, e = {}) {
  if (!t || !e.force && t.getAttribute("data-hideko-processed") === "true") return;
  const i = t.tagName === "CODE" && t.parentElement && t.parentElement.tagName === "PRE", n = i ? t.parentElement : t;
  e.force && (t.removeAttribute("data-hideko-processed"), n && (n.removeAttribute("data-hideko-processed"), n.removeAttribute("data-virtual-active"), n.classList.remove("hideko-virtual-container"), n.querySelectorAll(".hideko-copy-btn").forEach((E) => E.remove()), i ? (n.innerHTML = "", n.appendChild(t)) : n.innerHTML = "")), t.setAttribute("data-hideko-processed", "true"), n && n.setAttribute("data-hideko-processed", "true");
  const s = e.theme || t.getAttribute("data-theme") || n && n.getAttribute("data-theme") || "dark", l = e.lang || pe(t), r = (e.code !== void 0 ? String(e.code) : t.textContent).replace(/\r\n/g, `
`).replace(/\r/g, `
`).replace(/^\n/, ""), c = await q(l, e.basePath), o = c ? c.language || {} : {}, u = c ? c.conf || {} : {}, h = !!(e.lineNumbers || t.getAttribute("data-line-numbers") === "true" || t.hasAttribute("data-line-numbers") || t.classList.contains("line-numbers") || n && (n.getAttribute("data-line-numbers") === "true" || n.hasAttribute("data-line-numbers") || n.classList.contains("line-numbers"))), f = e.highlightLines || t.getAttribute("data-line") || t.getAttribute("data-highlight") || t.getAttribute("data-highlight-lines") || n && (n.getAttribute("data-line") || n.getAttribute("data-highlight") || n.getAttribute("data-highlight-lines")), p = D(f), m = parseInt(
    e.startLine || t.getAttribute("data-start-line") || n && n.getAttribute("data-start-line") || "1",
    10
  ) || 1, d = { showLineNumbers: h, hlSet: p, startLine: m }, w = r.split(`
`).length, k = e.virtualThreshold ?? 300, x = t.getAttribute("data-virtual") === "true" || n && n.getAttribute("data-virtual") === "true" || e.virtual === !0 && !e.virtualThreshold;
  if (!(t.getAttribute("data-virtual") === "false" || n && n.getAttribute("data-virtual") === "false" || e.virtual === !1) && (x || w >= k)) {
    fe(t, n, r, o, u, e, s, l, d);
    return;
  }
  const A = h || p && p.size > 0, { html: g } = A ? F(r, o, u, ["root"]) : W(r, o, u, ["root"]);
  n.classList.add("hideko-pre-block", "hideko-theme-block"), n.setAttribute("data-theme", s), n.setAttribute("data-lang", l);
  const b = String(m + w).length, L = Math.max(32, b * 8 + 18), v = ie(g, w, m, h, p, L), C = i ? t : document.createElement("code");
  C.innerHTML = v, i || (n.innerHTML = "", n.appendChild(C)), e.copyButton !== !1 && (n.style.position = "relative", n.appendChild(Y(r)));
}
/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */
async function be(t, e = {}) {
  if (!t || typeof t != "string") return "";
  const i = e.theme || "dark";
  let n = e.loader;
  if (!n)
    if (e.environment === "node" || typeof window > "u" && typeof process < "u")
      try {
        let o;
        try {
          o = await import(
            /* @vite-ignore */
            "./browser/node/file-converter.js"
          );
        } catch {
          try {
            o = await import(
              /* @vite-ignore */
              "./node/file-converter.js"
            );
          } catch {
            o = await import(
              /* @vite-ignore */
              "./dist/node/file-converter.js"
            );
          }
        }
        n = o.loadLanguageNode;
      } catch {
        n = (u) => q(u, e.basePath);
      }
    else
      n = (o) => q(o, e.basePath);
  const s = /(^|\n)```([a-zA-Z0-9_#+-]*)\r?\n([\s\S]*?)\r?\n```/g, l = [];
  let a;
  for (; (a = s.exec(t)) !== null; )
    l.push({
      fullMatch: a[0],
      prefix: a[1],
      lang: a[2].trim() || "javascript",
      code: a[3],
      index: a.index
    });
  if (l.length === 0)
    return t;
  let r = "", c = 0;
  for (const o of l) {
    r += t.substring(c, o.index);
    const u = await n(o.lang), h = u ? u.language || {} : {}, f = u ? u.conf || {} : {}, { html: p } = W(o.code, h, f, ["root"]), m = `${o.prefix}<pre class="hideko-pre-block hideko-theme-block" data-theme="${i}" data-lang="${o.lang}"><code>${p}</code></pre>`;
    r += m, c = o.index + o.fullMatch.length;
  }
  return r += t.substring(c), r;
}
function ke(t = {}) {
  const e = t.theme || "dark";
  return {
    renderer: {
      code(i, n) {
        const s = (n || "").match(/\S*/)[0] || "javascript";
        return `<pre class="hideko-pre-block hideko-theme-block" data-theme="${e}" data-lang="${s}"><code>${i}</code></pre>`;
      }
    }
  };
}
/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */
const we = "1.0.0", U = {
  version: we,
  highlight: W,
  highlightLines: F,
  tokenizeLinesToState: de,
  registerLanguage: N,
  highlightAll: _,
  highlightElement: G,
  highlightMarkdown: be,
  createMarkedExtension: ke,
  detectLanguage: he,
  languageAliases: Z,
  VirtualBuffer: te,
  virtualRegistry: ne,
  parseHighlightLines: D,
  createCopyButton: Y,
  // Aliases for developer convenience
  run: _,
  Run: _
}, xe = U;
typeof window < "u" && (window.HidekoHighlight = U, window.HidekoCodeBlock = xe, window.Hideko = window.Hideko || U);
export {
  xe as HidekoCodeBlock,
  U as HidekoHighlight,
  te as VirtualBuffer,
  Y as createCopyButton,
  ke as createMarkedExtension,
  U as default,
  he as detectLanguage,
  W as highlight,
  _ as highlightAll,
  G as highlightElement,
  F as highlightLines,
  be as highlightMarkdown,
  Z as languageAliases,
  D as parseHighlightLines,
  N as registerLanguage,
  de as tokenizeLinesToState,
  we as version,
  ne as virtualRegistry
};
