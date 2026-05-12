import express from "express";

import {
  chat,
  generateResumeMatch,
  generateInterviewQuestions,
  generateReadinessPlan,
  generateOutreachDraft,
  generateRiskPrediction,
  parseJobDescription,
  reviewApplication,
  generateAnalyticsNarrative,
  knowledgeBaseAnswer,
  studentChatbot
} from "../controllers/aiController.js";
import upload from "../middleware/multerConfig.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Router();
// Student chatbot endpoint: answers placement FAQs and guides students
router.post("/student-chatbot", studentChatbot);

// Chat endpoint: supports file/image upload without forcing authentication for guest access
router.post("/chat", upload.single("attachment"), chat);
router.post("/resume-match", generateResumeMatch);
router.post("/interview-questions", generateInterviewQuestions);
router.post("/readiness-plan", generateReadinessPlan);
router.post("/outreach-draft", generateOutreachDraft);
router.post("/risk-prediction", generateRiskPrediction);
router.post("/jd-parse", parseJobDescription);
router.post("/application-review", reviewApplication);
router.post("/analytics-narrative", generateAnalyticsNarrative);
router.post("/knowledge-base", knowledgeBaseAnswer);

export default router;