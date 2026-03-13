/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export * from "./_core/errors";

// Static project - no database types
export type User = {
  id: string;
  name: string;
  email: string;
};
