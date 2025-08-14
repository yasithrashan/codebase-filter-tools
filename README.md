# AI Codebase Analyzer

An intelligent tool that leverages AI to understand, analyze, and modify large codebases by reading project summaries and selectively loading relevant files.

## Features

- **Smart File Reading**: Automatically identifies and reads only the most relevant files for a given query
- **Project Summary Integration**: Uses a `bal.md` file containing project structure and file descriptions
- **AI-Powered Analysis**: Employs OpenAI's GPT-4 to understand code context and make intelligent modifications
- **Step-Limited Processing**: Prevents infinite loops with configurable step limits
- **Minimal File Loading**: Optimizes performance by reading only necessary files

## Prerequisites

- Bun (v1.0 or higher)
- OpenAI API key
- TypeScript support

## Installation

```bash
# Clone the repository
git clone https://github.com/yasithrashan/codebase-filter-tools
cd codebase-filter-tools

# Install dependencies
bun install
```

## Configuration

1. **Set up your OpenAI API key**:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

2. **Create a project summary file** (`bal.md`):
   This file should contain your project structure and descriptions. Based on your current setup:

   ```markdown
   # Project Structure

   ## Main Application
   - `index.ts` - Main analyzer entry point and core functionality

   ## Test Files
   - `auth.ts` - Authentication system tests
   - `login.ts` - User login functionality tests
   - `signout.ts` - User sign out process tests
   - `signup.ts` - User registration tests

   ## Configuration
   - `tsconfig.json` - TypeScript configuration
   - `package.json` - Project dependencies and scripts
   - `bun.lock` - Bun dependency lock file
   ```

## Usage

### Basic Usage

```typescript
// Main analyzer code in index.ts
import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool } from "ai";
import { z } from 'zod';
import * as fs from 'fs';

// Implementation as shown in index.ts
```

### Testing

The project includes several test files to validate functionality:
- `auth.ts` - Authentication testing
- `login.ts` - Login functionality tests
- `signout.ts` - Sign out process tests
- `signup.ts` - User registration tests

### Running the Analyzer

```bash
# Run the main analyzer
bun run index.ts

# Or use the shorthand
bun run .
```

### Example Queries

The tool can handle various types of queries:

- **Code Modifications**: "Add two more users to the database"
- **Feature Additions**: "Create a new API endpoint for user authentication"
- **Bug Fixes**: "Fix the database connection timeout issue"
- **Code Analysis**: "Explain how the routing system works"

## How It Works

1. **Query Analysis**: The AI first understands what the user is asking for
2. **File Selection**: Based on the `bal.md` summary, it identifies relevant files
3. **Selective Reading**: Only loads the minimal set of files needed
4. **Code Generation**: Provides updated or new code based on the query
5. **Step Limiting**: Prevents infinite processing with configurable step limits

## Configuration Options

### Step Count Limiting

```typescript
stopWhen: stepCountIs(4)  // Adjust based on query complexity
```

### Model Selection

```typescript
model: openai('gpt-4.1-mini')  // or 'gpt-4', 'gpt-3.5-turbo'
```

### File Reading Tool

The `ReadFiles` tool accepts:
- Single file name: `"database.ts"`
- Multiple files: `["database.ts", "routes/users.ts"]`

## Error Handling

The tool includes basic error handling for:
- Missing `bal.md` file
- Invalid file paths
- OpenAI API errors
- File reading permissions

## Best Practices

1. **Keep `bal.md` Updated**: Regularly update your project summary as files change
2. **Use Descriptive Queries**: Be specific about what you want to achieve
3. **Monitor Step Counts**: Adjust step limits based on query complexity
4. **Optimize File Selection**: Only include relevant files in your project summary
5. **Leverage Bun's Speed**: Take advantage of Bun's fast startup times for rapid iteration

## Contributing

1. Fork the repository
2. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.