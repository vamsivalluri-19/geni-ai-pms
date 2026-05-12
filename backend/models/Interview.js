import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  round: {
    type: String,
    enum: ['online-test', 'technical', 'hr', 'final'],
    required: true
  },
  scheduledDate: Date,
    date: String,
    startTime: String,
    endTime: String,
    location: String,
    type: {
      type: String,
      enum: ['Virtual', 'In-person'],
      default: 'Virtual'
    },
    interviewer: String,
  // meetingLink removed; will use roomId for WebRTC
    roomId: {
      type: String,
      required: true
    },
  result: {
    type: String,
    enum: ['pending', 'passed', 'failed'],
    default: 'pending'
  },
  feedback: String,
  notes: String,
  recordingUrl: String,
  panel: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Interview', interviewSchema);
