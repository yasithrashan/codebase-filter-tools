import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool } from "ai";
import { z } from "zod";
import * as fs from "fs";
import { logToFile } from "./logger";

// Load project files
const balMdContent = fs.readFileSync("./bal.md", "utf8");
if (!balMdContent.length) {
  console.error("Error: bal.md is empty or missing");
  process.exit(1);
}

const codebaseAst = JSON.parse(fs.readFileSync("./ast.json", "utf8"));

// === User query ===
const userQuery: string = "can you add two more users to the database?";
logToFile("User Query", userQuery);

// === Tool: QueryAST ===
const queryAST = tool({
  name: "QueryAST",
  description: "Retrieve AST nodes for specific functions, types, or exports.",
  inputSchema: z.object({
    symbols: z
      .array(z.string())
      .describe('List of function/type names to fetch, e.g., ["login", "User"]'),
  }),
  execute: async ({ symbols }) => {
    const results: any[] = [];

    function searchAst(node: any, parentFile: string) {
      if (node.name && symbols.includes(node.name)) {
        results.push({ symbol: node.name, file: parentFile, node });
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

    codebaseAst.codebase.files.forEach((file: any) =>
      searchAst(file.ast, file.fileName)
    );

    const toolResponse = results.length
      ? results
      : `No symbols found for ${symbols.join(", ")}`;

    logToFile("Tool Response", JSON.stringify(toolResponse, null, 2));
    return toolResponse;
  },
});

// === Main run ===
(async () => {
  const response = await generateText({
    model: openai("gpt-4.1-mini"),
    tools: { queryAST },
    stopWhen: stepCountIs(4),
    prompt: `
You are an expert software engineer specializing in reading and understanding large codebases.

## Your Resources
1. **Project Summary (bal.md):**
${balMdContent}

2. **Tool Available:** "QueryAST" — fetches specific AST nodes.
3. **AST:** The project's AST is available to the tool.

## Task
Follow these steps:
- Understand user query
- Decide relevant symbols
- Call QueryAST tool
- Modify code if needed
- Return updated code

User Query: ${userQuery}
    `,
  });

  // Log results
  logToFile("LLM Usage", JSON.stringify(response.usage, null, 2));
  logToFile("LLM Response", response.text);
  logToFile("Final Output", response.text);

  console.log("\n=== Final Output ===\n");
  console.log(response.text);
})();
