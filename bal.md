Program
├── SourceFile: "auth.ts"
│   ├── ExportDeclaration
│   │   └── TypeAliasDeclaration: "User"
│   │       └── TypeLiteral
│   │           ├── PropertySignature: "username" → StringKeyword
│   │           └── PropertySignature: "password" → StringKeyword
│   ├── ExportDeclaration
│   │   └── FunctionDeclaration: "validateUsername"
│   │       ├── Parameter: "username" → StringKeyword
│   │       ├── ReturnType: BooleanKeyword
│   │       └── Block
│   │           └── ReturnStatement
│   │               └── BinaryExpression (&&)
│   └── ExportDeclaration
│       └── FunctionDeclaration: "validatePassword"
│           ├── Parameter: "password" → StringKeyword
│           ├── ReturnType: BooleanKeyword
│           └── Block
│               └── ReturnStatement
│                   └── BinaryExpression (&&)
│
├── SourceFile: "login.ts"
│   ├── ImportDeclaration
│   │   └── ImportClause
│   │       └── NamedImports: "User" (type-only) from "./auth"
│   ├── ExportDeclaration
│   │   └── FunctionDeclaration: "login"
│   │       ├── Parameter: "username" → StringKeyword
│   │       ├── Parameter: "password" → StringKeyword
│   │       ├── ReturnType: StringKeyword
│   │       └── Block
│   │           ├── VariableStatement: "mockUsers"
│   │           │   └── ArrayLiteralExpression
│   │           ├── VariableStatement: "user"
│   │           ├── IfStatement (user not found)
│   │           ├── IfStatement (password mismatch)
│   │           └── ReturnStatement
│   ├── CallExpression: console.log
│   │   └── CallExpression: login("alice", "password123")
│   └── CallExpression: console.log
│       └── CallExpression: login("bob", "wrongpass")
│
├── SourceFile: "signout.ts"
│   ├── ExportDeclaration
│   │   └── FunctionDeclaration: "signout"
│   │       ├── Parameter: "currentUser" (optional) → StringKeyword
│   │       ├── ReturnType: StringKeyword
│   │       └── Block
│   │           ├── IfStatement (!currentUser)
│   │           └── ReturnStatement
│   ├── CallExpression: console.log
│   │   └── CallExpression: signout("alice")
│   └── CallExpression: console.log
│       └── CallExpression: signout()
│
└── SourceFile: "signup.ts" (inline)
    ├── ImportDeclaration
    │   └── ImportClause
    │       └── NamedImports: "User" (type-only) from "./auth"
    ├── ImportDeclaration
    │   └── ImportClause
    │       └── NamedImports: "validateUsername", "validatePassword" from "./auth"
    └── ExportDeclaration
        └── FunctionDeclaration: "signup"
            ├── Parameter: "username" → StringKeyword
            ├── Parameter: "password" → StringKeyword
            ├── ReturnType: StringKeyword
            └── Block
                ├── IfStatement (username validation)
                ├── IfStatement (password validation)
                ├── VariableStatement: "newUser"
                │   └── ObjectLiteralExpression
                └── ReturnStatement