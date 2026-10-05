/**
 * hideko-code-block
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

export const conf={comments:{lineComment:"//",blockComment:["/*","*/"]},brackets:[["{","}"],["[","]"],["(",")"]]},language={defaultToken:"",tokenPostfix:".scala",keywords:["abstract","case","catch","class","def","do","else","extends","false","final","finally","for","forSome","if","implicit","import","lazy","match","new","null","object","override","package","private","protected","return","sealed","super","this","throw","trait","try","true","type","val","var","while","with","yield"],tokenizer:{root:[[/[a-zA-Z_]\w*/,{cases:{"@keywords":"keyword","@default":"identifier"}}],[/[{}()\[\]]/,"@brackets"],[/[=><!~?&|+\-*/\^;\.,:]+/,"delimiter"],[/\d*\.\d+([eE][\-+]?\d+)?/,"number.float"],[/0[xX][0-9a-fA-F]+/,"number.hex"],[/\d+/,"number"],[/"([^"\\]|\\.)*"/,"string"],[/'([^'\\]|\\.)*'/,"string"],[/\/\/.*/,"comment"],[/\/\*/,"comment","@comment"],[/[ \t\r\n]+/,""]],comment:[[/[^\/*]+/,"comment"],[/\*\//,"comment","@pop"],[/[\/*]/,"comment"]]}};const e=typeof globalThis<"u"?globalThis.HidekoCodeBlock||globalThis.HidekoHighlight||globalThis.Hideko:null;e&&typeof e.registerLanguage=="function"&&e.registerLanguage("scala",language);export default{language,conf:typeof conf<"u"?conf:{}};
