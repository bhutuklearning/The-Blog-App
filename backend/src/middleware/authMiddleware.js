import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        let token = null;

        // 1) Try cookie first
        if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        // 2) Fallback to Authorization header: "Bearer <token>"
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // support different claim names: id, userId, sub
        const userId = decoded.id || decoded.userId || decoded.sub;
        if (!userId) {
            console.error("Auth middleware: no id in token payload", decoded);
            return res.status(401).json({ message: "Not authorized, token invalid" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};
