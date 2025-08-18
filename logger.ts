import * as fs from "fs";
import * as path from "path";

const folder = path.join(__dirname, "poc");
if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const logFile = path.join(folder, `logs-${timestamp}.txt`);

export function logToFile(section: string, content: string) {
    const entry = `\n\n=== ${section} ===\n${content}\n`;
    fs.appendFileSync(logFile, entry);
    console.log(`[LOGGED] ${section}`);
}
