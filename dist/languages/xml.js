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
 */const e={comments:{blockComment:["<!--","-->"]},brackets:[["<",">"]],autoClosingPairs:[{open:"<",close:">"},{open:"'",close:"'"},{open:'"',close:'"'}],surroundingPairs:[{open:"<",close:">"},{open:"'",close:"'"},{open:'"',close:'"'}]},o={defaultToken:"",tokenPostfix:".xml",ignoreCase:!0,tokenizer:{root:[[/[^<&]+/,""],[/<!--/,"comment","@comment"],[/(<\?)([\w\-:]+)/,["delimiter","metatag"]],[/(<\!)([\w\-:]+)/,["delimiter","metatag"]],[/(<)([\w\-:]+)/,["delimiter","tag"]],[/(<\/)([\w\-:]+)/,["delimiter","tag"]],[/>/,"delimiter"],[/\?>/,"delimiter"],[/[\w\-:]+(?=\s*=)/,"attribute.name"],[/=/,"delimiter"],[/"[^"]*"/,"string"],[/'[^']*'/,"string"],[/&\w+;/,"string.escape"],[/[ \t\r\n]+/,""]],comment:[[/[^<\-]+/,"comment"],[/-->/,"comment","@pop"],[/[<\-]/,"comment"]]}};export{e as conf,o as language};const t=typeof globalThis<"u"?globalThis.HidekoCodeBlock||globalThis.HidekoHighlight||globalThis.Hideko:null;t&&typeof t.registerLanguage=="function"&&t.registerLanguage("xml",o);export default{language:o,conf:typeof e<"u"?e:{}};
