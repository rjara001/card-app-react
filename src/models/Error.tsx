export class TokenExpiredError extends Error {
    constructor() {
        super("Token Expired");
        this.name = "TokenError"; // Optionally set the error name to the class name
    }
}
