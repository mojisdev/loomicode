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
});
