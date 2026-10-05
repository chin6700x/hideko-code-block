#!/usr/bin/env node
/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const builtCliPath = path.resolve(__dirname, '../dist/node/cli.js');
const srcCliPath = path.resolve(__dirname, '../src/node/cli.js');
const targetPath = fs.existsSync(builtCliPath) ? builtCliPath : srcCliPath;

const { runCli } = await import(`file://${targetPath}`);
runCli();

