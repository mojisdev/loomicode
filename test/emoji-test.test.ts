import { expect, it } from "vitest";
import { emojiTest } from "../src/generators/emoji-test";

it("should generate correct emoji test output for valid input", () => {
  const result = emojiTest({
    version: "14.0",
    separator: ";",
    commentPrefix: "#",
    input: [
      {
        group: "Smileys & Emotion",
        subgroups: [
          {
            subgroup: "face-smiling",
            entries: [
              {
                codePoints: ["1F600"],
                status: "fully-qualified",
                comment: "grinning face",
              },
              {
                codePoints: ["1F603"],
                status: "fully-qualified",
                comment: "grinning face with big eyes",
              },
            ],
          },
        ],
      },
    ],
  });

  expect(result).toBe(
    "# group: Smileys & Emotion\n\n"
    + "# subgroup: face-smiling\n"
    + "1F600 ; fully-qualified # grinning face\n"
    + "1F603 ; fully-qualified # grinning face with big eyes\n"
    + "\n#EOF\n",
  );
});

it("should handle multiple groups and subgroups", () => {
  const result = emojiTest({
    version: "11.0",
    separator: ";",
    commentPrefix: "#",
    input: [
      {
        group: "Group 1",
        subgroups: [
          {
            subgroup: "Subgroup A",
            entries: [
              {
                codePoints: ["1F600"],
                status: "fully-qualified",
                comment: "test 1",
              },
            ],
          },
        ],
      },
      {
        group: "Group 2",
        subgroups: [
          {
            subgroup: "Subgroup B",
            entries: [
              {
                codePoints: ["1F603"],
                status: "fully-qualified",
                comment: "test 2",
              },
            ],
          },
        ],
      },
    ],
  });

  expect(result).toBe(
    "# group: Group 1\n\n"
    + "# subgroup: Subgroup A\n"
    + "1F600 ; fully-qualified # test 1\n\n"
    + "# group: Group 2\n\n"
    + "# subgroup: Subgroup B\n"
    + "1F603 ; fully-qualified # test 2\n"
    + "\n#EOF\n",
  );
});

it("should handle different status types", () => {
  const result = emojiTest({
    version: "16.0",
    separator: ";",
    commentPrefix: "#",
    input: [
      {
        group: "Test Group",
        subgroups: [
          {
            subgroup: "Test Subgroup",
            entries: [
              {
                codePoints: ["1F600"],
                status: "component",
                comment: "component test",
              },
              {
                codePoints: ["1F603"],
                status: "minimally-qualified",
                comment: "minimally qualified test",
              },
              {
                codePoints: ["1F604"],
                status: "unqualified",
                comment: "unqualified test",
              },
            ],
          },
        ],
      },
    ],
  });

  expect(result).toBe(
    "# group: Test Group\n\n"
    + "# subgroup: Test Subgroup\n"
    + "1F600 ; component # component test\n"
    + "1F603 ; minimally-qualified # minimally qualified test\n"
    + "1F604 ; unqualified # unqualified test\n"
    + "\n#EOF\n",
  );
});

it("should handle multiple code points", () => {
  const result = emojiTest({
    version: "9.0",
    separator: ";",
    commentPrefix: "#",
    input: [
      {
        group: "Test Group",
        subgroups: [
          {
            subgroup: "Test Subgroup",
            entries: [
              {
                codePoints: ["1F600", "1F3FF"],
                status: "fully-qualified",
                comment: "multi code point test",
              },
            ],
          },
        ],
      },
    ],
  });

  expect(result).toBe(
    "# group: Test Group\n\n"
    + "# subgroup: Test Subgroup\n"
    + "1F600 1F3FF ; fully-qualified # multi code point test\n"
    + "\n#EOF\n",
  );
});

it("should filter out entries based on version predicate", () => {
  const result = emojiTest({
    version: "2.0", // version less than 3.x
    separator: ";",
    commentPrefix: "#",
    input: [
      {
        group: "Test Group",
        subgroups: [
          {
            subgroup: "Test Subgroup",
            entries: [
              {
                codePoints: ["1F600"],
                status: "fully-qualified",
                comment: "should be filtered out",
              },
            ],
          },
        ],
      },
    ],
  });

  expect(result).toBe("");
});

it("should handle empty subgroups", () => {
  const result = emojiTest({
    version: "5.0",
    separator: ";",
    commentPrefix: "#",
    input: [
      {
        group: "Test Group",
        subgroups: [
          {
            subgroup: "Empty Subgroup",
            entries: [],
          },
        ],
      },
    ],
  });

  expect(result).toBe(
    "# group: Test Group\n\n"
    + "# subgroup: Empty Subgroup\n"
    + "\n#EOF\n",
  );
});
