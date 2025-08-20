// User related types
public type User record {
    int id;
    string name;
    string email;
};

public type CreateUserRequest record {
    string name;
    string email;
};

// Product related types
public type Product record {
    int id;
    string name;
    decimal price;
    string category;
};

public type CreateProductRequest record {
    string name;
    decimal price;
    string category;
};

// Order related types
public type Order record {
    int id;
    int userId;
    Product[] products;
    decimal totalAmount;
    string status;
};

public type CreateOrderRequest record {
    int userId;
    int[] productIds;
};

// Authentication types
public type LoginRequest record {
    string email;
    string password;
};

public type RegisterRequest record {
    string name;
    string email;
    string password;
};

public type AuthResponse record {
    string token;
    string message;
};

// Health check types
public type HealthStatus record {
    string status;
    string timestamp;
    string version;
};

public type ServerStatus record {
    string status;
    int uptime;
    int activeConnections;
};

// Error response types
public type ErrorMessage record {
    string message;
};
