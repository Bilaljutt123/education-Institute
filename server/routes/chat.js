
import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import Department from '../models/Department.js';

dotenv.config();

const router = express.Router();

let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY) {
     genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
     // Updated to a currently verified available model
     model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  } else {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
  }
} catch (error) {
  console.error("Error initializing Gemini AI:", error);
}

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Convert history format if necessary or start fresh chat
    // Gemini chat.sendMessage takes history. 
    // For simplicity, we can just send the prompt or use startChat if we want context.
    // Let's use startChat for context if history is provided.
    
    // History format expected by Gemini:
    // { role: "user" | "model", parts: [{ text: "..." }] }
    
    let chat;
    if (history && Array.isArray(history)) {
       const formattedHistory = history.map(msg => ({
         role: msg.role === 'user' ? 'user' : 'model',
         parts: [{ text: msg.content }]
       }));
       chat = model.startChat({
         history: formattedHistory,
       });
    } else {
        chat = model.startChat({
            history: [],
        });
    }

    // Fetch dynamic data from database
    const departments = await Department.find({}, 'name description code');
    const courses = await Course.find({}, 'title description code level').populate('department', 'name');

    const contextData = JSON.stringify({ 
      departments: departments.map(d => ({ name: d.name, code: d.code, description: d.description })),
      courses: courses.map(c => ({ 
        title: c.title, 
        code: c.code, 
        level: c.level, 
        department: c.department ? c.department.name : 'Unknown',
        description: c.description 
      }))
    });

    const systemContext = `
      You are an AI assistant for this Education Institute.
      
      Your goal is to assist students with:
      1. Information about available courses and departments (using the provided database records).
      2. Navigating the website and the application process.

      WEBSITE GUIDE:
      - **Getting Started**: Users must first "Register" an account and then "Login".
      - **Profile**: After logging in, students must strictly complete their "Student Profile" before they can do anything else. This includes personal details and educational background.
      - **How to Apply**: verification of the profile allows access to the "Apply for Course" page. Select a course from the list and submit.
      - **Dashboard**: Use the dashboard to view application status, enrolled courses, and grades.
      - **My Courses**: Once an application is accepted, the course appears in "My Courses".

      INSTITUTE DATA (Courses & Departments):
      ${contextData}

      INSTRUCTIONS:
      - Answer questions based on the "WEBSITE GUIDE" and "INSTITUTE DATA" above.
      - If a user asks "how to apply", explain the steps: Login -> Complete Profile -> Go to Apply Page.
      - If the user asks about something completely unrelated (e.g., "how to cook pasta", "who is the president"), politiely decline and say you can only help with institute-related queries.
      - Be helpful, professional, and concise.
    `;

    // Prepend context to the latest message.
    // We send this combined prompt to the model, but the client only sees/saves their original short message.
    // Since the server is stateless regarding the full history object (it relies on client sending it),
    // injecting context every time ensures the model always has it.
    const fullPrompt = `${systemContext}\n\nUser Question: ${message}`;

    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });

  } catch (error) {
    console.error("Error in chat route:", error);
    res.status(500).json({ error: "Failed to process chat request" });
  }
});

export default router;
