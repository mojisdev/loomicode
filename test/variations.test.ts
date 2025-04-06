import { describe, expect, it } from "vitest";
import { variations } from "../src/generators/variations";

describe("variations", () => {
  const defaultOptions = {
    separator: ";",
    commentPrefix: "#",
    version: "1.0",
  };

  it("should format a variation with valid input", () => {
    const input = {
      codePoints: ["2764", "FE0F"],
      style: "emoji",
      comment: "heart symbol",
    };

    const result = variations({ ...defaultOptions, input: [input] });
    expect(result).toBe(
      "2764 FE0F ; emoji; # heart symbol\n"
      + "#EOF\n",
    );
  });

  it("should handle multiple variations", () => {
    const inputs = [
      {
        codePoints: ["2764", "FE0E"],
        style: "text",
        comment: "text heart",
      },
      {
        codePoints: ["2764", "FE0F"],
        style: "emoji",
        comment: "emoji heart",
      },
    ];

    const result = variations({ ...defaultOptions, input: inputs });
    expect(result).toBe(
      "2764 FE0E ; text; # text heart\n"
      + "2764 FE0F ; emoji; # emoji heart\n"
      + "#EOF\n",
    );
  });

  it("should use custom separator and comment prefix", () => {
    const input = {
      codePoints: ["2764", "FE0F"],
      style: "emoji",
      comment: "heart symbol",
    };

    const options = {
      ...defaultOptions,
      separator: "->",
      commentPrefix: "//",
    };

    const result = variations({ ...options, input: [input] });
    expect(result).toBe(
      "2764 FE0F -> emoji-> // heart symbol\n"
      + "#EOF\n",
    );
  });

  it("should validate input schema", () => {
    const invalidInput = {
      codePoints: ["2764", "FE0F"],
      style: "emoji",
      comment: "heart symbol",
    } as const;

    expect(() => variations({
      ...defaultOptions,
      input: [
        // @ts-expect-error - testing invalid input
        { ...invalidInput, style: undefined },
      ],
    })).toThrow("style must be a string (was undefined)");
  });

  it("should validate options schema", () => {
    const input = {
      codePoints: ["2764", "FE0F"],
      style: "emoji",
      comment: "heart symbol",
    };

    const invalidOptions = {
      separator: "|",
      commentPrefix: "#",
      version: "1.0",
    } as const;

    expect(() => variations({
      ...invalidOptions,
      // @ts-expect-error - testing invalid options
      separator: undefined,
      input: [input],
    })).toThrow("separator must be a string (was undefined)");
  });

  describe("presets", () => {
    describe("commonSymbols", () => {
      it("should generate common symbols variations", () => {
        const result = variations.commonSymbols(defaultOptions);

        expect(result).toEqual(
          "2764 FE0E ; text; # heart as text symbol\n"
          + "2764 FE0F ; emoji; # heart as emoji symbol\n"
          + "2B50 FE0E ; text; # star as text symbol\n"
          + "2B50 FE0F ; emoji; # star as emoji symbol\n"
          + "#EOF\n",
        );
      });
    });

    describe("punctuation", () => {
      it("should generate punctuation variations", () => {
        const result = variations.punctuation(defaultOptions);
        expect(result).toEqual(
          "2757 FE0E ; text; # exclamation mark as text\n"
          + "2757 FE0F ; emoji; # exclamation mark as emoji\n"
          + "2753 FE0E ; text; # question mark as text\n"
          + "2753 FE0F ; emoji; # question mark as emoji\n"
          + "#EOF\n",
        );
      });
    });

    describe("miscellaneous", () => {
      it("should generate miscellaneous variations", () => {
        const result = variations.miscellaneous(defaultOptions);

        expect(result).toEqual(
          "2600 FE0E ; text; # sun as text symbol\n"
          + "2600 FE0F ; emoji; # sun as emoji symbol\n"
          + "2695 FE0E ; text; # medical symbol as text\n"
          + "2695 FE0F ; emoji; # medical symbol as emoji\n"
          + "#EOF\n",
        );
      });
    });

    it("should work with custom options in presets", () => {
      const customOptions = {
        separator: ";",
        commentPrefix: "//",
        version: "1.0",
      };

      const result = variations.commonSymbols(customOptions);
      expect(result).toEqual(
        "2764 FE0E ; text; // heart as text symbol\n"
        + "2764 FE0F ; emoji; // heart as emoji symbol\n"
        + "2B50 FE0E ; text; // star as text symbol\n"
        + "2B50 FE0F ; emoji; // star as emoji symbol\n"
        + "#EOF\n",
      );
    });
  });
});
