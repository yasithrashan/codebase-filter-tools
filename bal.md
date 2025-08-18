# Simple Summary of the Codebase

## auth.ts

**imports**
- none

**types**
- User: {username: string, password: string, email?: string}

**functions**
- validateUsername
  - doc comments: Validates if username meets minimum requirements
  - parameters: username: string
  - return: boolean
- validatePassword
  - doc comments: Checks if password meets security criteria
  - parameters: password: string
  - return: boolean
- validateEmail
  - doc comments: Checks if email is in valid format
  - parameters: email: string
  - return: boolean
- resetPassword
  - doc comments: Resets user's password after validation
  - parameters: user: User, newPassword: string
  - return: string

## login.ts

**imports**
- User, validateUsername, validatePassword from ./auth

**types**
- no types

**variables**
- currentUser: string | null

**functions**
- login
  - doc comments: Authenticates user with username and password against mock database
  - parameters: username: string, password: string
  - return: string
- getCurrentUser
  - doc comments: Returns the currently logged in user
  - parameters: none
  - return: string | null
- setCurrentUser
  - doc comments: Sets or clears the current user
  - parameters: username: string | null
  - return: void

## signout.ts

**imports**
- getCurrentUser, setCurrentUser from ./login

**types**
- no types

**functions**
- signout
  - doc comments: Signs out current user and clears session
  - parameters: none
  - return: string

## signup.ts

**imports**
- User, validateUsername, validatePassword, validateEmail from ./auth

**types**
- no types

**functions**
- signup
  - doc comments: Creates new user account after validating credentials; supports optional email
  - parameters: username: string, password: string, email?: string
  - return: User | string
