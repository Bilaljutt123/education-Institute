
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

async function testGemini() {
  const key = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(key);

  const modelName = "gemini-flash-latest"; // Found in list
  console.log(`Attempting to connect with model: ${modelName}`);
  
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log('Response:', response.text());
    console.log(`✅ ${modelName} works!`);
  } catch (error) {
    console.error(`❌ ${modelName} failed:`, error.message);
  }
}

testGemini();
