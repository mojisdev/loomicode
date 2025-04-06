import { z } from "zod";
import bundledFlags from "../bundled-json-files/emoji-test-flags.json" with { type: "json" };
import bundledSmileys from "../bundled-json-files/emoji-test-smileys.json" with { type: "json" };
import { createLoom } from "../loom";

const VALID_STATUS = [
  "component",
  "fully-qualified",
  "minimally-qualified",
  "unqualified",
] as const;

const entry = z.object({
  codePoints: z.array(z.string()),
  // can't use union of literals since typescript can only infer
  // the status type to a string, and not the union of literals
  status: z.string().refine(
    (val) => VALID_STATUS.includes(val as (typeof VALID_STATUS)[number]),
    {
      message: `status must be one of: ${VALID_STATUS.join(", ")}`,
    },
  ),
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
    // files for versions 3.x and under doesn't exist.
    return ctx.isVersionGreaterThanOrEqual("3.x");
  },
  eof: true,
  template: (ctx, item) => {
    let template = `# group: ${item.group}\n\n`;

    for (const subgroup of item.subgroups) {
      template += `# subgroup: ${subgroup.subgroup}\n`;

      for (const entry of subgroup.entries) {
        template += `${entry.codePoints.join(" ")} ${ctx.options.separator} ${entry.status} ${ctx.options.commentPrefix} ${entry.comment}\n`;
      }
    }

    return template;
  },
  presets: {
    smileys: bundledSmileys,
    flags: bundledFlags,
  },
});
