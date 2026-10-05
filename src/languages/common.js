/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

/**
 * Common Languages Bundle for Hideko V8
 * Pre-bundles the top 10 most popular programming languages for zero-config offline usage.
 */

import * as javascript from './javascript.js';
import * as typescript from './typescript.js';
import * as html from './html.js';
import * as css from './css.js';
import * as c from './c.js';
import * as python from './python.js';
import * as sql from './sql.js';
import * as json from './json.js';
import * as markdown from './markdown.js';
import * as shell from './shell.js';

export const commonLanguages = {
    javascript,
    typescript,
    html,
    css,
    c,
    cpp: c,
    python,
    sql,
    json,
    markdown,
    shell,
    bash: shell
};

export default commonLanguages;
