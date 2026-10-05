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
 */export const conf={comments:{lineComment:"#"},brackets:[["{","}"],["[","]"],["(",")"]]},language={defaultToken:"",tokenPostfix:".r",keywords:["if","else","repeat","while","function","for","in","next","break","TRUE","FALSE","NULL","Inf","NaN","NA","NA_integer_","NA_real_","NA_complex_","NA_character_"],tokenizer:{root:[[/[a-zA-Z_]\w*/,{cases:{"@keywords":"keyword","@default":"identifier"}}],[/[{}()\[\]]/,"@brackets"],[/[=><!~?&|+\-*/\^;\.,:]+/,"delimiter"],[/\d*\.\d+([eE][\-+]?\d+)?/,"number.float"],[/\d+/,"number"],[/"([^"\\]|\\.)*"/,"string"],[/'([^'\\]|\\.)*'/,"string"],[/#.*/,"comment"],[/[ \t\r\n]+/,""]]}};const e=typeof globalThis<"u"?globalThis.HidekoCodeBlock||globalThis.HidekoHighlight||globalThis.Hideko:null;e&&typeof e.registerLanguage=="function"&&e.registerLanguage("r",language);export default{language,conf:typeof conf<"u"?conf:{}};
