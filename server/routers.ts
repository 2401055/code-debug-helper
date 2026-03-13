import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import { errorCategories, errorExamples } from "@shared/errorLibrary";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  code: router({
    // AI-powered code analysis - stateless, no DB needed
    analyze: publicProcedure
      .input(
        z.object({
          code: z.string().min(1).max(50000),
          language: z.string().min(1),
          errorMessage: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { code, language, errorMessage } = input;

        const systemPrompt = `You are an expert programming tutor and debugging assistant. Your role is to help beginner programmers understand and fix coding errors.

When analyzing code, you MUST respond with valid JSON matching this exact structure:
{
  "explanation": "A clear, beginner-friendly explanation of what went wrong and why",
  "steps": ["Step 1: description", "Step 2: description", ...],
  "correctedCode": "The full corrected version of the code",
  "errorType": "The category of error (e.g., SyntaxError, TypeError, LogicError, RuntimeError)",
  "severity": "error or warning or info",
  "tips": ["Tip 1", "Tip 2", ...],
  "inlineErrors": [{"line": 1, "message": "short error description"}, ...]
}

Guidelines:
- Explain errors in simple, beginner-friendly language
- Avoid jargon unless you explain it
- Provide step-by-step instructions to fix the issue
- Include the complete corrected code, not just the changed lines
- Give practical tips to avoid similar errors in the future
- If no error is found, explain what the code does and suggest improvements
- Keep explanations concise but thorough
- In inlineErrors, include the line number and a short description for each error found`;

        const userPrompt = `Please analyze this ${language} code${errorMessage ? ` which produces the following error: "${errorMessage}"` : ""}:

\`\`\`${language}
${code}
\`\`\`

${errorMessage ? `Error message: ${errorMessage}` : "Analyze this code for potential errors, bugs, or improvements."}

Respond with JSON only.`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "code_analysis",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    explanation: {
                      type: "string",
                      description: "Clear explanation of the error",
                    },
                    steps: {
                      type: "array",
                      items: { type: "string" },
                      description: "Step-by-step fix instructions",
                    },
                    correctedCode: {
                      type: "string",
                      description: "The corrected code",
                    },
                    errorType: {
                      type: "string",
                      description: "Category of the error",
                    },
                    severity: {
                      type: "string",
                      description: "error, warning, or info",
                    },
                    tips: {
                      type: "array",
                      items: { type: "string" },
                      description: "Tips to avoid similar errors",
                    },
                    inlineErrors: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          line: { type: "number", description: "Line number" },
                          message: {
                            type: "string",
                            description: "Short error description",
                          },
                        },
                        required: ["line", "message"],
                        additionalProperties: false,
                      },
                      description: "Inline error markers for the editor",
                    },
                  },
                  required: [
                    "explanation",
                    "steps",
                    "correctedCode",
                    "errorType",
                    "severity",
                    "tips",
                    "inlineErrors",
                  ],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0]?.message?.content;
          if (!content || typeof content !== "string") {
            throw new Error("No response from AI");
          }

          return JSON.parse(content);
        } catch (error: any) {
          console.error("LLM analysis failed:", error);
          throw new Error(
            "Failed to analyze code. Please try again."
          );
        }
      }),

    // Execute code via AI simulation - stateless
    execute: publicProcedure
      .input(
        z.object({
          code: z.string().min(1).max(50000),
          language: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const { code, language } = input;

        const systemPrompt = `You are a code execution simulator. Given code in any programming language, simulate its execution and provide the expected output.

You MUST respond with valid JSON matching this exact structure:
{
  "output": "The standard output of the program",
  "error": "Any error message if the code fails, or empty string if successful",
  "exitCode": 0,
  "executionTime": "estimated time in ms"
}

Rules:
- Simulate the code execution as accurately as possible
- If the code has errors, show the error message that would appear
- If the code runs successfully, show the exact output
- For interactive programs, simulate with reasonable default inputs
- Keep the output realistic and accurate
- exitCode should be 0 for success, 1 for errors`;

        const userPrompt = `Simulate the execution of this ${language} code and provide the output:

\`\`\`${language}
${code}
\`\`\`

Respond with JSON only.`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "code_execution",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    output: {
                      type: "string",
                      description: "Standard output of the program",
                    },
                    error: {
                      type: "string",
                      description: "Error message if any",
                    },
                    exitCode: {
                      type: "number",
                      description: "0 for success, 1 for error",
                    },
                    executionTime: {
                      type: "string",
                      description: "Estimated execution time",
                    },
                  },
                  required: ["output", "error", "exitCode", "executionTime"],
                  additionalProperties: false,
                },
              },
            },
          });

          const content = response.choices[0]?.message?.content;
          if (!content || typeof content !== "string") {
            throw new Error("No response from AI");
          }

          return JSON.parse(content);
        } catch (error: any) {
          console.error("Code execution simulation failed:", error);
          throw new Error("Failed to execute code. Please try again.");
        }
      }),
  }),

  // Error library - served from static data, no DB needed
  learn: router({
    getCategories: publicProcedure.query(() => {
      return errorCategories;
    }),

    getExamples: publicProcedure
      .input(
        z
          .object({
            category: z.string().optional(),
            difficulty: z.string().optional(),
            search: z.string().optional(),
          })
          .optional()
      )
      .query(({ input }) => {
        let filtered = errorExamples;

        if (input?.category && input.category !== "all") {
          filtered = filtered.filter((e) => e.category === input.category);
        }
        if (input?.difficulty && input.difficulty !== "all") {
          filtered = filtered.filter((e) => e.difficulty === input.difficulty);
        }
        if (input?.search) {
          const q = input.search.toLowerCase();
          filtered = filtered.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              e.description.toLowerCase().includes(q) ||
              e.language.toLowerCase().includes(q)
          );
        }

        return filtered;
      }),

    getExample: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => {
        return errorExamples.find((e) => e.id === input.id) || null;
      }),
  }),
});

export type AppRouter = typeof appRouter;
