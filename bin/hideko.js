#!/usr/bin/env node

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
