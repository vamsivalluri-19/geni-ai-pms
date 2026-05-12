import express from 'express';
import { verifyToken, authorizeRole } from '../middleware/auth.js';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getAllApplications,
  updateApplicationStatus,
  updateMyApplication,
  withdrawMyApplication,
  bulkUpdateStatus
} from '../controllers/applicationController.js';

const router = express.Router();

// More specific routes must come BEFORE catch-all routes
router.get('/my-applications', verifyToken, getMyApplications);
router.put('/my-applications/:id', verifyToken, updateMyApplication);
router.patch('/my-applications/:id/withdraw', verifyToken, withdrawMyApplication);
router.get('/job/:jobId', verifyToken, authorizeRole('admin', 'recruiter', 'hr', 'staff'), getJobApplications);

// More general routes come after
router.post('/', verifyToken, applyForJob);
router.get('/', verifyToken, authorizeRole('admin', 'hr', 'recruiter', 'staff'), getAllApplications);
router.put('/:id', verifyToken, authorizeRole('admin', 'recruiter', 'hr', 'staff'), updateApplicationStatus);

// Bulk status update
router.post('/bulk-update-status', verifyToken, authorizeRole('admin', 'recruiter', 'hr', 'staff'), bulkUpdateStatus);

export default router;
