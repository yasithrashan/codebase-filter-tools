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

const totalAstChars = JSON.stringify(codebaseAst).length;
logToFile("Total AST Characters", totalAstChars.toString());
console.log("Total AST characters:", totalAstChars);

// === User query ===
const userQuery: string = "Modify the authentication system to add optional email support in signup, track the current user in login/signout, and add a simple resetPassword function in auth.ts.";
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

(async () => {
  const response = await generateText({
    model: openai("gpt-4.1-mini"),
    tools: { queryAST },
    stopWhen: stepCountIs(15),
    prompt: `
You are a software engineer expert in reading, understanding, and modifying large codebases.

## Your Resources
1. **Project Summary (bal.md):**
This file contains the summary of the project codebase to help you understand structure, modules, and main logic. Use this to decide what files, functions, or services are relevant to the user query.
${balMdContent}

2. **Tool Available:** "QueryAST" — fetches specific AST nodes for given symbols.
3. **AST:** The project's AST is fully available to the tool.

## Task
- Understand the user query.
- Using bal.md, identify the relevant context such as files, functions, or services that need modification.
- Use the QueryAST tool to fetch AST context when needed.
- Modify the code accordingly to exactly fulfill the user request.
- Return only the corrected Ballerina code as the final output (no explanations, no questions).

## User Query
${userQuery}
    `,
  });

  // Log results
  logToFile("LLM Usage", JSON.stringify(response.usage, null, 2));
  logToFile("LLM Response", response.text);
  logToFile("Final Output", response.text);

  console.log("\n=== Final Output ===\n");
  console.log(response.text);
})();
