/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

export const conf = {
  comments: { lineComment: "#" },
  brackets: [ ["{", "}"], ["[", "]"], ["(", ")"] ]
};
export const language = {
  defaultToken: "",
  tokenPostfix: ".graphql",
  keywords: [ "query", "mutation", "subscription", "fragment", "on", "type", "interface", "union", "scalar", "enum", "input", "implements", "directive", "extend", "schema" ],
  tokenizer: {
    root: [
      [/[a-zA-Z_]\w*/, { cases: { "@keywords": "keyword", "@default": "identifier" } }],
      [/@[a-zA-Z_]\w*/, "metatag"],
      [/\$[a-zA-Z_]\w*/, "variable"],
      [/[{}()\[\]]/, "@brackets"],
      [/[=><!~?&|+\-*/\^;\.,:]+/, "delimiter"],
      [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
      [/\d+/, "number"],
      [/"([^"\\]|\\.)*"/, "string"],
      [/#.*/, "comment"],
      [/[ \t\r\n]+/, ""]
    ]
  }
};
