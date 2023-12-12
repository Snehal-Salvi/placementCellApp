// interview schema
import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  result: {
    type: String,
    enum: ['On Hold', 'Selected', 'Pending', 'Not Selected', 'Did not Attempt'],
  },
});

const InterviewModel = mongoose.model('Interview', interviewSchema);

export default InterviewModel;
