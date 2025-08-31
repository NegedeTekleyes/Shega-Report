import * as express from 'express';
import {
  createReport,
  getUserReports,
  submitReport
} from '../controllers/complianceController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Report management routes
router.post('/', createReport);
router.post('/', getUserReports);
router.patch('/:reportId/submit', submitReport);

export default router;