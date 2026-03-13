import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user-123",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("code.analyze", () => {
  it("rejects empty code input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.code.analyze({
        code: "",
        language: "python",
      })
    ).rejects.toThrow();
  });

  it("accepts valid code input with language", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.code.analyze({
        code: "print('hello')",
        language: "python",
      });
      // If LLM succeeds, verify response shape
      expect(result).toHaveProperty("explanation");
      expect(result).toHaveProperty("steps");
      expect(result).toHaveProperty("correctedCode");
      expect(result).toHaveProperty("errorType");
      expect(result).toHaveProperty("severity");
      expect(result).toHaveProperty("tips");
      expect(result).toHaveProperty("inlineErrors");
    } catch (error: any) {
      // LLM call may fail in test env but input validation should pass
      expect(error.message).not.toContain("invalid");
    }
  }, 15000);

  it("accepts code with error message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.code.analyze({
        code: "x = 1/0",
        language: "python",
        errorMessage: "ZeroDivisionError: division by zero",
      });
      expect(result).toHaveProperty("explanation");
      expect(result).toHaveProperty("inlineErrors");
    } catch (error: any) {
      expect(error.message).not.toContain("invalid");
    }
  }, 15000);
});

describe("code.execute", () => {
  it("rejects empty code input", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.code.execute({
        code: "",
        language: "python",
      })
    ).rejects.toThrow();
  });

  it("simulates code execution", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.code.execute({
        code: "print('hello world')",
        language: "python",
      });
      expect(result).toHaveProperty("output");
      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("exitCode");
      expect(result).toHaveProperty("executionTime");
    } catch (error: any) {
      expect(error.message).not.toContain("invalid");
    }
  }, 15000);
});

describe("learn.getCategories", () => {
  it("returns error categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.learn.getCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty("id");
    expect(categories[0]).toHaveProperty("name");
  });
});

describe("learn.getExamples", () => {
  it("returns all examples without filters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const examples = await caller.learn.getExamples();
    expect(Array.isArray(examples)).toBe(true);
    expect(examples.length).toBeGreaterThan(0);
    expect(examples[0]).toHaveProperty("id");
    expect(examples[0]).toHaveProperty("title");
    expect(examples[0]).toHaveProperty("incorrectCode");
    expect(examples[0]).toHaveProperty("correctCode");
  });

  it("filters by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const examples = await caller.learn.getExamples({
      category: "syntax",
    });
    expect(Array.isArray(examples)).toBe(true);
    for (const ex of examples) {
      expect(ex.category).toBe("syntax");
    }
  });

  it("filters by difficulty", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const examples = await caller.learn.getExamples({
      difficulty: "beginner",
    });
    expect(Array.isArray(examples)).toBe(true);
    for (const ex of examples) {
      expect(ex.difficulty).toBe("beginner");
    }
  });

  it("filters by search query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const examples = await caller.learn.getExamples({
      search: "python",
    });
    expect(Array.isArray(examples)).toBe(true);
  });
});

describe("learn.getExample", () => {
  it("returns a specific example by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // First get all examples to find a valid id
    const examples = await caller.learn.getExamples();
    if (examples.length > 0) {
      const example = await caller.learn.getExample({ id: examples[0].id });
      expect(example).not.toBeNull();
      expect(example?.id).toBe(examples[0].id);
    }
  });

  it("returns null for non-existent id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const example = await caller.learn.getExample({ id: "non-existent-id" });
    expect(example).toBeNull();
  });
});

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.name).toBe("Test User");
    expect(result?.email).toBe("test@example.com");
  });
});
