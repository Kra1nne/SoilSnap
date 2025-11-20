import Crop from '../models/crop-model.js';
import Soil from '../models/soil-model.js';
import fs from "fs";
import path from "path";
import { createLog } from './logs-controllers.js';

export const createCrop = async (req, res) => {
    try{
        const { name, description, soil_id } = req.body;
        const image = req.file ? req.file.filename : null;

        if(!name || !description || !image || !soil_id){
            return res.status(400).json({message: "Name, description, and image are required." })
        }

        const newCrop = new Crop({
            name,
            description,
            soil_id,
            image: `/uploads/crops/${image}`
        })

        await newCrop.save();
        await createLog({
            user_id: req.user?._id, 
            action: "CREATE",
            table: "Crop",
            description: `User ${req.user?.email || "Guest"} created a new crop: ${name}.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(201).json({ 
            message: "Crop data uploaded successfully", 
            crop: newCrop 
        });
    }
    catch(error){
        await createLog({
            user_id: req.user?._id, 
            action: "CREATE",
            table: "Crop",
            description: `User ${req.user?.email || "Guest"} created a new crop: ${name}.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const getCrop = async (req, res) => {
    try {
        const crops = await Crop.find().populate('soil_id', 'name');
        res.status(200).json({ 
            success: true, 
            crop: crops 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Error fetching crop data", 
            error: error.message 
        });
    }
}

export const getRecommendation = async ( req, res ) => {
    try {
         const { soil } = req.body; 
        
        if (!soil) {
            return res.status(400).json({ 
                success: false, 
                message: "Soil parameter is required" 
            });
        }
        const selectedSoil = await Soil.findOne({ name: soil });
        const recommendations = await Crop.find({ soil_id: selectedSoil._id }).populate('soil_id', 'name');
        res.status(200).json({ success: true, recommendations });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching crop recommendation", error: error.message});  
    }
}

export const editCrop = async (req, res) => {

    try {
        const { id } = req.params;
        const { name, description, soil_id } = req.body;
        const image = req.file ? req.file.filename : null;

        const crop = await Crop.findById(id);
        if(!crop){
            return res.status(404).json({ message: "Crop not found" });
        }

        let imagePath = crop.image;
        if(image) {
            const oldImagePath = path.join(
                process.cwd(),
                "backend",
                imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
            );
            if(fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            imagePath = `/uploads/crops/${image}`;
        }

        crop.name = name || crop.name;
        crop.description = description || crop.description;
        crop.image = imagePath;
        crop.soil_id = soil_id || crop.soil_id;
        await crop.save();
        await createLog({
            user_id: req.user?._id, 
            action: "UPDATE",
            table: "Crop",
            description: `User ${req.user?.email || "Guest"} updated a crop: ${name}.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(200).json({
            message: "Crop data updated successfully",
            crop
        });
        
    } catch (error) {
        await createLog({
            user_id: req.user?._id, 
            action: "UPDATE",
            table: "Crop",
            description: `User ${req.user?.email || "Guest"} updated a crop: ${name}.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({ message: "Server error", error: error.message});
    }

}

export const deleteCrop = async (req, res) => {
    try{
        const { id } = req.params;

        const crop = await Crop.findById(id);
        if(!crop){
            return res.status(404).json({ message: "Crop not found."});
        }

        let imagePath = crop.image;
        const oldImagePath = path.join(
            process.cwd(),
            "backend",
            imagePath.startsWith("/") ? imagePath.slice(1) : imagePath
        );
        if(fs.existsSync(oldImagePath)){
            fs.unlinkSync(oldImagePath);
        }

        await Crop.findByIdAndDelete(crop._id);
        await createLog({
            user_id: req.user?._id, 
            action: "DELETE",
            table: "Crop",
            description: `User ${req.user?.email || "Guest"} deleted a crop.`,
            status: "success",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(200).json({ message: "Crop deleted successfully", crop});
    }
    catch(error){
        await createLog({
            user_id: req.user?._id, 
            action: "DELETE",
            table: "Crop",
            description: `User ${req.user?.email || "Guest"} deleted a crop.`,
            status: "error",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
        });
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const viewCrop = async ( req, res ) => {
    try {
        const { id } = req.params;
        const crop = await Crop.findById(id).populate('soil_id', 'name');
        if (!crop) {
            return res.status(404).json({ message: "Crop not found" });
        }
        res.status(200).json({ success: true, crop });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const countCrops = async ( req, res ) => {
    try {
        const count = await Crop.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}