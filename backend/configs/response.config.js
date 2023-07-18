const responseList = {
    NO_ENDPOINT: "Endpoint leads to nowhere!",
    BAD_REQUEST: "There is a problem with your request",
    CREATED_SUCCESS: "Successfully created!",
    SUCCESS: "Request successfully completed",
    DELETED_SUCCESS: "Deleted successfully!",
    DELETED_FAILED: "Failed to delete!",
    EMAIL_PASSWORD_ERROR: "Password is incorrect",
    DUPLICATE_EMAIL: "Email already taken",
    MISSING_EMAIL_PASSWORD: "Missing email or password in body",
    MISSING_APPROVER: "Missing approver for user",
    MISSING_TOKEN: "Missing token in header",
    VALID_TOKEN: "Token is valid",
    INVALID_TOKEN: "Invalid token",
    TENANT_NOT_FOUND: "Tenant not found",
    EMAIL_NOT_FOUND: "User with the email not found",
    EXPENSE_NOT_FOUND: "Expense not found",
    MISSING_PERMISSION: "Missing required permission",
    SOMETHING_WRONG: "Something went wrong",
}

module.exports = responseList