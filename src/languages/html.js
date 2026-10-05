/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

export const conf = {
  comments: { blockComment: ["<!--", "-->"] },
  brackets: [["<", ">"]]
};
export const language = {
  defaultToken: "",
  tokenPostfix: ".html",
  ignoreCase: true,
  tokenizer: {
    root: [
      [/[^<&]+/, ""],
      [/<!--/, "comment", "@comment"],
      [/(<\!DOCTYPE)(.*?)(>)/, ["delimiter", "metatag", "delimiter"]],
      [/(<\/)([\w\-]+)/, ["delimiter", { token: "tag", next: "@tag" }]],
      [/(<)([\w\-]+)/, ["delimiter", { token: "tag", next: "@tag" }]],
      [/&\w+;/, "string.escape"]
    ],
    tag: [
      [/[ \t\r\n]+/, ""],
      [/([\w\-]+)(\s*=\s*)("[^"]*"|'[^']*')/, ["attribute.name", "", "attribute.value"]],
      [/([\w\-]+)(\s*=\s*)/, ["attribute.name", ""]],
      [/[\w\-]+/, "attribute.name"],
      [/\/>/, "delimiter", "@pop"],
      [/>/, "delimiter", "@pop"]
    ],
    comment: [
      [/[^<\-]+/, "comment"],
      [/-->/, "comment", "@pop"],
      [/[<\-]/, "comment"]
    ]
  }
};
