import { type } from "arktype";
import { createLoom } from "../loom";

const zwjSequencesInputSchema = type({
  codePoints: "string[]",
  type: "string",
  description: "string",
  comment: "string",
});

const zwjSequencesOptionsSchema = type({
  separator: "string",
  commentPrefix: "string",
  version: "string",
});

export const zwjSequences = createLoom({
  inputSchema: zwjSequencesInputSchema,
  optionsSchema: zwjSequencesOptionsSchema,
  template: (ctx, item) => {
    return `${item.codePoints.join(" ")} ${ctx.options.separator} ${item.type} ${ctx.options.separator} ${item.description} ${ctx.options.commentPrefix} ${item.comment}`;
  },
  eof: true,
  presets: {
    familyCombinations: [
      {
        codePoints: ["1F468", "200D", "1F469", "200D", "1F467"],
        type: "zwj_sequence",
        description: "family: man, woman, girl",
        comment: "basic family combination",
      },
      {
        codePoints: ["1F469", "200D", "1F469", "200D", "1F466"],
        type: "zwj_sequence",
        description: "family: woman, woman, boy",
        comment: "same-sex parent family",
      },
      {
        codePoints: ["1F468", "200D", "1F468", "200D", "1F467", "200D", "1F466"],
        type: "zwj_sequence",
        description: "family: man, man, girl, boy",
        comment: "extended family combination",
      },
    ],
    professions: [
      {
        codePoints: ["1F469", "200D", "1F3EB"],
        type: "zwj_sequence",
        description: "woman teacher",
        comment: "profession with female emoji",
      },
      {
        codePoints: ["1F468", "200D", "1F373"],
        type: "zwj_sequence",
        description: "man cook",
        comment: "profession with male emoji",
      },
      {
        codePoints: ["1F469", "200D", "1F4BB"],
        type: "zwj_sequence",
        description: "woman technologist",
        comment: "modern profession",
      },
    ],
    couples: [
      {
        codePoints: ["1F469", "200D", "2764", "FE0F", "200D", "1F468"],
        type: "zwj_sequence",
        description: "couple with heart: woman, man",
        comment: "romantic combination with heart",
      },
      {
        codePoints: ["1F468", "200D", "2764", "FE0F", "200D", "1F468"],
        type: "zwj_sequence",
        description: "couple with heart: man, man",
        comment: "same-sex couple with heart",
      },
      {
        codePoints: ["1F469", "200D", "2764", "FE0F", "200D", "1F469"],
        type: "zwj_sequence",
        description: "couple with heart: woman, woman",
        comment: "same-sex couple with heart",
      },
    ],
  },
});
