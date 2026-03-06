import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    originalContent: {
      type: String,
      required: true,
    },
    fileUrl: String,
    fileType: {
      type: String,
      enum: ['pdf', 'docx', 'txt'],
    },
    versions: [
      {
        name: String,
        content: String,
        jobDescription: String,
        keywords: [String],
        optimizedAt: Date,
        matchScore: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Resume', ResumeSchema);
