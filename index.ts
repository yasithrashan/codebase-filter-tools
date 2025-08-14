import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool } from "ai";
import { z } from 'zod';
import * as fs from 'fs';

const balMdContent = fs.readFileSync('./bal.md', 'utf8');
if (!balMdContent.length) {
    console.log('There is and error for get content of the bal.md content')
}

const userQuery: string = 'can you add two more uses to the database?';

const readFiles = tool({
    name: 'ReadFiles',
    description: 'Reads the contents of files and returns them as plain text.',
    inputSchema: z.object({
        fileNames: z.union([
            z.string(),
            z.array(z.string())
        ]).describe('One or more file names to read')
    }),
    execute: async ({ fileNames }) => {
        const files = Array.isArray(fileNames) ? fileNames : [fileNames];
        console.log(`ReadFiles tool called. Requested files: ${files.join(', ')}`);

        const results = files.map(fileName => {
            const fileContent = fs.readFileSync(fileName, 'utf-8');
            console.log(`Successfully read: ${fileName}`);
            return { fileName, fileContent };
        });
        return results;
    },
});


const { text } = await generateText({
    model: openai('gpt-4.1-mini'),
    tools: { readFiles },
    stopWhen: stepCountIs(4),
    prompt: `
You are an expert software engineer specializing in reading and understanding large codebases.

## Your Resources
1. **Project Summary:** Provided below from 'bal.md'. This contains the list of files, their paths, imported modules/packages, type definitions, function names, signatures, and summaries, along with a brief description of their content.
2. **Tool Available:** "ReadFiles" — lets you read the full content of any files from disk.

## Your Task
Given the project summary and the user's query, follow these steps:

### Step 1 — Understand the Query
Read the user query carefully and determine which part of the codebase it refers to.

### Step 2 — Plan
From the 'bal.md' summary, decide which files are most relevant for answering the query.
Select **only the minimal set of files** required for the task.

### Step 3 — Retrieve Content
Use the **ReadFiles** tool to load the full content of the selected files.
Pass **the exact file paths** as arguments.

### Step 4 — Answer
Once you have the file contents, update or modify the code as required by the user query.
Provide the updated code in your final answer.

---

## Project Summary (bal.md)
${balMdContent}

---

## User Query
${userQuery}
    `
});

console.log(text);
