/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

export const conf = {
  comments: { lineComment: ";" }
};
export const language = {
  defaultToken: "",
  tokenPostfix: ".ini",
  tokenizer: {
    root: [
      [/^[ \t]*[;#].*$/, "comment"],
      [/^\[[^\]]*\]/, "metatag"],
      [/^([\w\.\-]+)(\s*=\s*)(.*)$/, ["keyword", "", "string"]],
      [/[ \t\r\n]+/, ""]
    ]
  }
};
