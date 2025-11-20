import express from 'express';
import { getLogs } from '../controllers/logs-controllers.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, requireAdmin, getLogs);

export default router;
