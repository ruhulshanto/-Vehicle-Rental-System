"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const users_services_1 = require("./users.services");
const getAllUsers = async (req, res) => {
    try {
        const result = await users_services_1.usersService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId ? parseInt(req.params.userId) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }
        const currentUserId = req.user?.id;
        const currentUserRole = req.user?.role;
        // Check permissions
        if (currentUserRole !== 'admin' && currentUserId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You can only update your own profile"
            });
        }
        const result = await users_services_1.usersService.updateUser(userId, req.body, currentUserRole || 'customer');
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId ? parseInt(req.params.userId) : NaN;
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }
        const result = await users_services_1.usersService.deleteUser(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.usersController = {
    getAllUsers,
    updateUser,
    deleteUser
};
