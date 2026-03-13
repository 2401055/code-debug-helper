import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  codeSnippets,
  InsertCodeSnippet,
  userProgress,
  InsertUserProgress,
  analysisHistory,
  InsertAnalysisHistory,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({
        set: updateSet,
      });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Code Snippets ============

export async function createCodeSnippet(
  snippet: InsertCodeSnippet
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(codeSnippets).values(snippet);
}

export async function getCodeSnippetsByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(codeSnippets)
    .where(eq(codeSnippets.userId, userId))
    .orderBy(desc(codeSnippets.createdAt));
}

export async function deleteCodeSnippet(
  snippetId: number,
  userId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db
    .delete(codeSnippets)
    .where(
      and(eq(codeSnippets.id, snippetId), eq(codeSnippets.userId, userId))
    );
  return true;
}

// ============ User Progress ============

export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId));
}

export async function markProgressCompleted(
  userId: number,
  errorCategoryId: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already exists
  const existing = await db
    .select()
    .from(userProgress)
    .where(
      and(
        eq(userProgress.userId, userId),
        eq(userProgress.errorCategoryId, errorCategoryId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userProgress)
      .set({ completed: true, completedAt: new Date() })
      .where(eq(userProgress.id, existing[0].id));
  } else {
    await db.insert(userProgress).values({
      userId,
      errorCategoryId,
      completed: true,
      completedAt: new Date(),
    });
  }
}

// ============ Analysis History ============

export async function saveAnalysisHistory(
  entry: InsertAnalysisHistory
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(analysisHistory).values(entry);
}

export async function getAnalysisHistoryByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(analysisHistory)
    .where(eq(analysisHistory.userId, userId))
    .orderBy(desc(analysisHistory.createdAt))
    .limit(50);
}
