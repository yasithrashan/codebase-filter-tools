Module: (default)
Imports:

- ballerina/io

Type Definitions:

- record DatabaseErrorDetail:
  fields:
  int code
  string reason
- record NetworkErrorDetail:
  fields:
  string 'type
  string phase
  int elapsedTime
- type DatabaseError:
  alias: error<DatabaseErrorDetail>
- type NetworkError:
  alias: error<NetworkErrorDetail>

Constant Definitions:

- string ERROR = "Generic Error"

Function Definitions:

- function errorMatch(error e):
  match patterns: 1. var error DatabaseError(code = code):
  action: print "Matched DatabaseError with code: {code}" 2. var error(ERROR, code = code):
  action: print "Matched Generic Error with message: {ERROR} and code: {code}" 3. var error(message, 'type = errorType, ...otherDetails):
  action: print "Matched NetworkError with message: {message}, type: {errorType}, phase: {otherDetails["phase"]}, elapsedTime: {otherDetails["elapsedTime"]}"

- function main():
  variables:
  e1: error("Generic Error", code = 20)
  e2: DatabaseError("Database Error", code = 2, reason = "connection failure")
  e3: NetworkError("Bad Request", 'type = "http error", phase = "application", elapsedTime = 338)
  calls:
  errorMatch(e1)
  errorMatch(e2)
  errorMatch(e3)
