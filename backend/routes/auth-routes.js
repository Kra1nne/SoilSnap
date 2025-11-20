import express from "express";
import { 
    login, 
    logout, 
    resetPassword, 
    verifyResetOtp, 
    updatePassword,
    validateResetToken,
    validateNewPasswordToken,
    googleLogin
} from "../controllers/auth-controllers.js";
import { loginLimiter, passwordResetLimiter } from "../middleware/rateLimiter.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import passport from "passport";

const router = express.Router();

// Public routes
router.post("/login", loginLimiter, login);
router.post("/reset-password", passwordResetLimiter, resetPassword);
router.post("/verify-reset-otp", passwordResetLimiter, verifyResetOtp);
router.post("/new-password", passwordResetLimiter, updatePassword);

// Token validation routes
router.post("/validate-reset-token", validateResetToken);
router.post("/validate-new-password-token", validateNewPasswordToken);

// Protected routes
router.post("/logout", verifyToken, logout);
//google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleLogin);

export default router;