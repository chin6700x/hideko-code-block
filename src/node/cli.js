/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

import path from 'path';
import { highlightFile } from './file-converter.js';
import { languageAliases } from '../languages/language-aliases.js';

const VERSION = '1.0.0';

export async function runCli(argv = process.argv.slice(2)) {
    if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
        printHelp();
        return;
    }

    if (argv.includes('--version') || argv.includes('-v')) {
        console.log(`hideko-highlight v${VERSION}`);
        return;
    }

    const command = argv[0];

    if (command === 'languages' || command === 'langs') {
        printLanguages();
        return;
    }

    if (command === 'convert') {
        const input = argv[1];
        if (!input || input.startsWith('-')) {
            console.error('Error: Please specify an input file to convert.');
            console.log('Usage: hideko convert <file> [options]');
            process.exitCode = 1;
            return;
        }

        const options = parseConvertOptions(argv.slice(2));
        try {
            const t0 = performance.now();
            const result = await highlightFile(input, options);
            const t1 = performance.now();

            if (result.outputPath) {
                console.log(`✓ Highlighted [${result.lang}] -> ${path.relative(process.cwd(), result.outputPath)} (${(t1 - t0).toFixed(2)}ms)`);
            } else {
                console.log(result.html);
            }
        } catch (err) {
            console.error(`Hideko Error: ${err.message}`);
            process.exitCode = 1;
        }
        return;
    }

    console.error(`Unknown command: "${command}". Run "hideko --help" for available commands.`);
    process.exitCode = 1;
}

function parseConvertOptions(args) {
    const opts = {
        theme: 'dark',
        standalone: false,
        lineNumbers: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '-o' || arg === '--output') {
            opts.output = args[++i];
        } else if (arg === '-t' || arg === '--theme') {
            opts.theme = args[++i];
        } else if (arg === '-l' || arg === '--lang') {
            opts.lang = args[++i];
        } else if (arg === '-s' || arg === '--standalone') {
            opts.standalone = true;
        } else if (arg === '-n' || arg === '--line-numbers') {
            opts.lineNumbers = true;
        } else if (arg === '--highlight') {
            opts.highlightLines = args[++i];
        }
    }
    return opts;
}

function printHelp() {
    console.log(`
Hideko Lite CLI v${VERSION}
High-Performance Code Highlighter & Document Converter

Usage:
  hideko convert <file> [options]    Convert a code file to syntax-highlighted HTML
  hideko languages                   List all supported language grammars
  hideko --help, -h                  Show this help message
  hideko --version, -v               Display version

Convert Options:
  -o, --output <file>       Output HTML file path (default: stdout)
  -t, --theme <theme>       Theme name: dark, light, dracula, one-dark, nord, monokai, github-dark (default: dark)
  -l, --lang <lang>         Override language detection (e.g. js, python, sql)
  -s, --standalone          Generate a complete, self-contained HTML page with embedded styles
  -n, --line-numbers        Include line numbers
  --highlight <lines>       Highlight specific lines (e.g. "1,3-5,10")

Examples:
  npx hideko convert app.js -o app.html --theme dracula --standalone
  npx hideko convert query.sql -n --highlight 3-5
`);
}

function printLanguages() {
    const canonicals = Array.from(new Set(Object.values(languageAliases))).sort();
    console.log(`Supported Languages (${canonicals.length}):`);
    console.log(canonicals.map(l => `  • ${l}`).join('\n'));
}
