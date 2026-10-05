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
 */export const conf={comments:{lineComment:"REM"},brackets:[["{","}"],["[","]"],["(",")"]]},language={defaultToken:"",tokenPostfix:".bat",ignoreCase:!0,keywords:["call","defined","echo","errorlevel","exist","for","goto","if","pause","set","shift","start","title","not","pushd","popd","rem","setlocal","endlocal","mkdir","rmdir","cd","exit"],tokenizer:{root:[[/^\s*rem.*$/,"comment"],[/[a-zA-Z_]\w*/,{cases:{"@keywords":"keyword","@default":"identifier"}}],[/%[^%]+%/,"variable"],[/%%\w+/,"variable"],[/[:][a-zA-Z_]\w*/,"metatag"],[/[{}()\[\]]/,"@brackets"],[/[=><!~?&|+\-*/\^;\.,]+/,"delimiter"],[/"([^"\\]|\\.)*"/,"string"],[/[ \t\r\n]+/,""]]}};const e=typeof globalThis<"u"?globalThis.HidekoCodeBlock||globalThis.HidekoHighlight||globalThis.Hideko:null;e&&typeof e.registerLanguage=="function"&&e.registerLanguage("bat",language);export default{language,conf:typeof conf<"u"?conf:{}};
