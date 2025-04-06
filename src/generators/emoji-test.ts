import { type } from "arktype";
import bundledFlags from "../bundled-json-files/emoji-test-flags.json" with { type: "json" };
import bundledSmileys from "../bundled-json-files/emoji-test-smileys.json" with { type: "json" };
import { createLoom } from "../loom";

// eslint-disable-next-line unused-imports/no-unused-vars
const VALID_STATUS = [
  "component",
  "fully-qualified",
  "minimally-qualified",
  "unqualified",
] as const;

const entrySchema = type({
  codePoints: "string[]",
  // can't use union of literals since typescript can only infer
  // the status type to a string, and not the union of literals
  status: "string",
  comment: "string",
});

const subgroupEntrySchema = type({
  subgroup: "string",
  entries: entrySchema.array(),
});

const emojiTestInputSchema = type({
  group: "string",
  subgroups: subgroupEntrySchema.array(),
});

const emojiTestOptionsSchema = type({
  separator: "string",
  commentPrefix: "string",
  version: "string",
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
    multipleGroups: [
      ...bundledSmileys,
      ...bundledFlags,
    ],
    invalid: [
      {
        group: "Invalid",
        subgroups: [
          {
            subgroup: "invalid-subgroup",
            entries: [
              {
                codePoints: [],
                status: "fully-qualified",
                comment: "",
              },
            ],
          },
        ],
      },
    ],
  },
});
