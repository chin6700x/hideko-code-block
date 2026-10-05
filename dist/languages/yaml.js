/**
 * hideko-code-block
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

export const conf={comments:{lineComment:"#"},brackets:[["{","}"],["[","]"],["(",")"]],autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"'},{open:"'",close:"'"}]},language={tokenPostfix:".yaml",keywords:["true","True","TRUE","false","False","FALSE","null","Null","NULL","~"],tokenizer:{root:[[/#.*$/,"comment"],[/^[ \\t]*[a-zA-Z0-9_\\-]+[ \\t]*(?=:)/,"type"],[/:/,"delimiter"],[/"/,{token:"string.quote",next:"@string_double"}],[/'/,{token:"string.quote",next:"@string_single"}],[/[a-z_$][\\w$]*/,{cases:{"@keywords":"keyword","@default":"identifier"}}],[/-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?/,"number"],[/[ \\t\\r\\n]+/,""]],string_double:[[/[^\\\\"]+/,"string"],[/\\\\./,"string.escape"],[/"/,{token:"string.quote",next:"@pop"}]],string_single:[[/[^']+/,"string"],[/''/,"string.escape"],[/'/,{token:"string.quote",next:"@pop"}]]}};const e=typeof globalThis<"u"?globalThis.HidekoCodeBlock||globalThis.HidekoHighlight||globalThis.Hideko:null;e&&typeof e.registerLanguage=="function"&&e.registerLanguage("yaml",language);export default{language,conf:typeof conf<"u"?conf:{}};
