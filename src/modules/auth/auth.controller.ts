import { Request, Response } from 'express';
import { authServices } from './auth.services';

const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials"
    });
  }
};

export const authController = {
  registerUser,
  loginUser
};