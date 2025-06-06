import { describe, expect, it } from "vitest";
import { sequences } from "../src/generators/sequences";

describe("sequences", () => {
  const defaultOptions = {
    separator: "|",
    commentPrefix: "#",
    version: "1.0",
  };

  it("should format a sequence with valid input", () => {
    const input = {
      codePoints: ["1F600", "1F601"],
      type: "emoji",
      description: "smiling face",
      comment: "happy expression",
    };

    const result = sequences({ ...defaultOptions, input: [input] });
    expect(result).toBe(
      "1F600 1F601 | emoji | smiling face # happy expression\n"
      + "#EOF\n",
    );
  });

  it("should handle single code point", () => {
    const input = {
      codePoints: ["1F600"],
      type: "emoji",
      description: "smiling face",
      comment: "happy expression",
    };

    const result = sequences({ ...defaultOptions, input: [input] });
    expect(result).toBe(
      "1F600 | emoji | smiling face # happy expression\n"
      + "#EOF\n",
    );
  });

  it("should use custom separator and comment prefix", () => {
    const input = {
      codePoints: ["1F600"],
      type: "emoji",
      description: "smiling face",
      comment: "happy expression",
    };

    const options = {
      ...defaultOptions,
      separator: "->",
      commentPrefix: "//",
    };

    const result = sequences({ ...options, input: [input] });
    expect(result).toBe(
      "1F600 -> emoji -> smiling face // happy expression\n"
      + "#EOF\n",
    );
  });

  it("should validate input schema", () => {
    const invalidInput = {
      codePoints: ["1F600"],
      type: "emoji",
      description: "smiling face",
      comment: "happy expression",
    } as const;

    expect(() => sequences({
      ...defaultOptions,
      input: [
        // @ts-expect-error - testing invalid input
        { ...invalidInput, description: undefined },
      ],
    })).toThrow("description must be a string (was undefined)");
  });

  it("should validate options schema", () => {
    const input = {
      codePoints: ["1F600"],
      type: "emoji",
      description: "smiling face",
      comment: "happy expression",
    };

    const invalidOptions = {
      separator: "|",
      commentPrefix: "#",
      version: "1.0",
    } as const;

    expect(() => sequences({
      ...invalidOptions,
      // @ts-expect-error - testing invalid options
      commentPrefix: undefined,
      input: [input],
    })).toThrow("commentPrefix must be a string (was undefined)");
  });

  it("should handle empty code points array", () => {
    const input = {
      codePoints: [],
      type: "emoji",
      description: "smiling face",
      comment: "happy expression",
    };

    const result = sequences({ ...defaultOptions, input: [input] });
    expect(result).toBe(
      " | emoji | smiling face # happy expression\n"
      + "#EOF\n",
    );
  });

  it("should handle multiple inputs", () => {
    const inputs = [
      {
        codePoints: ["1F600"],
        type: "emoji",
        description: "smiling face",
        comment: "happy expression",
      },
      {
        codePoints: ["1F601"],
        type: "emoji",
        description: "grinning face",
        comment: "very happy",
      },
    ];

    const result = sequences({ ...defaultOptions, input: inputs });
    expect(result).toBe(
      "1F600 | emoji | smiling face # happy expression\n"
      + "1F601 | emoji | grinning face # very happy\n"
      + "#EOF\n",
    );
  });
});
