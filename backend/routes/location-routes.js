import express from "express";
import multer from "multer";
import path from "path";
import { createLocation, getAllLocation, deleteLocation, updateLocation } from "../controllers/location-controllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "backend/uploads/location");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post("/", upload.single("image"), createLocation);
router.get("/", getAllLocation);
router.delete("/:id",verifyToken, requireAdmin, deleteLocation);
router.patch("/:id", verifyToken, updateLocation);

export default router;
