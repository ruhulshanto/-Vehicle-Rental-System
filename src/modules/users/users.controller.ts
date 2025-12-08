import { Request, Response } from "express";
import { usersService } from "./users.services";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
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
    
    const result = await usersService.updateUser(userId, req.body, currentUserRole || 'customer');
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId ? parseInt(req.params.userId) : NaN;
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }
    
    const result = await usersService.deleteUser(userId);
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const usersController = {
  getAllUsers,
  updateUser,
  deleteUser
};