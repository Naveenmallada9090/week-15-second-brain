import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
export const userMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({
            message: "Authorization header missing",
        });
    }
    const tokenParts = authHeader.split(" ");
    const token = tokenParts.length === 2 && tokenParts[0] === "Bearer"
        ? tokenParts[1]
        : authHeader;
    if (!token) {
        return res.status(403).json({
            message: "Invalid authorization header",
        });
    }
    try {
        const payload = jwt.verify(token, JWT_PASSWORD);
        // Check if payload is an object and has an id property of type string
        if (typeof payload === "object" && payload !== null && "id" in payload && typeof payload.id === "string") {
            req.userId = payload.id;
            next();
        }
        else {
            return res.status(403).json({
                message: "Invalid token payload",
            });
        }
    }
    catch (err) {
        return res.status(403).json({
            message: "Invalid token",
        });
    }
};
//# sourceMappingURL=middleware.js.map