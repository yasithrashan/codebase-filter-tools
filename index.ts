import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool } from "ai";
import { z } from 'zod';
import * as fs from 'fs';


const readFiles = tool({
    name: 'ReadFiles',
    description: 'Reads the contents of a file and returns it as plain text.',
    inputSchema: z.object({
        filePath: z.string().describe('Path to the file to read')
    }),
    execute: async ({ filePath }) => {
        console.log('Calling the tool')
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        console.log(fileContent);
        return {
            filePath,
            fileContent,
        };
    },
})

const { text } = await generateText({
    model: openai('gpt-4.1-mini'),
    tools: { readFiles },
    stopWhen: stepCountIs(4),
    prompt: `
        You have access to a tool that can read files from disk.
        Use it to read './bal.md' if needed, then answer:
        "I want to add new tool calling"
    `
})
console.log(text);


