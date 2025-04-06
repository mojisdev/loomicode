import { z } from "zod";
import bundledSmileys from "../bundled-json-files/emoji-test-smileys.json";
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

const baseEmojiTest = createLoom({
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
});

export const emojiTest = Object.assign(baseEmojiTest, {
  smileys: (version: string): string => {
    return baseEmojiTest({
      version,
      separator: ";",
      commentPrefix: "#",
      // @ts-expect-error asd
      input: bundledSmileys,
    });
  },
  skinTone: (version: string): string => {
    return baseEmojiTest({
      version,
      separator: ";",
      commentPrefix: "#",
      input: [
        {
          group: "Component",
          subgroups: [
            {
              subgroup: "skin-tone",
              entries: [
                {
                  codePoints: ["1F3FB"],
                  status: "component",
                  comment: "light skin tone",
                },
                {
                  codePoints: ["1F3FC"],
                  status: "component",
                  comment: "medium-light skin tone",
                },
                {
                  codePoints: ["1F3FD"],
                  status: "component",
                  comment: "medium skin tone",
                },
                {
                  codePoints: ["1F3FE"],
                  status: "component",
                  comment: "medium-dark skin tone",
                },
                {
                  codePoints: ["1F3FF"],
                  status: "component",
                  comment: "dark skin tone",
                },
              ],
            },
          ],
        },
      ],
    });
  },
  family: (version: string): string => {
    return baseEmojiTest({
      version,
      separator: ";",
      commentPrefix: "#",
      input: [
        {
          group: "People & Body",
          subgroups: [
            {
              subgroup: "family",
              entries: [
                {
                  codePoints: ["1F468", "200D", "1F469", "200D", "1F467"],
                  status: "fully-qualified",
                  comment: "family: man, woman, girl",
                },
                {
                  codePoints: ["1F468", "200D", "1F469", "200D", "1F467", "200D", "1F466"],
                  status: "fully-qualified",
                  comment: "family: man, woman, girl, boy",
                },
                {
                  codePoints: ["1F468", "200D", "1F469", "200D", "1F466", "200D", "1F466"],
                  status: "fully-qualified",
                  comment: "family: man, woman, boy, boy",
                },
              ],
            },
          ],
        },
      ],
    });
  },

  flag: (version: string): string => {
    return baseEmojiTest({
      version,
      separator: ";",
      commentPrefix: "#",
      input: [
        {
          group: "Flags",
          subgroups: [
            {
              subgroup: "country-flag",
              entries: [
                {
                  codePoints: ["1F1E6", "1F1E8"],
                  status: "fully-qualified",
                  comment: "flag: Argentina",
                },
                {
                  codePoints: ["1F1E6", "1F1F4"],
                  status: "fully-qualified",
                  comment: "flag: Angola",
                },
                {
                  codePoints: ["1F1E6", "1F1F6"],
                  status: "fully-qualified",
                  comment: "flag: Antarctica",
                },
              ],
            },
          ],
        },
      ],
    });
  },
});
