/**
 * hideko-code-block
 *
 * @author Wirot Chookeaw Chin6700x <Chin6700X@gmail.com>
 * @license MIT License
 */

const conf = {
  comments: {
    blockComment: ["<!--", "-->"]
  },
  brackets: [["<", ">"]],
  autoClosingPairs: [
    { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: '"', close: '"' }
  ],
  surroundingPairs: [
    { open: "<", close: ">" },
    { open: "'", close: "'" },
    { open: '"', close: '"' }
  ]
};

const language = {
  defaultToken: "",
  tokenPostfix: ".xml",
  ignoreCase: true,
  tokenizer: {
    root: [
      [/[^<&]+/, ""],
      [/<!--/, "comment", "@comment"],
      [/(<\?)([\w\-:]+)/, ["delimiter", "metatag"]],
      [/(<\!)([\w\-:]+)/, ["delimiter", "metatag"]],
      [/(<)([\w\-:]+)/, ["delimiter", "tag"]],
      [/(<\/)([\w\-:]+)/, ["delimiter", "tag"]],
      [/>/, "delimiter"],
      [/\?>/, "delimiter"],
      [/[\w\-:]+(?=\s*=)/, "attribute.name"],
      [/=/, "delimiter"],
      [/"[^"]*"/, "string"],
      [/'[^']*'/, "string"],
      [/&\w+;/, "string.escape"],
      [/[ \t\r\n]+/, ""]
    ],
    comment: [
      [/[^<\-]+/, "comment"],
      [/-->/, "comment", "@pop"],
      [/[<\-]/, "comment"]
    ]
  }
};

export { conf, language };
