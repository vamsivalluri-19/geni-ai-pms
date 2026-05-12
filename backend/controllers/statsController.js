// ✅ Stats Controller - Provides mock/real data for dashboards
import User from '../models/User.js';
import Student from '../models/Student.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import JobRequisition from '../models/JobRequisition.js';
import Notification from '../models/Notification.js';
import ExamSubmission from '../models/ExamSubmission.js';
import Interview from '../models/Interview.js';
import PlacementResult from '../models/PlacementResult.js';

const defaultHRConfig = {
  autoResumeScreening: true,
  aiInterviewAssistant: true,
  autoArchiveOldJobs: true,
  emailNotifications: true,
  pushNotifications: true,
  weeklyHiringReports: true,
  securityAlerts: true,
  twoFactorAuth: false,
  apiKeyManagement: false
};

const normalizeStatus = (status = '') => String(status || '').trim().toLowerCase();

const countByStatuses = (items = [], allowedStatuses = []) =>
  items.filter((item) => allowedStatuses.includes(normalizeStatus(item?.status))).length;

const parsePackageValue = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (!value) return 0;

  const text = String(value).replace(/,/g, '').toLowerCase();
  const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (!numberMatch) return 0;

  const numeric = Number(numberMatch[1]);
  if (!Number.isFinite(numeric)) return 0;

  if (text.includes('cr')) return numeric * 100;
  return numeric;
};

const averageNumber = (values = []) => {
  const numericValues = values.filter((value) => Number.isFinite(value));
  if (!numericValues.length) return 0;
  return Number((numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length).toFixed(1));
};

