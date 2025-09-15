import Resume from "../models/resumeModal.js";
import fs from "fs";
import path from "path";

export const createResume = async (req, res) => {
  try {
    const { title } = req.body;

    // Default data
    const defaultResumeData = {
      profileInfo: {
        profileImg: null,
        previewUrl: "",
        fullName: "",
        designation: "",
        summary: "",
      },
      contactInfo: {
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
      },
      workExperience: [
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
      education: [
        {
          degree: "",
          institution: "",
          startDate: "",
          endDate: "",
        },
      ],
      skills: [
        {
          name: "",
          progress: 0,
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          github: "",
          liveDemo: "",
        },
      ],
      certifications: [
        {
          title: "",
          issuer: "",
          year: "",
        },
      ],
      languages: [
        {
          name: "",
          progress: "",
        },
      ],
      interests: [""],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body,
    });
    return res.status(201).json(newResume);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create resume", error: err.message });
  }
};

export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });
    return res.status(200).json(resumes);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get resumes", error: err.message });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user_id,
    });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    return res.json(resume);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get resume", error: err.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume)
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });

    // Merge updated resume
    Object.assign(resume, req.body);
    const savedResume = await resume.save();
    return res.status(200).json(savedResume);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update resume", error: err.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!resume)
      return res
        .status(404)
        .json({ message: "Resume not found or not authorized" });

    // Create a uploads folder and store the resume there
    const uploadsFolder = path.join(process.cwd(), "uploads");

    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(
        uploadsFolder,
        path.basename(resume.thumbnailLink)
      );
      if (fs.existsSync(oldThumbnail)) {
        fs.unlinkSync(oldThumbnail);
      }
    }

    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.join(
        uploadsFolder,
        path.basename(resume.profileInfo.profilePreviewUrl)
      );
      if (fs.existsSync(oldProfile)) {
        fs.unlinkSynca(oldProfile);
      }
    }

    // Delete resume doc
    const deleted = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!deleted)
      return res
        .status(404)
        .json({ message: "Resume not found or you are not authorized" });

    return res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete resume", error: err.message });
  }
};
