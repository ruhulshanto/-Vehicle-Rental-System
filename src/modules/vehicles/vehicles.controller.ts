import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.services";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getAllVehicles();
    const message = result.length > 0 
      ? "Vehicles retrieved successfully" 
      : "No vehicles found";
    
    res.status(200).json({
      success: true,
      message,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId ? parseInt(req.params.vehicleId) : NaN;
    
    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID"
      });
    }
    
    const result = await vehiclesService.getVehicleById(vehicleId);
    
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: result
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId ? parseInt(req.params.vehicleId) : NaN;
    
    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID"
      });
    }
    
    const result = await vehiclesService.updateVehicle(vehicleId, req.body);
    
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId ? parseInt(req.params.vehicleId) : NaN;
    
    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID"
      });
    }
    
    await vehiclesService.deleteVehicle(vehicleId);
    
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const vehiclesController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
};