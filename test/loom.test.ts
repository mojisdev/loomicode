import { expect, it } from "vitest";
import { z } from "zod";
import { createLoom } from "../src/loom";

const testInputSchema = z.object({
  name: z.string(),
  value: z.number(),
});

const testOptionsSchema = z.object({
  version: z.string(),
  prefix: z.string(),
});

it("should create a loom instance that processes input correctly", () => {
  const loom = createLoom({
    inputSchema: testInputSchema,
    optionsSchema: testOptionsSchema,
    template: (ctx, item) => `${ctx.options.prefix} ${item.name}: ${item.value}`,
  });

  const result = loom({
    version: "1.0.0",
    prefix: "Test",
    input: [
      { name: "item1", value: 42 },
      { name: "item2", value: 123 },
    ],
  });

  expect(result).toBe("Test item1: 42\nTest item2: 123");
});

it("should skip items when predicate returns false", () => {
  const loom = createLoom({
    inputSchema: testInputSchema,
    optionsSchema: testOptionsSchema,
    template: (ctx, item) => `${item.name}: ${item.value}`,
    predicate: (ctx, item) => item.value > 50,
  });

  const result = loom({
    version: "1.0.0",
    prefix: "Test",
    input: [
      { name: "item1", value: 42 },
      { name: "item2", value: 123 },
      { name: "item3", value: 30 },
    ],
  });

  expect(result).toBe("item2: 123");
});

it("should validate input against schema", () => {
  const loom = createLoom({
    inputSchema: testInputSchema,
    optionsSchema: testOptionsSchema,
    template: (ctx, item) => `${item.name}: ${item.value}`,
  });

  expect(() =>
    loom({
      version: "1.0.0",
      prefix: "Test",
      input: [
        // @ts-expect-error wrong type
        { name: "item1", value: "" },
      ],
    }),
  ).toThrow();
});

it("should validate options against schema", () => {
  const loom = createLoom({
    inputSchema: testInputSchema,
    optionsSchema: testOptionsSchema,
    template: (ctx, item) => `${item.name}: ${item.value}`,
  });

  expect(() =>
    loom({
      // missing required 'version' field
      prefix: "Test",
      input: [{ name: "item1", value: 42 }],
    } as any),
  ).toThrow();
});

it("should provide correct version comparison helpers", () => {
  const loom = createLoom({
    inputSchema: testInputSchema,
    optionsSchema: testOptionsSchema,
    template: (ctx, item) => {
      const versionChecks = [
        ctx.isVersionLessThan("1.1.0"),
        ctx.isVersionGreaterThan("0.9.0"),
        ctx.isVersionEqual("1.0.0"),
        ctx.isVersionGreaterThanOrEqual("1.0.0"),
        ctx.isVersionLessThanOrEqual("1.0.0"),
      ];
      return `${item.name}: ${versionChecks.join(", ")}`;
    },
  });

  const result = loom({
    version: "1.0.0",
    prefix: "Test",
    input: [{ name: "test", value: 42 }],
  });

  expect(result).toBe("test: true, true, true, true, true");
});

it("should handle empty input array", () => {
  const loom = createLoom({
    inputSchema: testInputSchema,
    optionsSchema: testOptionsSchema,
    template: (ctx, item) => `${item.name}: ${item.value}`,
  });

  const result = loom({
    version: "1.0.0",
    prefix: "Test",
    input: [],
  });

  expect(result).toBe("");
});
