import express from 'express';
import { verifyToken, authorizeRole } from '../middleware/auth.js';
import {
  createJobRequisition,
  getAllJobRequisitions,
  getJobRequisitionById,
  updateJobRequisition,
  deleteJobRequisition,
  approveJobRequisition,
  rejectJobRequisition
} from '../controllers/jobRequisitionController.js';

const router = express.Router();
// Approval workflow endpoints
router.post('/:id/approve', verifyToken, authorizeRole('admin', 'hr'), approveJobRequisition);
router.post('/:id/reject', verifyToken, authorizeRole('admin', 'hr'), rejectJobRequisition);

// Public routes
router.get('/', getAllJobRequisitions);
router.get('/:id', getJobRequisitionById);

// Protected routes - require authentication and specific roles
router.post('/', verifyToken, authorizeRole('admin', 'hr', 'recruiter'), createJobRequisition);
router.put('/:id', verifyToken, authorizeRole('admin', 'hr', 'recruiter'), updateJobRequisition);
router.delete('/:id', verifyToken, authorizeRole('admin', 'hr'), deleteJobRequisition);

export default router;
