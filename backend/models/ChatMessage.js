import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.role === 'user'; }
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  attachment: {
    url: String, // File or image URL
    type: {
      type: String,
      enum: ['file', 'image', null],
      default: null
    },
    name: String // Original filename
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ChatMessage', chatMessageSchema);