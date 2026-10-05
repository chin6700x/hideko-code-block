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
  tokenPostfix: ".dockerfile",
  keywords: [ "FROM", "MAINTAINER", "RUN", "CMD", "EXPOSE", "ENV", "ADD", "COPY", "ENTRYPOINT", "VOLUME", "USER", "WORKDIR", "ONBUILD", "LABEL", "STOPSIGNAL", "HEALTHCHECK", "SHELL" ],
  tokenizer: {
    root: [
      [/^[ \t]*[a-zA-Z]+/, { cases: { "@keywords": "keyword", "@default": "identifier" } }],
      [/[a-zA-Z_]\w*/, "identifier"],
      [/[{}()\[\]]/, "@brackets"],
      [/"([^"\\]|\\.)*"/, "string"],
      [/'([^'\\]|\\.)*'/, "string"],
      [/#.*/, "comment"],
      [/[ \t\r\n]+/, ""]
    ]
  }
};
