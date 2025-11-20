import express from "express";
import multer from "multer";
import path from "path";
import { createRequest, getAllRequests, removeRequest, editRequest, viewRequest, changeRole } from "../controllers/request-controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/request");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post("/upload", upload.single("image"), verifyToken, createRequest);
router.get("/", verifyToken, requireAdmin, getAllRequests);
router.delete("/:id", verifyToken, requireAdmin, removeRequest);
router.patch("/:id", verifyToken, requireAdmin, editRequest);
router.get("/:id", verifyToken, requireAdmin, viewRequest);
router.patch("/:id/role", verifyToken, requireAdmin, changeRole);

export default router;