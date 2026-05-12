import PlacementResult from '../models/PlacementResult.js';
import Student from '../models/Student.js';
import { createNotification } from './notificationController.js';
import User from '../models/User.js';

export const createPlacementResult = async (req, res) => {
  try {
    const {
      studentUserId,
      companyName,
      roleTitle,
      location,
      ctc,
      bond,
      offerType,
      status,
      resultDate,
      joiningDate,
      recruiterName,
      recruiterEmail,
      recruiterPhone,
      rounds,
      eligibility,
      notes,
      placementType // new field
    } = req.body;

    if (!studentUserId || !companyName || !roleTitle) {
      return res.status(400).json({
        success: false,
        message: 'studentUserId, companyName, and roleTitle are required'
      });
    }

    const studentProfile = await Student.findOne({ user: studentUserId });

    const placement = await PlacementResult.create({
      studentUser: studentUserId,
      student: studentProfile?._id,
      companyName,
      roleTitle,
      location,
      ctc,
      bond,
      offerType,
      status,
      resultDate,
      joiningDate,
      recruiterName,
      recruiterEmail,
      recruiterPhone,
      rounds,
      eligibility,
      notes,
      placementType: placementType || 'on-campus',
      createdBy: req.user.id
    });

    // Create notification for HR
    try {
      const hrStaff = await User.find({ role: { $in: ['hr', 'admin', 'staff'] } }).select('_id');
      if (hrStaff.length > 0) {
        const promises = hrStaff.map((user) => 
          createNotification(
            user._id,
            'placement',
            'Placement Result Updated',
            `${studentProfile?.name || 'A student'} has been placed at ${companyName} as ${roleTitle}`,
            placement._id,
            'PlacementResult'
          )
        );
        await Promise.all(promises);
      }
    } catch (notificationError) {
      console.error('Error creating placement notification:', notificationError);
    }

    res.status(201).json({
      success: true,
      placement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPlacements = async (req, res) => {
  try {
    const { studentUserId, year, branch } = req.query;
    const userRole = req.user?.role;
    let query = {};

    if (studentUserId) {
      query.studentUser = studentUserId;
    }

    // Filter by year (placement year)
    if (year) {
      // Assume resultDate is the placement date
      const start = new Date(`${year}-04-01`); // Academic year starts in April
      const end = new Date(`${parseInt(year) + 1}-03-31`);
      query.resultDate = { $gte: start, $lte: end };
    }

    // Filter by branch (student.branch or branch field)
    if (branch && branch !== 'all') {
      query.$or = [
        { 'branch': branch },
        { 'student.branch': branch }
      ];
    }

    const placements = await PlacementResult.find(query)
      .populate({ path: 'studentUser', select: 'name email role' })
      .populate({ path: 'student', select: 'branch rollNumber cgpa' })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: placements.length,
      placements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePlacementResult = async (req, res) => {
  try {
    const placement = await PlacementResult.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement result not found'
      });
    }

    res.status(200).json({
      success: true,
      placement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deletePlacementResult = async (req, res) => {
  try {
    const placement = await PlacementResult.findByIdAndDelete(req.params.id);

    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement result not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Placement result deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