export const getStudentStats = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const student = await Student.findOne({ user: userId }).select('_id cgpa attendance attendancePercentage rollNumber branch phoneNumber skills resumeDraft avatar certifications user').lean();
    const studentId = student?._id || null;

    const [applications, interviews, placements, submissions, notifications, activeJobs] = await Promise.all([
      studentId ? Application.find({ student: studentId }).sort({ updatedAt: -1 }).populate('job', 'company position').lean() : [],
      studentId ? Interview.find({ student: studentId }).sort({ createdAt: -1 }).lean() : [],
      PlacementResult.find({ studentUser: userId }).sort({ createdAt: -1 }).lean(),
      ExamSubmission.find({ studentUser: userId }).sort({ submittedAt: -1 }).lean(),
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
      Job.find({ status: 'active' }).select('_id').lean()
    ]);

    const profileChecklist = [
      Boolean(student?.user),
      Boolean(student?.rollNumber),
      Boolean(student?.branch),
      Boolean(student?.phoneNumber),
      Array.isArray(student?.skills) && student.skills.filter(Boolean).length >= 3,
      Boolean(student?.resumeDraft),
      Boolean(student?.avatar)
    ];

    const profileComplete = profileChecklist.length
      ? Math.round((profileChecklist.filter(Boolean).length / profileChecklist.length) * 100)
      : 0;

    const offersCount = countByStatuses(placements, ['offered', 'accepted']);
    const interviewCompletedCount = countByStatuses(interviews, ['passed', 'failed']);
    const rejectedOffersCount = countByStatuses(placements, ['rejected']);

    
    const stats = {
      applications: applications.length,
      interviews: interviews.length,
      profileComplete,
      cgpa: Number(student?.cgpa || 0),
      attendance: Number(student?.attendance || student?.attendancePercentage || 0),
      offers: offersCount,
      resumeViews: applications.length * 3 + notifications.length,
      interviewsCompleted: interviewCompletedCount,
      offersRejected: rejectedOffersCount,
      averageScore: averageNumber(submissions.map((submission) => Number(submission?.score))),
      studyStreak: Math.min(30, applications.length + interviews.length + submissions.length),
      certificatesEarned: Array.isArray(student?.certifications) ? student.certifications.length : 0,
      documentsDownloaded: submissions.length + notifications.length,
      attendancePercentage: Number(student?.attendance || student?.attendancePercentage || 0),
      skills: Array.isArray(student?.skills) ? student.skills.filter(Boolean).length : 0,
      certifications: Array.isArray(student?.certifications) ? student.certifications.length : 0,
      classes: activeJobs.length,
      companies: new Set(applications.map((application) => application?.job?.company).filter(Boolean)).size
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentInsights = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const student = await Student.findOne({ user: userId }).lean();

    const [applications, activeJobs, notifications, examSubmissions, interviews, placements] = await Promise.all([
      student
        ? Application.find({ student: student._id })
            .populate('job', 'company position skills eligibility location status createdAt')
            .sort({ updatedAt: -1 })
            .lean()
        : [],
      Job.find({ status: 'active' }).select('company position skills eligibility location createdAt').lean(),
      Notification.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
      ExamSubmission.find({ studentUser: userId }).populate('exam', 'title').sort({ submittedAt: -1 }).lean(),
      student ? Interview.find({ student: student._id }).sort({ createdAt: -1 }).lean() : [],
      PlacementResult.find({ studentUser: userId }).sort({ createdAt: -1 }).lean()
    ]);

    const studentSkills = Array.isArray(student?.skills) ? student.skills : [];
    const checklist = [
      { label: 'Full name added', done: true },
      { label: 'Primary email added', done: true },
      { label: 'Phone number added', done: Boolean(student?.phoneNumber) },
      { label: 'Branch selected', done: Boolean(student?.branch) },
      { label: 'At least 3 skills listed', done: studentSkills.filter(Boolean).length >= 3 },
      { label: 'Resume uploaded', done: Boolean(student?.resume) },
      { label: 'Resume summary written', done: Boolean(student?.resumeDraft?.summary) },
      { label: 'LinkedIn or GitHub added', done: Boolean(student?.resumeDraft?.links?.linkedin || student?.resumeDraft?.links?.github) }
    ];

    const completedChecklistItems = checklist.filter((item) => item.done).length;
    const profileCompletionPercent = checklist.length ? Math.round((completedChecklistItems / checklist.length) * 100) : 0;

    const recommendations = activeJobs
      .map((job) => {
        const requiredSkills = Array.isArray(job.skills) ? job.skills.filter(Boolean) : [];
        const matchedSkills = requiredSkills.filter((skill) =>
          studentSkills.some((studentSkill) => String(studentSkill).toLowerCase() === String(skill).toLowerCase())
        );

        const skillScore = requiredSkills.length ? (matchedSkills.length / requiredSkills.length) * 70 : 50;
        const minCgpa = Number(job?.eligibility?.minCGPA || 0);
        const cgpaScore = Number(student?.cgpa || 0) >= minCgpa ? 30 : 10;
        const score = Math.max(0, Math.min(100, Math.round(skillScore + cgpaScore)));

        return {
          id: String(job._id),
          company: job.company || 'Company',
          role: job.position || 'Role',
          score,
          matchedSkillsCount: matchedSkills.length,
          totalSkillsCount: requiredSkills.length
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const stageMap = {
      applied: 'Applied',
      shortlisted: 'Shortlisted',
      selected: 'Offer',
      rejected: 'Not Selected',
      withdrawn: 'Withdrawn'
    };

    const timeline = applications.slice(0, 10).map((application) => ({
      id: String(application._id),
      company: application.job?.company || 'Company',
      role: application.job?.position || 'Role',
      stage: stageMap[normalizeStatus(application.status)] || 'Applied',
      date: application.updatedAt || application.createdAt || new Date().toISOString()
    }));

    const shortlistedCount = applications.filter((application) => ['shortlisted', 'selected'].includes(normalizeStatus(application.status))).length;
    const shortlistRate = applications.length ? Math.round((shortlistedCount / applications.length) * 100) : 0;
    const offersCount = placements.filter((placement) => ['offered', 'accepted'].includes(normalizeStatus(placement.status))).length;

    const averageScore = examSubmissions.length
      ? Number(
          (
            examSubmissions.reduce((sum, submission) => {
              const score = Number(submission?.score);
              return sum + (Number.isFinite(score) ? score : 0);
            }, 0) / examSubmissions.length
          ).toFixed(1)
        )
      : 0;

    const activityFeed = [
      ...notifications.slice(0, 8).map((notification) => ({
        id: `notif-${notification._id}`,
        title: notification.title || 'Notification',
        subtitle: notification.message || '',
        date: notification.createdAt || new Date().toISOString(),
        type: 'notification'
      })),
      ...applications.slice(0, 8).map((application) => ({
        id: `app-${application._id}`,
        title: `Application ${normalizeStatus(application.status) || 'applied'}`,
        subtitle: `${application.job?.company || 'Company'} • ${application.job?.position || 'Role'}`,
        date: application.updatedAt || application.createdAt || new Date().toISOString(),
        type: 'application'
      })),
      ...examSubmissions.slice(0, 8).map((submission) => ({
        id: `exam-${submission._id}`,
        title: `Exam submitted: ${submission.exam?.title || 'Interview Exam'}`,
        subtitle: Number.isFinite(Number(submission.score)) ? `Score: ${submission.score}` : 'Awaiting score',
        date: submission.submittedAt || submission.createdAt || new Date().toISOString(),
        type: 'exam'
      }))
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    return res.json({
      success: true,
      data: {
        metrics: {
          applications: applications.length,
          interviews: interviews.length,
          offers: offersCount,
          shortlistRate,
          averageScore,
          examParticipation: examSubmissions.length
        },
        profileCompletion: {
          percent: profileCompletionPercent,
          completedItems: completedChecklistItems,
          totalItems: checklist.length,
          checklist
        },
        recommendations,
        timeline,
        activityFeed
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      activeJobs,
      applications,
      interviews,
      placements,
      studentDocs
    ] = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.find().select('status job').populate('job', 'company').lean(),
      Interview.find().select('result scheduledDate').lean(),
      PlacementResult.find().select('status ctc companyName').lean(),
      Student.find().select('cgpa').lean()
    ]);

    const completedPlacements = countByStatuses(placements, ['offered', 'accepted']);
    const pendingInterviews = interviews.filter((interview) => normalizeStatus(interview?.result) === 'pending').length;
    const companiesRegistered = new Set([
      ...placements.map((placement) => placement?.companyName).filter(Boolean),
      ...applications.map((application) => application?.job?.company).filter(Boolean)
    ]).size;
    const averageCGPA = averageNumber(studentDocs.map((student) => Number(student?.cgpa)));
    const avgPackage = averageNumber(placements.map((placement) => parsePackageValue(placement?.ctc)));
    const placementRate = totalStudents ? Number(((completedPlacements / totalStudents) * 100).toFixed(1)) : 0;

    const stats = {
      totalUsers,
      totalStudents,
      activeJobs,
      completedPlacements,
      pendingInterviews,
      companiesRegistered,
      averageCGPA,
      placementRate,
      avgPackage,
      systemStatus: 'Healthy',
      securityScore: 98,
      performances: Math.min(100, Math.round((placementRate + averageCGPA * 10) / 2))
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHRStats = async (req, res) => {
  try {
    const [activeJobPostings, applications, interviews, placements, requisitions, students] = await Promise.all([
      Job.countDocuments({ status: 'active' }),
      Application.find().select('status job').populate('job', 'company').lean(),
      Interview.find().select('scheduledDate result').sort({ scheduledDate: 1 }).lean(),
      PlacementResult.find().select('status companyName').lean(),
      JobRequisition.find().select('status').lean(),
      Student.countDocuments()
    ]);

    const applicationsReceived = applications.length;
    const interviewsScheduled = interviews.length;
    const offersExtended = countByStatuses(placements, ['offered', 'accepted']);
    const acceptanceRate = offersExtended ? Number(((countByStatuses(placements, ['accepted']) / offersExtended) * 100).toFixed(1)) : 0;
    const pendingApprovals = requisitions.filter((requisition) => ['open', 'in review', 'on hold'].includes(normalizeStatus(requisition?.status))).length;
    const talentPoolSize = students;
    const nextInterviewDate = interviews.find((interview) => interview?.scheduledDate)?.scheduledDate || null;
    const companies = new Set([
      ...applications.map((application) => application?.job?.company).filter(Boolean),
      ...placements.map((placement) => placement?.companyName).filter(Boolean)
    ]).size;

    const stats = {
      activeJobPostings,
      applicationsReceived,
      interviewsScheduled,
      offersExtended,
      acceptanceRate,
      pendingApprovals,
      talentPoolSize,
      nextInterviewDate,
      companies,
      analytics: applicationsReceived
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHRSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('role hrSettings');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!['hr', 'admin', 'staff', 'recruiter'].includes(String(user.role || '').toLowerCase())) {
      return res.status(403).json({ success: false, message: 'Not authorized to access HR settings' });
    }

    return res.json({
      success: true,
      data: {
        theme: user.hrSettings?.theme || 'system',
        config: {
          ...defaultHRConfig,
          ...(user.hrSettings?.config || {})
        },
        updatedAt: user.hrSettings?.updatedAt || null
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHRSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('role hrSettings');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!['hr', 'admin', 'staff', 'recruiter'].includes(String(user.role || '').toLowerCase())) {
      return res.status(403).json({ success: false, message: 'Not authorized to update HR settings' });
    }

    const incomingTheme = ['light', 'dark', 'system'].includes(req.body?.theme)
      ? req.body.theme
      : (user.hrSettings?.theme || 'system');

    const incomingConfig = (req.body?.config && typeof req.body.config === 'object')
      ? req.body.config
      : {};

    user.hrSettings = {
      theme: incomingTheme,
      config: {
        ...defaultHRConfig,
        ...(user.hrSettings?.config || {}),
        ...incomingConfig
      },
      updatedAt: new Date()
    };

    await user.save();

    return res.json({
      success: true,
      message: 'HR settings updated successfully',
      data: {
        theme: user.hrSettings.theme,
        config: user.hrSettings.config,
        updatedAt: user.hrSettings.updatedAt
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaffStats = async (req, res) => {
  try {
    const [totalStudents, verifiedProfiles, resumesPending, interviewsScheduled, studentsPlaced, activeJobs, placements, studentDocs] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ cgpa: { $gte: 7 } }),
      Student.countDocuments({ $or: [{ resumeDraft: null }, { resumeDraft: { $exists: false } }] }),
      Interview.countDocuments(),
      PlacementResult.countDocuments({ status: { $in: ['offered', 'accepted'] } }),
      Job.countDocuments({ status: 'active' }),
      PlacementResult.find().select('companyName').lean(),
      Student.find().select('attendance attendancePercentage').lean()
    ]);

    const averageAttendance = averageNumber(studentDocs.map((student) => Number(student?.attendance || student?.attendancePercentage)));
    const companies = new Set(placements.map((placement) => placement?.companyName).filter(Boolean)).size;

    const stats = {
      totalStudents,
      verifiedProfiles,
      resumesPending,
      interviewsScheduled,
      studentsPlaced,
      averageAttendance,
      classes: activeJobs,
      companies,
      performance: Math.min(100, Math.max(0, Math.round(averageAttendance - resumesPending))),
      analytics: studentsPlaced
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkills = (req, res) => {
  try {
    const skills = [
      { name: 'Java', level: 'Advanced', proficiency: 90, certifications: ['Oracle Java Associate'] },
      { name: 'Python', level: 'Intermediate', proficiency: 75, certifications: ['Google Python'] },
      { name: 'SQL', level: 'Advanced', proficiency: 88, certifications: ['MySQL Certified'] },
      { name: 'React', level: 'Beginner', proficiency: 65, certifications: [] },
      { name: 'AWS', level: 'Intermediate', proficiency: 72, certifications: ['AWS Associate'] }
    ];

    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCertifications = (req, res) => {
  try {
    const certifications = [
      { id: 1, name: 'Oracle Java Associate', issuer: 'Oracle', date: '2024-06-15', status: 'Verified' },
      { id: 2, name: 'Google Cloud Professional', issuer: 'Google', date: '2024-07-20', status: 'Verified' },
      { id: 3, name: 'AWS Certified Solutions Architect', issuer: 'AWS', date: '2024-05-10', status: 'Verified' },
      { id: 4, name: 'Microsoft Azure Fundamentals', issuer: 'Microsoft', date: '2024-08-05', status: 'Verified' },
      { id: 5, name: 'CompTIA Security+', issuer: 'CompTIA', date: '2024-09-12', status: 'Pending' }
    ];

    res.json({ success: true, data: certifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = (req, res) => {
  try {
    const applications = [
      { id: 1, company: 'Google', role: 'SDE', status: 'Interview', date: '20 Sep', salary: '32 LPA', location: 'Bangalore', appliedDate: 'Sep 10' },
      { id: 2, company: 'Amazon', role: 'SDE-1', status: 'Shortlisted', date: '22 Sep', salary: '28 LPA', location: 'Hyderabad', appliedDate: 'Sep 12' },
      { id: 3, company: 'Infosys', role: 'System Engineer', status: 'Offer', date: '24 Sep', salary: '18 LPA', location: 'Pune', appliedDate: 'Sep 5' },
      { id: 4, company: 'TechCorp', role: 'Junior Developer', status: 'Applied', date: '26 Sep', salary: '20 LPA', location: 'Mumbai', appliedDate: 'Sep 15' },
      { id: 5, company: 'Microsoft', role: 'SDE', status: 'Interview', date: '28 Sep', salary: '44 LPA', location: 'Bangalore', appliedDate: 'Sep 8' }
    ];

    res.json({ success: true, data: applications, count: applications.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInterviews = (req, res) => {
  try {
    const interviews = [
      { id: 1, company: 'Google', role: 'SDE-1', date: '18 Sep', status: 'Live', time: '10:00 AM', hrName: 'Priya Sharma' },
      { id: 2, company: 'Microsoft', role: 'Software Engineer', date: '25 Sep', status: 'Upcoming', time: '2:30 PM', hrName: 'Rahul Verma', videoLink: null },
      { id: 3, company: 'Amazon', role: 'SDE-1', date: '01 Oct', status: 'Scheduled', time: '11:00 AM', hrName: 'Neha Singh' }
    ];

    res.json({ success: true, data: interviews, count: interviews.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const [user, student] = await Promise.all([
      User.findById(userId).select('name email phone avatar role').lean(),
      Student.findOne({ user: userId }).select('branch cgpa phoneNumber').lean()
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const profile = {
      id: user._id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || student?.phoneNumber || '',
      avatar: user.avatar || '',
      role: user.role,
      branch: student?.branch || '',
      cgpa: student?.cgpa ?? null
    };

    res.json({ success: true, user: profile, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    const userData = user.toObject();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userData,
      data: userData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getClasses = (req, res) => {
  try {
    const classes = [
      { id: 1, name: 'Advanced Algorithms', status: 'Active', time: '10:00 AM - 11:30 AM', instructor: 'Dr. Smith', room: '101', attendance: 95 },
      { id: 2, name: 'Web Development', status: 'Active', time: '12:00 PM - 1:30 PM', instructor: 'Prof. Johnson', room: '204', attendance: 88 },
      { id: 3, name: 'Database Management', status: 'Upcoming', time: '2:00 PM - 3:30 PM', instructor: 'Dr. Williams', room: '305', attendance: 92 }
    ];

    res.json({ success: true, data: classes, count: classes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanies = (req, res) => {
  try {
    const companies = [
      { id: 1, name: 'Google', openJobs: 5, location: 'Bangalore', salary: '32 LPA', status: 'Hiring' },
      { id: 2, name: 'Microsoft', openJobs: 8, location: 'Hyderabad', salary: '44 LPA', status: 'Hiring' },
      { id: 3, name: 'Amazon', openJobs: 12, location: 'Bangalore', salary: '28 LPA', status: 'Hiring' },
      { id: 4, name: 'Apple', openJobs: 3, location: 'Bangalore', salary: '38 LPA', status: 'Hiring' },
      { id: 5, name: 'Meta', openJobs: 6, location: 'Mumbai', salary: '35 LPA', status: 'Active' }
    ];

    res.json({ success: true, data: companies, count: companies.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import PlacementStatistics from '../models/PlacementStatistics.js';

export const getAnalytics = async (req, res) => {
  try {
    const [analyticsDoc, totalStudents, activeJobs, applications, interviews, placements] = await Promise.all([
      PlacementStatistics.findOne({}, {}, { sort: { year: -1, createdAt: -1 } }).lean(),
      Student.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.find().select('status job createdAt').populate('job', 'company position').lean(),
      Interview.find().select('scheduledDate result createdAt').lean(),
      PlacementResult.find().select('status ctc companyName createdAt').lean()
    ]);

    const completedPlacements = countByStatuses(placements, ['offered', 'accepted']);
    const placementRate = totalStudents ? Number(((completedPlacements / totalStudents) * 100).toFixed(1)) : 0;
    const avgPackage = averageNumber(placements.map((placement) => parsePackageValue(placement?.ctc)));
    const companies = new Set([
      ...applications.map((application) => application?.job?.company).filter(Boolean),
      ...placements.map((placement) => placement?.companyName).filter(Boolean)
    ]).size;

    const analytics = {
      ...(analyticsDoc || {}),
      placementRate,
      averagePackage: analyticsDoc?.averagePackage ?? avgPackage,
      totalStudentsPlaced: completedPlacements,
      totalStudents,
      activeJobs,
      applicationsReceived: applications.length,
      interviewsScheduled: interviews.length,
      companiesRegistered: companies,
      updatedAt: new Date().toISOString()
    };

    res.json({ success: true, data: analytics, analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
