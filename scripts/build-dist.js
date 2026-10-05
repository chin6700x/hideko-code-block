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
            let content = fs.readFileSync(path.join(langSrcDir, file), 'utf8');
            content = content.replace(/^\/\*\*[\s\S]*?\*\/\s*/, '');

            if (file === 'language-aliases.js') {
                const minified = esbuild.transformSync(content, { minify: true, target: 'es2020', banner: JS_BANNER, legalComments: 'none' }).code;
                fs.writeFileSync(path.join(DIST_LANG_DIR, file), minified, 'utf8');
                continue;
            }

            const langName = path.basename(file, '.js');
            languageNames.push(langName);

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

            const minified = esbuild.transformSync(content, { minify: true, target: 'es2020', banner: JS_BANNER, legalComments: 'none' }).code;
            fs.writeFileSync(path.join(DIST_LANG_DIR, file), minified, 'utf8');
        }

        // Generate dist/languages/index.js
        const imports = languageNames.map(name => `import ${name.replace(/-/g, '_')} from './${name}.js';`).join('\n');
        const exportsList = languageNames.map(name => `    ${name.replace(/-/g, '_')}`).join(',\n');
        const reexports = languageNames.map(name => `export { default as ${name.replace(/-/g, '_')} } from './${name}.js';`).join('\n');

        const indexContent = `${imports}
export { languageAliases, languageAliases as extensionMap, detectLanguage } from './language-aliases.js';
${reexports}
export const allLanguages = {
${exportsList}
};
export default allLanguages;
`;
        const minifiedIndex = esbuild.transformSync(indexContent, { minify: true, target: 'es2020', banner: JS_BANNER, legalComments: 'none' }).code;
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
            legalComments: 'none',
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
            legalComments: 'none',
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
            legalComments: 'none',
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

        // Clean up redundant dist/demo and dist/index.html if they exist
        const distDemoDir = path.resolve(DIST_DIR, 'demo');
        const distIndexHtml = path.resolve(DIST_DIR, 'index.html');
        if (fs.existsSync(distDemoDir)) {
            fs.rmSync(distDemoDir, { recursive: true, force: true });
        }
        if (fs.existsSync(distIndexHtml)) {
            fs.unlinkSync(distIndexHtml);
        }

        console.log('\n✨ Build and post-processing completed successfully!\n');
    } catch (err) {
        console.error('❌ Post-build failed:', err);
        process.exit(1);
    }
}

postBuild();
