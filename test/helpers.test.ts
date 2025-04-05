import { describe, expect, expectTypeOf, it } from "vitest";
import { weave } from "../src/helpers";

interface TestUser {
  name: string;
  age: number;
  role: "admin" | "user";
}

describe("weave", () => {
  const testUser: TestUser = {
    name: "John Doe",
    age: 30,
    role: "admin",
  };

  const testUsers: TestUser[] = [
    { name: "John Doe", age: 30, role: "admin" },
    { name: "Jane Smith", age: 25, role: "user" },
  ];

  it("should handle single object input", () => {
    const result = weave(testUser, { amount: 2 });

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(testUser);
    expect(result[1]).toEqual(testUser);
    expect(result[2]).toEqual(testUser);
  });

  it("should handle array input", () => {
    const result = weave(testUsers, { amount: 2 });

    expect(result).toHaveLength(4);
    expect(result.slice(0, 2)).toEqual(testUsers);
  });

  it("should randomize fields when provided", () => {
    const names = ["Alice", "Bob", "Charlie"];
    const ages = [20, 25, 30];
    const roles: ("admin" | "user")[] = ["admin", "user"];

    const result = weave(testUser, {
      amount: 5,
      fields: {
        name: names,
        age: ages,
        role: roles,
      },
    });

    expect(result).toHaveLength(6);
    expect(result[0]).toEqual(testUser);

    result.slice(1).forEach((item) => {
      expect(names).toContain(item.name);
      expect(ages).toContain(item.age);
      expect(roles).toContain(item.role);
    });
  });

  it("should apply customizer function", () => {
    const result = weave(testUser, {
      amount: 2,
      customizer: (item, index) => ({
        ...item,
        name: `${item.name} ${index + 1}`,
      }),
    });

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(testUser);
    expect(result[1]!.name).toBe("John Doe 1");
    expect(result[2]!.name).toBe("John Doe 2");
  });

  it("should combine fields and customizer", () => {
    const names = ["Alice", "Bob"];
    const result = weave(testUser, {
      amount: 2,
      fields: { name: names },
      customizer: (item, index) => ({
        ...item,
        age: item.age + index,
      }),
    });

    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(testUser);
    expect(names).toContain(result[1]!.name);
    expect(names).toContain(result[2]!.name);
    expect(result[1]!.age).toBe(testUser.age + 0);
    expect(result[2]!.age).toBe(testUser.age + 1);
  });

  it("should throw error for empty input", () => {
    expect(() => weave([])).toThrow("input must be a non-empty array of objects or a valid object");
  });

  it("should throw error for invalid amount", () => {
    expect(() => weave(testUser, { amount: 0 })).toThrow("amount must be a positive number");
    expect(() => weave(testUser, { amount: -1 })).toThrow("amount must be a positive number");
  });

  it("should maintain type safety", () => {
    const result = weave(testUser, { amount: 1 });

    expectTypeOf(result).toBeArray();
    expectTypeOf(result[0]!).toEqualTypeOf<TestUser>();

    result.forEach((item) => {
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("age");
      expect(item).toHaveProperty("role");
    });
  });
});
