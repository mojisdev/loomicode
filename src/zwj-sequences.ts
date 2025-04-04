import { z } from "zod";
import { createLoom } from "./loom";

const zwjSequencesInputSchema = z.object({
  codePoints: z.array(z.string()),
  type: z.string(),
  description: z.string(),
  comment: z.string(),
});

const zwjSequencesOptionsSchema = z.object({
  separator: z.string(),
  commentPrefix: z.string(),
  version: z.string(),
});

export const zwjSequences = createLoom({
  inputSchema: zwjSequencesInputSchema,
  optionsSchema: zwjSequencesOptionsSchema,
  template: (ctx, item) => {
    return `${item.codePoints.join(" ")} ${ctx.options.separator} ${item.type} ${ctx.options.separator} ${item.description} ${ctx.options.commentPrefix} ${item.comment}`;
  },
});
