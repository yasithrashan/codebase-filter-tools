import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import * as fs from "fs";

const balMdContent = fs.readFileSync("./bal.md", "utf8");
if (!balMdContent.length) {
  console.error("Error: bal.md is empty or missing");
  process.exit(1);
}

const codebaseAst = JSON.parse(fs.readFileSync("./ast.json", "utf8"));

const userQuery: string = "can you add two more users to the database?";

const queryAST = tool({
  name: "QueryAST",
  description:
    "Retrieve code snippets from the AST. Use this when you need specific functions, types, or exports instead of entire files.",
  inputSchema: z.object({
    symbols: z
      .array(z.string())
      .describe('List of function/type names to fetch, e.g., ["login", "User"]'),
  }),
  execute: async ({ symbols }) => {
    console.log(`QueryAST tool called. Requested symbols: ${symbols.join(", ")}`);

    const results: any[] = [];

    function searchAst(node: any, parentFile: string) {
      if (node.name && symbols.includes(node.name)) {
        results.push({
          symbol: node.name,
          file: parentFile,
          node,
        });
      }
      if (node.exports)
        node.exports.forEach((child: any) =>
          searchAst(child, node.fileName || parentFile)
        );
      if (node.statements)
        node.statements.forEach((child: any) =>
          searchAst(child, node.fileName || parentFile)
        );
    }

    codebaseAst.codebase.files.forEach((file: any) => {
      searchAst(file.ast, file.fileName);
    });

    return results.length
      ? results
      : `No symbols found for ${symbols.join(", ")}`;
  },
});

(async () => {
  const { text } = await generateText({
    model: openai("gpt-4.1-mini"),
    tools: { queryAST },
    stopWhen: stepCountIs(4),
    prompt: `
You are an expert software engineer specializing in reading and understanding large codebases.

## Your Resources
1. **Project Summary (bal.md):**
${balMdContent}

2. **Tool Available:** "QueryAST" — lets you fetch only specific functions, types, or exports from the AST.
   - For example, request ["login"] to get the login function AST.

3. **AST:** The full AST of the project is available to the QueryAST tool.

## Task
Given the project summary and the user's query:

### Step 1 — Understand the Query
Read the user query carefully and determine which part of the codebase it refers to.

### Step 2 — Plan
From the 'bal.md' summary, decide which functions or types are most relevant.
Select **only the minimal set of symbols** needed.

### Step 3 — Retrieve Content
Use the **QueryAST** tool to load the full AST nodes of those symbols.

### Step 4 — Answer
Once you have the AST nodes, update or modify the code as required by the user query.
Return the updated code in your final answer.

---

## User Query
${userQuery}
    `,
  });

  console.log("\n=== LLM Response ===\n");
  console.log(text);
})();
