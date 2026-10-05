import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Hideko Lite (Built Production Bundle)
import { highlight } from '../dist/hideko-highlight.js';
import { loadLanguageNode } from '../dist/node/file-converter.js';

// 2. PrismJS
import Prism from 'prismjs';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-sql.js';

// 3. Highlight.js
import hljs from 'highlight.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Sample Generators
// ============================================================================

function generateJS(linesCount) {
    const templates = [
        `import { useState, useEffect } from 'react';`,
        `// Calculate financial metric with exponential moving average`,
        `export function useMetricTracker(initialFactor = 1.0, threshold = 500) {`,
        `    const [metric, setMetric] = useState(0);`,
        `    const [isAlert, setIsAlert] = useState(false);`,
        ``,
        `    useEffect(() => {`,
        `        const timer = setInterval(() => {`,
        `            const raw = Math.random() * 1000 * initialFactor;`,
        `            if (raw > threshold) {`,
        `                console.warn(\`[ALERT] Value \${raw.toFixed(2)} exceeds threshold \${threshold}\`);`,
        `                setIsAlert(true);`,
        `            } else {`,
        `                setIsAlert(false);`,
        `            }`,
        `            setMetric((prev) => (prev * 0.7) + (raw * 0.3));`,
        `        }, 100);`,
        `        return () => clearInterval(timer);`,
        `    }, [initialFactor, threshold]);`,
        ``,
        `    return { metric, isAlert };`,
        `}`
    ];
    const lines = [];
    while (lines.length < linesCount) {
        lines.push(...templates);
    }
    return lines.slice(0, linesCount).join('\n');
}

function generatePython(linesCount) {
    const templates = [
        `import os`,
        `import sys`,
        `from typing import List, Dict, Optional, Any`,
        ``,
        `class DataProcessor:`,
        `    """High throughput telemetry stream processor."""`,
        `    def __init__(self, buffer_size: int = 1024, debug: bool = False) -> None:`,
        `        self.buffer_size = buffer_size`,
        `        self.debug = debug`,
        `        self.records: List[Dict[str, Any]] = []`,
        ``,
        `    def process_batch(self, items: List[Any]) -> Optional[Dict[str, float]]:`,
        `        # Aggregate moving standard deviation and variance`,
        `        if not items:`,
        `            return None`,
        `        total_sum = sum(x.get("value", 0.0) for x in items if isinstance(x, dict))`,
        `        avg = total_sum / max(1, len(items))`,
        `        variance = sum((x.get("value", 0.0) - avg) ** 2 for x in items) / len(items)`,
        `        return {"average": avg, "variance": variance, "std_dev": variance ** 0.5}`
    ];
    const lines = [];
    while (lines.length < linesCount) {
        lines.push(...templates);
    }
    return lines.slice(0, linesCount).join('\n');
}

function generateSQL(linesCount) {
    const templates = [
        `-- Compute 30-day customer cohort retention and lifetime value`,
        `WITH user_activity AS (`,
        `    SELECT `,
        `        user_id,`,
        `        DATE_TRUNC('month', created_at) AS cohort_month,`,
        `        COUNT(DISTINCT transaction_id) AS total_orders,`,
        `        SUM(amount_cents) / 100.0 AS total_spend`,
        `    FROM analytics.orders`,
        `    WHERE status IN ('completed', 'settled') AND created_at >= '2025-01-01'`,
        `    GROUP BY 1, 2`,
        `),`,
        `cohort_sizes AS (`,
        `    SELECT cohort_month, COUNT(DISTINCT user_id) AS total_users`,
        `    FROM user_activity`,
        `    GROUP BY cohort_month`,
        `)`,
        `SELECT `,
        `    u.cohort_month,`,
        `    c.total_users,`,
        `    AVG(u.total_spend) AS avg_ltv`,
        `FROM user_activity u`,
        `JOIN cohort_sizes c ON u.cohort_month = c.cohort_month`,
        `GROUP BY u.cohort_month, c.total_users;`
    ];
    const lines = [];
    while (lines.length < linesCount) {
        lines.push(...templates);
    }
    return lines.slice(0, linesCount).join('\n');
}

// ============================================================================
// Benchmark Runner
// ============================================================================

