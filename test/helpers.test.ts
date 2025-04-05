import type { EnsureValidWeaveInput } from "../src/helpers";
import { assertType, describe, expect, expectTypeOf, it } from "vitest";

describe("ensure weave input is valid", () => {
  it("should accept valid array of objects", () => {
    const input = [
      { name: "John", age: 30 },
      { name: "Jane", age: 25 },
    ];

    const result = input as EnsureValidWeaveInput<typeof input>;
    expectTypeOf(result).toEqualTypeOf<typeof input>();
  });

  it("should accept single object", () => {
    const input = { name: "John", age: 30 };
    const result = input as EnsureValidWeaveInput<typeof input>;
    expectTypeOf(result).toEqualTypeOf<typeof input>();
  });

  it("should reject array of primitives", () => {
    const input = ["string", "array"];

    // @ts-expect-error - array of primitives should be rejected
    const result: EnsureValidWeaveInput<typeof input> = input;

    expectTypeOf(result).toBeNever();
  });

  it("should reject array of arrays", () => {
    const input = [[1, 2], [3, 4]];

    // @ts-expect-error - array of arrays should be rejected
    const result: EnsureValidWeaveInput<typeof input> = input;

    expectTypeOf(result).toBeNever();
  });

  it("should reject primitive types", () => {
    const input = "string";

    // @ts-expect-error - primitive type should be rejected
    const result: EnsureValidWeaveInput<typeof input> = input;

    expectTypeOf(result).toBeNever();
  });

  it("should reject null and undefined", () => {
    const input = null;
    // @ts-expect-error - Null should be rejected
    const result: EnsureValidWeaveInput<typeof input> = input;

    expectTypeOf(result).toBeNever();
  });

  it("should accept array of complex objects", () => {
    const input = [
      {
        name: "John",
        age: 30,
        address: { street: "123 Main St", city: "New York" },
        hobbies: ["reading", "gaming"],
      },
      {
        name: "Jane",
        age: 25,
        address: { street: "456 Oak Ave", city: "Boston" },
        hobbies: ["painting", "music"],
      },
    ];

    const result = input as EnsureValidWeaveInput<typeof input>;
    expectTypeOf(result).toEqualTypeOf<typeof input>();
  });

  it("should accept array of objects with optional properties", () => {
    const input = [
      { name: "John", age: 30, email: "john@example.com" },
      { name: "Jane", age: 25, email: undefined },
    ];

    const result = input as EnsureValidWeaveInput<typeof input>;
    expectTypeOf(result).toEqualTypeOf<typeof input>();
  });
});
