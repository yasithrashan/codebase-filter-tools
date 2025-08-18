import * as fs from "fs";

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logFile = `logs-${timestamp}.txt`;

export function logToFile(section: string, content: string) {
    const entry = `\n\n=== ${section} ===\n${content}\n`;
    fs.appendFileSync(logFile, entry);
    console.log(`[LOGGED] ${section}`);
}
