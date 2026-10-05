import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const DIST_LANG_DIR = path.resolve(DIST_DIR, 'languages');
const DIST_NODE_DIR = path.resolve(DIST_DIR, 'node');

/**
 * hideko-code-block Post-Build Tasks
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

const JS_BANNER = `/**
 * hideko-code-block
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */\n`;

console.log('🚀 Starting hideko-code-block Post-Build Tasks...\n');

if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });
if (!fs.existsSync(DIST_LANG_DIR)) fs.mkdirSync(DIST_LANG_DIR, { recursive: true });
if (!fs.existsSync(DIST_NODE_DIR)) fs.mkdirSync(DIST_NODE_DIR, { recursive: true });

async function postBuild() {
    try {
        // ====================================================================
        // 1. Build CSS Stylesheets
        // ====================================================================
        console.log('🎨 Compiling stylesheets...');
        const rawCss = fs.readFileSync(path.resolve(SRC_DIR, 'css/hideko-highlight.css'), 'utf8');
        fs.writeFileSync(path.resolve(DIST_DIR, 'style.css'), rawCss, 'utf8');

        const minCss = esbuild.transformSync(rawCss, { loader: 'css', minify: true }).code;
        fs.writeFileSync(path.resolve(DIST_DIR, 'style.min.css'), minCss, 'utf8');
        console.log('  ✓ dist/style.css & dist/style.min.css');

        // ====================================================================
        // 2. Build Languages (Standalone & Self-Registering)
        // ====================================================================
        console.log('🌐 Processing standalone languages...');
        const langSrcDir = path.resolve(SRC_DIR, 'languages');
        const langFiles = fs.readdirSync(langSrcDir).filter(f => f.endsWith('.js'));
        const languageNames = [];

        for (const file of langFiles) {
            if (file === 'language-aliases.js') {
                const content = fs.readFileSync(path.join(langSrcDir, file), 'utf8');
                const minified = esbuild.transformSync(content, { minify: true, target: 'es2020', banner: JS_BANNER }).code;
                fs.writeFileSync(path.join(DIST_LANG_DIR, file), minified, 'utf8');
                continue;
            }

            const langName = path.basename(file, '.js');
            languageNames.push(langName);

            let content = fs.readFileSync(path.join(langSrcDir, file), 'utf8');

            // Auto-registration in browser environment
            const selfRegisterCode = `
const _h = (typeof globalThis !== 'undefined') ? (globalThis.HidekoCodeBlock || globalThis.HidekoHighlight || globalThis.Hideko) : null;
if (_h && typeof _h.registerLanguage === 'function') {
    _h.registerLanguage('${langName}', language);
}
export default { language, conf: typeof conf !== 'undefined' ? conf : {} };
`;
            content = content.replace(/export\s+default\s+[^;]+;?\s*$/m, '');
            content = content.trimEnd() + '\n' + selfRegisterCode;

            const minified = esbuild.transformSync(content, { minify: true, target: 'es2020', banner: JS_BANNER }).code;
            fs.writeFileSync(path.join(DIST_LANG_DIR, file), minified, 'utf8');
        }

        // Generate dist/languages/index.js
        const imports = languageNames.map(name => `import ${name.replace(/-/g, '_')} from './${name}.js';`).join('\n');
        const exportsList = languageNames.map(name => `    ${name.replace(/-/g, '_')}`).join(',\n');
        const reexports = languageNames.map(name => `export { default as ${name.replace(/-/g, '_')} } from './${name}.js';`).join('\n');

        const indexContent = `/**
 * Hideko Code Block Modular Languages Bundle
 */
