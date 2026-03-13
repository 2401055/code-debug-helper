import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Saved code snippets for authenticated users.
 */
export const codeSnippets = mysqlTable("code_snippets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  language: varchar("language", { length: 64 }).notNull(),
  code: text("code").notNull(),
  errorMessage: text("errorMessage"),
  aiAnalysis: text("aiAnalysis"),
  isFixed: boolean("isFixed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CodeSnippet = typeof codeSnippets.$inferSelect;
export type InsertCodeSnippet = typeof codeSnippets.$inferInsert;

/**
 * User learning progress tracking.
 */
export const userProgress = mysqlTable("user_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  errorCategoryId: varchar("errorCategoryId", { length: 128 }).notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * Analysis history for tracking user debugging sessions.
 */
export const analysisHistory = mysqlTable("analysis_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  language: varchar("language", { length: 64 }).notNull(),
  code: text("code").notNull(),
  errorMessage: text("errorMessage"),
  analysis: text("analysis").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalysisHistory = typeof analysisHistory.$inferSelect;
export type InsertAnalysisHistory = typeof analysisHistory.$inferInsert;
