"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_services_1 = require("./auth.services");
const registerUser = async (req, res) => {
    try {
        const result = await auth_services_1.authServices.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Registration failed"
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await auth_services_1.authServices.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || "Invalid credentials"
        });
    }
};
exports.authController = {
    registerUser,
    loginUser
};