${imports}
export { languageAliases, languageAliases as extensionMap, detectLanguage } from './language-aliases.js';
${reexports}
export const allLanguages = {
${exportsList}
};
export default allLanguages;
`;
        const minifiedIndex = esbuild.transformSync(indexContent, { minify: true, target: 'es2020', banner: JS_BANNER }).code;
        fs.writeFileSync(path.join(DIST_LANG_DIR, 'index.js'), minifiedIndex, 'utf8');
        console.log(`  ✓ ${languageNames.length} language definitions compiled to dist/languages/`);

        // ====================================================================
        // 3. Build Node Distribution
        // ====================================================================
        console.log('⚙️  Building Node.js distribution...');

        // 3a. File converter
        await esbuild.build({
            entryPoints: [path.resolve(SRC_DIR, 'node/file-converter.js')],
            outfile: path.resolve(DIST_NODE_DIR, 'file-converter.js'),
            bundle: true,
            format: 'esm',
            platform: 'node',
            target: 'node18',
            minify: true,
            banner: { js: JS_BANNER },
            external: ['fs', 'path', 'url', 'perf_hooks']
        });

        // 3b. CLI tool
        await esbuild.build({
            entryPoints: [path.resolve(SRC_DIR, 'node/cli.js')],
            outfile: path.resolve(DIST_NODE_DIR, 'cli.js'),
            bundle: true,
            format: 'esm',
            platform: 'node',
            target: 'node18',
            minify: true,
            banner: { js: JS_BANNER },
            external: ['fs', 'path', 'url']
        });

        // 3c. Node Entry Index
        await esbuild.build({
            entryPoints: [path.resolve(SRC_DIR, 'node/index.js')],
            outfile: path.resolve(DIST_NODE_DIR, 'index.js'),
            bundle: true,
            format: 'esm',
            platform: 'node',
            target: 'node18',
            minify: true,
            banner: { js: JS_BANNER },
            external: ['fs', 'path', 'url', 'perf_hooks']
        });
        console.log('  ✓ dist/node/index.js, file-converter.js, cli.js');

        // ====================================================================
        // 4. Aliases for Backward Compatibility with existing Demos & CDNs
        // ====================================================================
        const umdFile = path.resolve(DIST_DIR, 'hideko-code-block.umd.js');
        const esmFile = path.resolve(DIST_DIR, 'hideko-code-block.js');

        if (fs.existsSync(umdFile)) {
            fs.copyFileSync(umdFile, path.resolve(DIST_DIR, 'hideko-highlight.min.js'));
            fs.copyFileSync(umdFile, path.resolve(DIST_DIR, 'hideko-code-block.min.js'));
            console.log('  ✓ Created compatibility aliases: hideko-highlight.min.js, hideko-code-block.min.js');
        }
        if (fs.existsSync(esmFile)) {
            fs.copyFileSync(esmFile, path.resolve(DIST_DIR, 'hideko-highlight.js'));
            console.log('  ✓ Created compatibility alias: hideko-highlight.js');
        }

        // ====================================================================
        // 5. Bundle Demo directory into dist/demo/ and rewrite relative paths
        // ====================================================================
        console.log('📦 Bundling demo into dist/demo...');
        const demoSrcDir = path.resolve(ROOT_DIR, 'demo');
        const distDemoDir = path.resolve(DIST_DIR, 'demo');

        if (!fs.existsSync(distDemoDir)) {
            fs.mkdirSync(distDemoDir, { recursive: true });
        }

        const demoFiles = fs.readdirSync(demoSrcDir);
        for (const file of demoFiles) {
            const srcPath = path.join(demoSrcDir, file);
            const destPath = path.join(distDemoDir, file);

            if (fs.statSync(srcPath).isDirectory()) {
                fs.cpSync(srcPath, destPath, { recursive: true });
                continue;
            }

            if (file.endsWith('.html') || file.endsWith('.md')) {
                let html = fs.readFileSync(srcPath, 'utf8');
                // Adjust paths from demo/ (where dist is ../dist/) to dist/demo/ (where dist is ../)
                html = html
                    .replace(/\.\.\/dist\/style\.min\.css/g, '../style.min.css')
                    .replace(/\.\.\/dist\/style\.css/g, '../style.css')
                    .replace(/\.\.\/dist\/hideko-code-block\.umd\.js/g, '../hideko-code-block.umd.js')
                    .replace(/\.\.\/dist\/hideko-code-block\.js/g, '../hideko-code-block.js')
                    .replace(/\.\.\/dist\/hideko-highlight\.min\.js/g, '../hideko-code-block.umd.js')
                    .replace(/\.\.\/dist\/hideko-highlight\.js/g, '../hideko-code-block.js')
                    .replace(/\.\.\/dist\/languages\//g, '../languages/');
                fs.writeFileSync(destPath, html, 'utf8');
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
        console.log(`  ✓ ${demoFiles.length} demo files copied and path-corrected into dist/demo/`);

        // Generate dist/index.html redirecting to demo/index.html
        const distIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=demo/index.html">
    <title>Hideko Code Block - Redirecting</title>
    <script>window.location.replace("demo/index.html");</script>
</head>
<body style="background:#0d1117;color:#c9d1d9;font-family:sans-serif;padding:40px;text-align:center;">
    <p>Redirecting to <a href="demo/index.html" style="color:#58a6ff;">Demo Hub...</a></p>
</body>
</html>
`;
        fs.writeFileSync(path.resolve(DIST_DIR, 'index.html'), distIndexHtml, 'utf8');
        console.log('  ✓ dist/index.html (redirect to demo/index.html)');

        console.log('\n✨ Build and post-processing completed successfully!\n');
    } catch (err) {
        console.error('❌ Post-build failed:', err);
        process.exit(1);
    }
}

postBuild();
