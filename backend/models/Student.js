import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rollNumber: {
    type: String,
    unique: true,
    required: true
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'Civil', 'IT'],
    required: true
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  semester: {
    type: String,
    trim: true
  },
  section: {
    type: String,
    trim: true
  },
  phoneNumber: String,
  avatar: String,
    assignedExams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewExam'
    }],
    certifications: [{
      name: String,
      issuer: String,
      date: Date,
      credentialId: String,
      url: String,
      source: {
        type: String,
        enum: ['student', 'staff'],
        default: 'student'
      },
      certificateFile: String,
      status: String
    }],
    achievements: [{
      title: String,
      description: String,
      date: Date
    }],
    socialLinks: {
      linkedIn: String,
      github: String,
      website: String
    },
    portfolioFiles: [String],
  resumeDraft: {
      resumeReviewed: {
        type: Boolean,
        default: false
      },
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  resumeTemplateId: {
    type: Number,
    default: null
  },
  skills: [String],
  projects: [{
    title: String,
    description: String,
    link: String
  }],
  isPlaced: {
    type: Boolean,
    default: false
  },
  placedAt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  // CSV Data Fields
  atsScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },
  age: Number,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  degree: {
    type: String,
    enum: ['B.Tech', 'B.Sc', 'BCA', 'MCA', 'M.Tech', 'M.Sc']
  },
  internships: Number,
  codingSkills: Number,
  communicationSkills: Number,
  aptitudeTestScore: Number,
  softSkillsRating: Number,
  certificationCount: Number,
  backlogs: {
    type: Number,
    default: 0
  },
  placementStatus: {
    type: String,
    enum: ['Placed', 'Not Placed', 'In Process']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Student', studentSchema);
