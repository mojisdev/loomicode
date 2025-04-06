import { type } from "arktype";
import { createLoom } from "../loom";

const sequencesInputSchema = type({
  codePoints: "string[]",
  type: "string",
  description: "string",
  comment: "string",
});

const sequencesOptionsSchema = type({
  separator: "string",
  commentPrefix: "string",
  version: "string",
});

export const sequences = createLoom({
  inputSchema: sequencesInputSchema,
  optionsSchema: sequencesOptionsSchema,
  template: (ctx, item) => {
    //              ^?
    return `${item.codePoints.join(" ")} ${ctx.options.separator} ${item.type} ${ctx.options.separator} ${item.description} ${ctx.options.commentPrefix} ${item.comment}`;
  },
});
