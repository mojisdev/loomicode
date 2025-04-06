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
    return `${item.codePoints.join(" ")} ${ctx.options.separator} ${item.type} ${ctx.options.separator} ${item.description} ${ctx.options.commentPrefix} ${item.comment}`;
  },
  eof: true,
  presets: {
    basicEmojis: [
      {
        codePoints: ["1F600"],
        type: "emoji",
        description: "grinning face",
        comment: "basic smiley",
      },
      {
        codePoints: ["1F601"],
        type: "emoji",
        description: "beaming face with smiling eyes",
        comment: "happy expression",
      },
    ],
    handGestures: [
      {
        codePoints: ["1F44D"],
        type: "emoji",
        description: "thumbs up",
        comment: "positive gesture",
      },
      {
        codePoints: ["1F44C"],
        type: "emoji",
        description: "OK hand",
        comment: "approval gesture",
      },
    ],
    hearts: [
      {
        codePoints: ["2764"],
        type: "emoji",
        description: "red heart",
        comment: "classic heart",
      },
      {
        codePoints: ["1F49B"],
        type: "emoji",
        description: "yellow heart",
        comment: "friendship heart",
      },
    ],
  },
});
