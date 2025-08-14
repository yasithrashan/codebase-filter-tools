import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from 'zod';
import * as fs from 'fs';


const readFiles = tool({
    name: 'ReadFiles',
    description: 'Reads the contents of a file and returns it as plain text.',
    inputSchema: z.object({
        fielPath: z.string().describe('Path to the file to read')
    }),
    execute: async ({ fielPath }) => {
        const fileContent = fs.readFileSync(fielPath, 'utf-8');
        return {
            fielPath,
            fileContent,
        };
    },
})

const { text } = await generateText({
    model: openai('gpt-4.1-mini'),
    tools: { readFiles },
    toolChoice: 'auto',
    prompt: `
        You have access to a tool that can read files from disk.
        Use it to read './bal.md' if needed, then answer:
        "What is this project about?"
    `
})

console.log(text);


