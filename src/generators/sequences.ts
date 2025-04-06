import { z } from "zod";
import { createLoom } from "./loom";

const sequencesInputSchema = z.object({
  codePoints: z.array(z.string()),
  type: z.string(),
  description: z.string(),
  comment: z.string(),
});

const sequencesOptionsSchema = z.object({
  separator: z.string(),
  commentPrefix: z.string(),
  version: z.string(),
});

export const sequences = createLoom({
  inputSchema: sequencesInputSchema,
  optionsSchema: sequencesOptionsSchema,
  template: (ctx, item) => {
    return `${item.codePoints.join(" ")} ${ctx.options.separator} ${item.type} ${ctx.options.separator} ${item.description} ${ctx.options.commentPrefix} ${item.comment}`;
  },
});
