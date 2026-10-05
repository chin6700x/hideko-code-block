/**
 * hideko-code-block
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

import{conf as s,language as e}from"./typescript.js";const t=s,i={defaultToken:"invalid",tokenPostfix:".js",keywords:["break","case","catch","class","continue","const","constructor","debugger","default","delete","do","else","export","extends","false","finally","for","from","function","get","if","import","in","instanceof","let","new","null","return","set","static","super","switch","symbol","this","throw","true","try","typeof","undefined","var","void","while","with","yield","async","await","of"],typeKeywords:[],operators:e.operators,symbols:e.symbols,escapes:e.escapes,digits:e.digits,octaldigits:e.octaldigits,binarydigits:e.binarydigits,hexdigits:e.hexdigits,regexpctl:e.regexpctl,regexpesc:e.regexpesc,tokenizer:e.tokenizer};export{t as conf,i as language};const o=typeof globalThis<"u"?globalThis.HidekoCodeBlock||globalThis.HidekoHighlight||globalThis.Hideko:null;o&&typeof o.registerLanguage=="function"&&o.registerLanguage("javascript",i);export default{language:i,conf:typeof t<"u"?t:{}};
