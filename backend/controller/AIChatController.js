import { GoogleGenAI } from '@google/genai';
import ApiResponse from '../utils/apiResponse.js';
import dotenv from 'dotenv';

// Ensure dotenv loads BEFORE initializing the client
dotenv.config();
const ai=new GoogleGenAI({apiKey: process.env.AI_API});

async function AIAnalysis(req,res) {
  try {
   const {prompt,tasks}=req.body;
   const userId=req.user._id;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // fast and perfect for text/summaries
      contents: process.env.AI_PROMPT + prompt+tasks,
    });
    const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (aiText) {
      return res.status(200).json(
        new ApiResponse(200, "Success", null, aiText)
      )}
    else{
      console.log("response",response);
      return res.status(500).json(
        new ApiResponse(500, "Failed", "No response from AI")
      );
    }
  } catch (error) {
   
    return res.status(500).json(
      new ApiResponse(500, "Failed", "Internal Server Error", error.message)
    );
  }
}




export default AIAnalysis;