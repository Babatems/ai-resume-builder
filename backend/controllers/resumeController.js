import Resume from '../models/Resume.js';
import User from '../models/User.js';
import { callMistralAPI, aiConfig } from '../config/ai.js';

export const uploadResume = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'Resume file required',
      });
    }

    // Create resume document
    const resume = new Resume({
      user: req.user.userId,
      name: name || file.originalname,
      originalContent: file.buffer.toString('utf8'),
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype.includes('pdf') ? 'pdf' : 'txt',
    });

    await resume.save();

    // Add to user's resumes
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { resumes: resume._id },
    });

    res.status(201).json({
      success: true,
      resume: {
        id: resume._id,
        name: resume.name,
        uploadedAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Error uploading resume',
    });
  }
};

export const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.userId });

    res.json({
      success: true,
      resumes: resumes.map((r) => ({
        id: r._id,
        name: r.name,
        uploadedAt: r.createdAt,
        versions: r.versions.length,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching resumes',
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume || resume.user.toString() !== req.user.userId) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    res.json({
      success: true,
      resume: {
        id: resume._id,
        name: resume.name,
        content: resume.originalContent,
        versions: resume.versions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching resume',
    });
  }
};

export const optimizeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Resume ID and job description required',
      });
    }

    // Get resume
    const resume = await Resume.findById(resumeId);
    if (!resume || resume.user.toString() !== req.user.userId) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    // Call AI to optimize
    const prompt = aiConfig.optimizationPrompt(
      resume.originalContent,
      jobDescription
    );

    const optimizedContent = await callMistralAPI(prompt);

    // Extract keywords
    const keywordPrompt = aiConfig.analysisPrompt(jobDescription);
    const analysisResult = await callMistralAPI(keywordPrompt);

    // Parse keywords from AI response
    let keywords = [];
    try {
      const parsed = JSON.parse(analysisResult);
      keywords = [
        ...(parsed.keySkills || []),
        ...(parsed.technologies || []),
      ];
    } catch (e) {
      keywords = jobDescription
        .match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g)
        ?.slice(0, 10) || [];
    }

    // Add version to resume
    const newVersion = {
      name: `Optimized - ${new Date().toLocaleDateString()}`,
      content: optimizedContent,
      jobDescription,
      keywords,
      optimizedAt: new Date(),
      matchScore: 85, // Placeholder
    };

    resume.versions.push(newVersion);
    await resume.save();

    res.json({
      success: true,
      optimizedResume: {
        id: resume._id,
        content: optimizedContent,
        version: newVersion,
        keywords,
      },
    });
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({
      success: false,
      error: 'Error optimizing resume',
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume || resume.user.toString() !== req.user.userId) {
      return res.status(404).json({
        success: false,
        error: 'Resume not found',
      });
    }

    await Resume.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { resumes: req.params.id },
    });

    res.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting resume',
    });
  }
};

export default {
  uploadResume,
  getAllResumes,
  getResume,
  optimizeResume,
  deleteResume,
};
