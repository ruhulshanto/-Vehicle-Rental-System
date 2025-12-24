"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (...roles) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: No token provided"
                });
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Invalid token format"
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            req.user = decoded;
            if (roles.length > 0 && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Insufficient permissions"
                });
            }
            next();
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Token expired"
                });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Invalid token"
                });
            }
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
    };
};
exports.default = auth;
