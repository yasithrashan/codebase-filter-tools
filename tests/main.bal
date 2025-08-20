import ballerina/http;
import ballerina/time;

configurable int serverPort = 8080;

service / on new http:Listener(serverPort) {

    // GET endpoint to retrieve all users
    resource function get users() returns User[]|http:InternalServerError {
        User[] users = [
            {id: 1, name: "John Doe", email: "john@example.com"},
            {id: 2, name: "Jane Smith", email: "jane@example.com"}
        ];
        return users;
    }

    // GET endpoint to retrieve all products
    resource function get products() returns Product[]|http:InternalServerError {
        Product[] products = [
            {id: 1, name: "Laptop", price: 999.99d, category: "Electronics"},
            {id: 2, name: "Book", price: 29.99d, category: "Education"}
        ];
        return products;
    }

    // GET endpoint to retrieve all orders
    resource function get orders() returns Order[]|http:InternalServerError {
        Order[] orders = [
            {
                id: 1,
                userId: 1,
                products: [{id: 1, name: "Laptop", price: 999.99d, category: "Electronics"}],
                totalAmount: 999.99d,
                status: "completed"
            }
        ];
        return orders;
    }

    // GET endpoint for health check
    resource function get health() returns HealthStatus|http:InternalServerError {
        HealthStatus healthStatus = {
            status: "healthy",
            timestamp: time:utcToString(time:utcNow()),
            version: "1.0.0"
        };
        return healthStatus;
    }

    // GET endpoint for server status
    resource function get status() returns ServerStatus|http:InternalServerError {
        ServerStatus serverStatus = {
            status: "running",
            uptime: 3600,
            activeConnections: 5
        };
        return serverStatus;
    }

    // POST endpoint to create a new user
    resource function post users(CreateUserRequest userRequest) returns User|http:BadRequest|http:InternalServerError {
        string userName = userRequest.name;
        string userEmail = userRequest.email;

        if userName.trim() == "" || userEmail.trim() == "" {
            http:BadRequest badRequestResponse = {
                body: {message: "Name and email are required"}
            };
            return badRequestResponse;
        }

        User newUser = {
            id: 3,
            name: userName,
            email: userEmail
        };
        return newUser;
    }

    // POST endpoint to create a new product
    resource function post products(CreateProductRequest productRequest) returns Product|http:BadRequest|http:InternalServerError {
        string productName = productRequest.name;
        decimal productPrice = productRequest.price;

        if productName.trim() == "" || productPrice <= 0.0d {
            http:BadRequest badRequestResponse = {
                body: {message: "Valid name and price are required"}
            };
            return badRequestResponse;
        }

        Product newProduct = {
            id: 3,
            name: productName,
            price: productPrice,
            category: productRequest.category
        };
        return newProduct;
    }

    // POST endpoint to create a new order
    resource function post orders(CreateOrderRequest orderRequest) returns Order|http:BadRequest|http:InternalServerError {
        int userId = orderRequest.userId;
        int[] productIds = orderRequest.productIds;

        if userId <= 0 || productIds.length() == 0 {
            http:BadRequest badRequestResponse = {
                body: {message: "Valid user ID and product IDs are required"}
            };
            return badRequestResponse;
        }

        Product[] orderProducts = [
            {id: 1, name: "Laptop", price: 999.99d, category: "Electronics"}
        ];

        Order newOrder = {
            id: 2,
            userId: userId,
            products: orderProducts,
            totalAmount: 999.99d,
            status: "pending"
        };
        return newOrder;
    }

    // POST endpoint for user login
    resource function post login(LoginRequest loginRequest) returns AuthResponse|http:Unauthorized|http:BadRequest {
        string email = loginRequest.email;
        string password = loginRequest.password;

        if email.trim() == "" || password.trim() == "" {
            http:BadRequest badRequestResponse = {
                body: {message: "Email and password are required"}
            };
            return badRequestResponse;
        }

        // Simple validation (in real scenario, validate against database)
        if email == "user@example.com" && password == "password123" {
            AuthResponse authResponse = {
                token: "jwt-token-here",
                message: "Login successful"
            };
            return authResponse;
        } else {
            http:Unauthorized unauthorizedResponse = {
                body: {message: "Invalid credentials"}
            };
            return unauthorizedResponse;
        }
    }

    // POST endpoint for user registration
    resource function post register(RegisterRequest registerRequest) returns AuthResponse|http:BadRequest|http:Conflict {
        string name = registerRequest.name;
        string email = registerRequest.email;
        string password = registerRequest.password;

        if name.trim() == "" || email.trim() == "" || password.trim() == "" {
            http:BadRequest badRequestResponse = {
                body: {message: "Name, email, and password are required"}
            };
            return badRequestResponse;
        }

        // Simple validation (in real scenario, check if user already exists)
        if email == "existing@example.com" {
            http:Conflict conflictResponse = {
                body: {message: "User already exists"}
            };
            return conflictResponse;
        }

        AuthResponse authResponse = {
            token: "jwt-token-here",
            message: "Registration successful"
        };
        return authResponse;
    }
}
