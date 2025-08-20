# Simple Summary of the Codebase

## main.bal

**imports**
- ballerina/http
- ballerina/time

**types**
- no types (uses types from types.bal)

**variables**
- serverPort: int (configurable)

**services**
- /
  - doc comments: REST service with endpoints for users, products, orders, authentication, and health/status checks

**resource functions**
- get users
  - doc comments: Retrieves all users
  - parameters: none
  - return: User[] | http:InternalServerError
- get products
  - doc comments: Retrieves all products
  - parameters: none
  - return: Product[] | http:InternalServerError
- get orders
  - doc comments: Retrieves all orders
  - parameters: none
  - return: Order[] | http:InternalServerError
- get health
  - doc comments: Returns health status of the server
  - parameters: none
  - return: HealthStatus | http:InternalServerError
- get status
  - doc comments: Returns server status information
  - parameters: none
  - return: ServerStatus | http:InternalServerError
- post users
  - doc comments: Creates a new user
  - parameters: userRequest: CreateUserRequest
  - return: User | http:BadRequest | http:InternalServerError
- post products
  - doc comments: Creates a new product
  - parameters: productRequest: CreateProductRequest
  - return: Product | http:BadRequest | http:InternalServerError
- post orders
  - doc comments: Creates a new order
  - parameters: orderRequest: CreateOrderRequest
  - return: Order | http:BadRequest | http:InternalServerError
- post login
  - doc comments: Authenticates a user and returns JWT token
  - parameters: loginRequest: LoginRequest
  - return: AuthResponse | http:Unauthorized | http:BadRequest
- post register
  - doc comments: Registers a new user
  - parameters: registerRequest: RegisterRequest
  - return: AuthResponse | http:BadRequest | http:Conflict

## types.bal

**imports**
- none

**types**
- User: {id: int, name: string, email: string}
- CreateUserRequest: {name: string, email: string}
- Product: {id: int, name: string, price: decimal, category: string}
- CreateProductRequest: {name: string, price: decimal, category: string}
- Order: {id: int, userId: int, products: Product[], totalAmount: decimal, status: string}
- CreateOrderRequest: {userId: int, productIds: int[]}
- LoginRequest: {email: string, password: string}
- RegisterRequest: {name: string, email: string, password: string}
- AuthResponse: {token: string, message: string}
- HealthStatus: {status: string, timestamp: string, version: string}
- ServerStatus: {status: string, uptime: int, activeConnections: int}
- ErrorMessage: {message: string}
