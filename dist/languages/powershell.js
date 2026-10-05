/**
 * hideko-code-block
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

export const conf={comments:{lineComment:"#",blockComment:["<#","#>"]},brackets:[["{","}"],["[","]"],["(",")"]]},language={defaultToken:"",tokenPostfix:".ps1",ignoreCase:!0,keywords:["begin","break","catch","class","continue","data","define","do","dynamicparam","else","elseif","end","exit","filter","finally","for","foreach","from","function","if","in","param","process","return","switch","throw","trap","try","until","using","var","while","workflow","parallel","sequence","inlinescript","configuration"],tokenizer:{root:[[/[a-zA-Z_\-][\w\-]*/,{cases:{"@keywords":"keyword","@default":"identifier"}}],[/\$[a-zA-Z_\-][\w\-]*/,"variable"],[/[{}()\[\]]/,"@brackets"],[/[=><!~?&|+\-*/\^;\.,]+/,"delimiter"],[/\d*\.\d+([eE][\-+]?\d+)?/,"number.float"],[/0[xX][0-9a-fA-F]+/,"number.hex"],[/\d+/,"number"],[/"([^"\\]|\\.)*"/,"string"],[/'([^'\\]|\\.)*'/,"string"],[/#.*/,"comment"],[/<#/,"comment","@comment"],[/[ \t\r\n]+/,""]],comment:[[/[^<#]+/,"comment"],[/#>/,"comment","@pop"],[/[<#]/,"comment"]]}};const e=typeof globalThis<"u"?globalThis.HidekoCodeBlock||globalThis.HidekoHighlight||globalThis.Hideko:null;e&&typeof e.registerLanguage=="function"&&e.registerLanguage("powershell",language);export default{language,conf:typeof conf<"u"?conf:{}};