function countHtmlTags(html) {
    const matches = html.match(/<span/g);
    return matches ? matches.length : 0;
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(2) + ' KB';
}

function measure(fn, iterations = 20) {
    // Warmup (3 iterations)
    for (let i = 0; i < 3; i++) fn();

    const times = [];
    for (let i = 0; i < iterations; i++) {
        const t0 = performance.now();
        fn();
        const t1 = performance.now();
        times.push(t1 - t0);
    }

    const sum = times.reduce((a, b) => a + b, 0);
    const mean = sum / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    return { mean, min, max, times };
}

async function runBenchmark() {
    console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
    console.log('║        ⚡ HIGH-PERFORMANCE BENCHMARK: HIDEKO vs PRISMJS vs HIGHLIGHT.JS         ║');
    console.log('╚════════════════════════════════════════════════════════════════════════════════╝\n');

    // Preload Hideko language grammars
    console.log('⏳ Preloading language grammars...');
    const hidekoJS = await loadLanguageNode('javascript');
    const hidekoPy = await loadLanguageNode('python');
    const hidekoSQL = await loadLanguageNode('sql');
    console.log('✓ All grammars loaded.\n');

    const testSuites = [
        {
            name: 'Small File (~150 lines)',
            tests: [
                { lang: 'javascript', hidekoMod: hidekoJS, prismLang: 'javascript', hljsLang: 'javascript', code: generateJS(150), iters: 50 },
                { lang: 'python', hidekoMod: hidekoPy, prismLang: 'python', hljsLang: 'python', code: generatePython(150), iters: 50 },
                { lang: 'sql', hidekoMod: hidekoSQL, prismLang: 'sql', hljsLang: 'sql', code: generateSQL(150), iters: 50 }
            ]
        },
        {
            name: 'Medium File (~1,500 lines)',
            tests: [
                { lang: 'javascript', hidekoMod: hidekoJS, prismLang: 'javascript', hljsLang: 'javascript', code: generateJS(1500), iters: 15 },
                { lang: 'python', hidekoMod: hidekoPy, prismLang: 'python', hljsLang: 'python', code: generatePython(1500), iters: 15 },
                { lang: 'sql', hidekoMod: hidekoSQL, prismLang: 'sql', hljsLang: 'sql', code: generateSQL(1500), iters: 15 }
            ]
        },
        {
            name: 'Large File (~15,000 lines)',
            tests: [
                { lang: 'javascript', hidekoMod: hidekoJS, prismLang: 'javascript', hljsLang: 'javascript', code: generateJS(15000), iters: 5 },
                { lang: 'python', hidekoMod: hidekoPy, prismLang: 'python', hljsLang: 'python', code: generatePython(15000), iters: 5 },
                { lang: 'sql', hidekoMod: hidekoSQL, prismLang: 'sql', hljsLang: 'sql', code: generateSQL(15000), iters: 5 }
            ]
        }
    ];

    const overallSpeedups = [];

    for (const suite of testSuites) {
        console.log(`\n================================================================================`);
        console.log(`📂  TEST SUITE: ${suite.name}`);
        console.log(`================================================================================`);

        for (const t of suite.tests) {
            const lines = t.code.split('\n').length;
            const inputBytes = Buffer.byteLength(t.code, 'utf8');

            console.log(`\n▶ [${t.lang.toUpperCase()}] ${lines} lines | Input: ${formatBytes(inputBytes)} (${t.code.length.toLocaleString()} chars) | Iterations: ${t.iters}`);

            // 1. Hideko
            const hidekoOut = highlight(t.code, t.hidekoMod.language, t.hidekoMod.conf, ['root']).html;
            const hidekoBench = measure(() => highlight(t.code, t.hidekoMod.language, t.hidekoMod.conf, ['root']), t.iters);
            const hidekoTags = countHtmlTags(hidekoOut);
            const hidekoBytes = Buffer.byteLength(hidekoOut, 'utf8');

            // 2. PrismJS
            const prismGrammar = Prism.languages[t.prismLang] || Prism.languages.javascript;
            const prismOut = Prism.highlight(t.code, prismGrammar, t.prismLang);
            const prismBench = measure(() => Prism.highlight(t.code, prismGrammar, t.prismLang), t.iters);
            const prismTags = countHtmlTags(prismOut);
            const prismBytes = Buffer.byteLength(prismOut, 'utf8');

            // 3. Highlight.js
            const hljsOut = hljs.highlight(t.code, { language: t.hljsLang, ignoreIllegals: true }).value;
            const hljsBench = measure(() => hljs.highlight(t.code, { language: t.hljsLang, ignoreIllegals: true }), t.iters);
            const hljsTags = countHtmlTags(hljsOut);
            const hljsBytes = Buffer.byteLength(hljsOut, 'utf8');

            // Calculate Throughput (KB/sec)
            const hidekoThroughput = ((inputBytes / 1024) / (hidekoBench.mean / 1000)).toFixed(1);
            const prismThroughput = ((inputBytes / 1024) / (prismBench.mean / 1000)).toFixed(1);
            const hljsThroughput = ((inputBytes / 1024) / (hljsBench.mean / 1000)).toFixed(1);

            // Table display
            console.log('┌────────────────┬─────────────┬─────────────┬─────────────┬──────────────┬──────────────┐');
            console.log('│ Engine         │ Output Size │ Token Tags  │ Mean Time   │ Min - Max    │ Throughput   │');
            console.log('├────────────────┼─────────────┼─────────────┼─────────────┼──────────────┼──────────────┤');
            console.log(`│ ⚡ Hideko       │ ${formatBytes(hidekoBytes).padEnd(11)} │ ${hidekoTags.toLocaleString().padEnd(11)} │ ${(hidekoBench.mean.toFixed(2) + ' ms').padEnd(11)} │ ${(hidekoBench.min.toFixed(2) + '-' + hidekoBench.max.toFixed(2) + 'ms').padEnd(12)} │ ${(hidekoThroughput + ' KB/s').padEnd(12)} │`);
            console.log(`│ 🔹 PrismJS     │ ${formatBytes(prismBytes).padEnd(11)} │ ${prismTags.toLocaleString().padEnd(11)} │ ${(prismBench.mean.toFixed(2) + ' ms').padEnd(11)} │ ${(prismBench.min.toFixed(2) + '-' + prismBench.max.toFixed(2) + 'ms').padEnd(12)} │ ${(prismThroughput + ' KB/s').padEnd(12)} │`);
            console.log(`│ 🔸 Highlight.js│ ${formatBytes(hljsBytes).padEnd(11)} │ ${hljsTags.toLocaleString().padEnd(11)} │ ${(hljsBench.mean.toFixed(2) + ' ms').padEnd(11)} │ ${(hljsBench.min.toFixed(2) + '-' + hljsBench.max.toFixed(2) + 'ms').padEnd(12)} │ ${(hljsThroughput + ' KB/s').padEnd(12)} │`);
            console.log('└────────────────┴─────────────┴─────────────┴─────────────┴──────────────┴──────────────┘');

            const vsPrism = (prismBench.mean / hidekoBench.mean).toFixed(2);
            const vsHljs = (hljsBench.mean / hidekoBench.mean).toFixed(2);
            overallSpeedups.push({ lang: t.lang, vsPrism: Number(vsPrism), vsHljs: Number(vsHljs) });

            console.log(`📊 Result: Hideko is ${vsPrism}x faster than PrismJS, and ${vsHljs}x faster than Highlight.js`);
        }
    }

    // Summary
    const avgVsPrism = (overallSpeedups.reduce((a, b) => a + b.vsPrism, 0) / overallSpeedups.length).toFixed(2);
    const avgVsHljs = (overallSpeedups.reduce((a, b) => a + b.vsHljs, 0) / overallSpeedups.length).toFixed(2);

    console.log(`\n================================================================================`);
    console.log(`🏆 OVERALL BENCHMARK VERDICT`);
    console.log(`================================================================================`);
    console.log(`  • Average Speed vs PrismJS    : ⚡ Hideko is ${avgVsPrism}x FASTER`);
    console.log(`  • Average Speed vs Highlight.js: ⚡ Hideko is ${avgVsHljs}x FASTER`);
    console.log(`  • Engine Architecture         : Sticky MegaRegex (y flag) & Pre-allocated Token Caches`);
    console.log(`================================================================================\n`);
}

runBenchmark();
