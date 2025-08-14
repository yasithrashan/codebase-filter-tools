File: weather-tool.ts
---------------------
Module: Weather CLI Tool
Imports:
  - zod (z)
  - ai-sdk ("generateText", "tool", "stepCountIs")
  - @ai-sdk/google (google)

Environment Variables:
  - OPENWEATHER_API_KEY: string

Tool Definitions:
  - tool name: "weather"
    description: "Get the real weather in a location using OpenWeather API"
    inputSchema:
      object:
        location: string
    execute(location):
      1. geo = getGeoLocation(location)
      2. if geo exists:
           weatherData = getWeather(geo.lat, geo.lon)
      3. return weatherData

Function Definitions:
  - getGeoLocation(location: string) → Promise<{ name: string, lat: number, lon: number }>
      - Call OpenWeather Geocoding API
      - Parse JSON array
      - If empty → throw error
      - Return first element { name, lat, lon }

  - getWeather(lat: number, lon: number) → Promise<object>
      - Call OpenWeather Current Weather API
      - Units: metric
      - Parse and return JSON response

CLI Argument Handling:
  - locationArg = process.argv[2]
  - If missing → print usage and exit

Main Execution:
  - Call generateText():
      model: google("gemini-2.0-flash")
      tools: { weather }
      stopWhen: stepCountIs(5)
      prompt: "Use the weather tool to tell me the weather in ${locationArg}."
  - Print weatherResult.text


File: tree-sitter.ts
--------------------
Module: JavaScript Parser CLI
Imports:
  - tree-sitter (Parser)
  - tree-sitter-javascript (JavaScript)
  - https
  - fetch (global)

Variable Definitions:
  - parser = new Parser()
      - setLanguage(JavaScript)

Function Definitions:
  - fetchData(url: string) → Promise<string>
      - Fetch the URL
      - If response not ok → throw error
      - Return response text

  - printTree(node, indent = 0)
      - Print node type and first 50 chars of text
      - Recursively print child nodes with increased indent

Main Execution:
  - url = process.argv[2]
  - If missing → print error
  - Try:
      - sourceCode = fetchData(url)
      - tree = parser.parse(sourceCode)
      - printTree(tree.rootNode)
  - Catch errors → print error
