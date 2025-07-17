import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'STATUS_CHANGE'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
}, { timestamps: true });

export const ActionLog = mongoose.model('ActionLog', actionLogSchema);