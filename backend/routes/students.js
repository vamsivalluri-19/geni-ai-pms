import express from 'express';
import { verifyToken, authorizeRole } from '../middleware/auth.js';
import upload from '../middleware/multerConfig.js';
import {
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
  getAllStudents,
  uploadStudentsCSV,
  getStudentsFromCSV
} from '../controllers/studentController.js';

const router = express.Router();

router.post('/profile', verifyToken, createStudentProfile);
router.get('/profile', verifyToken, getStudentProfile);
router.put('/profile', verifyToken, upload.single('resume'), updateStudentProfile);
router.get('/', verifyToken, authorizeRole('admin', 'recruiter', 'hr', 'staff'), getAllStudents);
router.get('/csv', verifyToken, authorizeRole('admin', 'recruiter', 'hr', 'staff'), getStudentsFromCSV);
router.get('/:id', verifyToken, getStudentProfile);
router.put('/:id', verifyToken, upload.single('resume'), updateStudentProfile);

// Mark resume as reviewed
router.patch('/:id/mark-reviewed', verifyToken, async (req, res) => {
  try {
    const student = await (await import('../models/Student.js')).default.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    student.resumeReviewed = true;
    await student.save();
    res.json({ success: true, message: 'Resume marked as reviewed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.post('/upload-csv', verifyToken, authorizeRole('admin'), upload.single('file'), uploadStudentsCSV);

export default router;
