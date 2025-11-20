import Soil from '../models/soil-model.js';
import Crop from '../models/crop-model.js';
import fs from "fs";
import path from "path";
import { createLog } from './logs-controllers.js';

export const createSoil = async (req, res) => {
    try {
        const { name, description } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !description || !image) {
            return res.status(400).json({ message: "Name, description, and image are required." });
        }

        const newSoil = new Soil({
            name,
            description,
            image: `/uploads/soil/${image}`
        });

        await newSoil.save();
        await createLog({
            user_id: req.user?._id, 
            action: "CREATE",
            table: "Soil",
            description: `User ${req.user?.email || "Guest"} created a new soil classification.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });

        res.status(201).json({ 
            message: "Soil data uploaded successfully", 
            soil: newSoil 
        });
    } catch (error) {
        await createLog({
            user_id: req.user?._id, 
            action: "CREATE",
            table: "Soil",
            description: `User ${req.user?.email || "Guest"} created a new soil classification.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const countSoil = async ( req, res ) => {
    try {
        const count = await Soil.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const editSoil = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const image = req.file ? req.file.filename : null;

        // Fetch current soil document
        const soil = await Soil.findById(id);
        if (!soil) {
            return res.status(404).json({ message: "Soil not found." });
        }

        let imagePath = soil.image;
        if (image) {
            // Remove leading slash if present
            const oldImagePath = path.join(
                process.cwd(),
                "backend",
                imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
            );
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            imagePath = `/uploads/soil/${image}`;
        }

        // Update soil document
        soil.name = name || soil.name;
        soil.description = description || soil.description;
        soil.image = imagePath;
        await soil.save();
        await createLog({
            user_id: req.user?._id, 
            action: "UPDATE",
            table: "Soil",
            description: `User ${req.user?.email || "Guest"} updated a soil classification.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(200).json({
            message: "Soil data updated successfully",
            soil
        });
    } catch (error) {
        await createLog({
            user_id: req.user?._id, 
            action: "UPDATE",
            table: "Soil",
            description: `User ${req.user?.email || "Guest"} updated a soil classification.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteSoil = async (req, res) => {
    try{
        const { id } = req.params;
        
        const soil = await Soil.findById(id);
        if (!soil) {
            return res.status(404).json({ message: "Soil not found." });
        }
        
        let imagePath = soil.image;
        const oldImagePath = path.join(
            process.cwd(),
            "backend",
            imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
        );
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        }
        await Soil.findByIdAndDelete(soil._id);
        await createLog({
            user_id: req.user?._id, 
            action: "DELETE",
            table: "Soil",
            description: `User ${req.user?.email || "Guest"} deleted a soil classification.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(200).json({ message: "Soil classification deleted successfully", soil });
    }
    catch (error) {
        await createLog({
            user_id: req.user?._id, 
            action: "DELETE",
            table: "Soil",
            description: `User ${req.user?.email || "Guest"} deleted a soil classification.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getSoil = async (req, res) => {
    try {
        const soils = await Soil.find();
        res.status(200).json({ 
            success: true, 
            soil: soils 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching soil data", 
            error: error.message 
        });
    }
}

export const viewSoil = async (req, res) => {
    try {
        const { id } = req.params;
        const soil = await Soil.findById(id);
        if(!soil){
            res.status(404).json({ message: "Soil classification not found." });
        }
        const crops = await Crop.find({ soil_id: id }).select('name');

        res.status(200).json({ 
            success: true, 
            soil, 
            recommendedCrops: crops 
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}