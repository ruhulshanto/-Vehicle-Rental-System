"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehiclesController = void 0;
const vehicles_services_1 = require("./vehicles.services");
const createVehicle = async (req, res) => {
    try {
        const result = await vehicles_services_1.vehiclesService.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
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
const getAllVehicles = async (req, res) => {
    try {
        const result = await vehicles_services_1.vehiclesService.getAllVehicles();
        const message = result.length > 0
            ? "Vehicles retrieved successfully"
            : "No vehicles found";
        res.status(200).json({
            success: true,
            message,
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
const getVehicleById = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId ? parseInt(req.params.vehicleId) : NaN;
        if (isNaN(vehicleId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID"
            });
        }
        const result = await vehicles_services_1.vehiclesService.getVehicleById(vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
const updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId ? parseInt(req.params.vehicleId) : NaN;
        if (isNaN(vehicleId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID"
            });
        }
        const result = await vehicles_services_1.vehiclesService.updateVehicle(vehicleId, req.body);
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
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
const deleteVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId ? parseInt(req.params.vehicleId) : NaN;
        if (isNaN(vehicleId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid vehicle ID"
            });
        }
        await vehicles_services_1.vehiclesService.deleteVehicle(vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
exports.vehiclesController = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
};
