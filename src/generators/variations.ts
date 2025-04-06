import { type } from "arktype";
import { createLoom } from "../loom";

const variationsInputSchema = type({
  codePoints: "string[]",
  style: "string",
  comment: "string",
});

const variationsOptionsSchema = type({
  separator: "string",
  commentPrefix: "string",
  version: "string",
});

export const variations = createLoom({
  inputSchema: variationsInputSchema,
  optionsSchema: variationsOptionsSchema,
  template: (ctx, item) => {
    return `${item.codePoints.join(" ")} ${ctx.options.separator} ${item.style} ${ctx.options.separator} ${ctx.options.commentPrefix} ${item.comment}`;
  },
  eof: true,
  presets: {
    commonSymbols: [
      {
        codePoints: ["2764", "FE0E"],
        style: "text",
        comment: "heart as text symbol",
      },
      {
        codePoints: ["2764", "FE0F"],
        style: "emoji",
        comment: "heart as emoji symbol",
      },
      {
        codePoints: ["2B50", "FE0E"],
        style: "text",
        comment: "star as text symbol",
      },
      {
        codePoints: ["2B50", "FE0F"],
        style: "emoji",
        comment: "star as emoji symbol",
      },
    ],
    punctuation: [
      {
        codePoints: ["2757", "FE0E"],
        style: "text",
        comment: "exclamation mark as text",
      },
      {
        codePoints: ["2757", "FE0F"],
        style: "emoji",
        comment: "exclamation mark as emoji",
      },
      {
        codePoints: ["2753", "FE0E"],
        style: "text",
        comment: "question mark as text",
      },
      {
        codePoints: ["2753", "FE0F"],
        style: "emoji",
        comment: "question mark as emoji",
      },
    ],
    miscellaneous: [
      {
        codePoints: ["2600", "FE0E"],
        style: "text",
        comment: "sun as text symbol",
      },
      {
        codePoints: ["2600", "FE0F"],
        style: "emoji",
        comment: "sun as emoji symbol",
      },
      {
        codePoints: ["2695", "FE0E"],
        style: "text",
        comment: "medical symbol as text",
      },
      {
        codePoints: ["2695", "FE0F"],
        style: "emoji",
        comment: "medical symbol as emoji",
      },
    ],
  },
});
