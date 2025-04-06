import { z } from "zod";
import { createLoom } from "../loom";

const entry = z.object({
  codePoints: z.array(z.string()),
  status: z.union([
    z.literal("component"),
    z.literal("fully-qualified"),
    z.literal("minimally-qualified"),
    z.literal("unqualified"),
  ]),
  comment: z.string(),
});

const emojiTestInputSchema = z.object({
  group: z.string(),
  subgroups: z.array(z.object({
    subgroup: z.string(),
    entries: z.array(entry),
  })),
});

const emojiTestOptionsSchema = z.object({
  separator: z.string(),
  commentPrefix: z.string(),
  version: z.string(),
});

export const emojiTest = createLoom({
  inputSchema: emojiTestInputSchema,
  optionsSchema: emojiTestOptionsSchema,
  predicate: (ctx) => {
    return ctx.isVersionLessThanOrEqual("3.x");
  },
  template: (ctx, item) => {
    let template = `group: ${item.group}\n`;

    for (const subgroup of item.subgroups) {
      template += `subgroup: ${subgroup.subgroup}\n`;

      for (const entry of subgroup.entries) {
        template += `${entry.codePoints.join(" ")} ${ctx.options.separator} ${entry.status} ${ctx.options.commentPrefix} ${entry.comment}\n`;
      }
    }

    return template;
  },
});
