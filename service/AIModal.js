// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from '@google/genai';
// In the browser, avoid using Node-only modules like 'fs' or 'Buffer'.
// Also, prefer using import.meta.env for environment variables with Vite.
const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

// Mock AI responses for development/testing
const mockResponses = {
  'resume summary': `[
    {
      "ExperienceLevel": "Fresher",
      "summery": "Recent graduate with strong academic foundation and hands-on project experience. Eager to apply theoretical knowledge in a professional setting and contribute to team success through innovative thinking and continuous learning."
    },
    {
      "ExperienceLevel": "Mid Level", 
      "summery": "Experienced professional with 3-5 years of industry expertise and proven track record of delivering quality results. Skilled in problem-solving, team collaboration, and adapting to new technologies while maintaining high standards of work."
    },
    {
      "ExperienceLevel": "Experienced",
      "summery": "Senior-level professional with 5+ years of comprehensive experience leading projects and mentoring teams. Demonstrated expertise in strategic planning, complex problem-solving, and driving organizational growth through innovative solutions and leadership excellence."
    }
  ]`
};

// Function to generate mock AI response
function generateMockResponse(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('resume') && lowerPrompt.includes('summary')) {
    return mockResponses['resume summary'];
  }
  
  // Generic mock response
  return `[
    {
      "ExperienceLevel": "Fresher",
      "summery": "Enthusiastic entry-level professional ready to contribute fresh perspectives and learn from experienced team members. Strong foundation in relevant skills and eager to grow in a dynamic work environment."
    },
    {
      "ExperienceLevel": "Mid Level",
      "summery": "Skilled professional with solid experience in the field, capable of handling complex tasks independently while contributing to team objectives. Proven ability to adapt and deliver consistent results."
    },
    {
      "ExperienceLevel": "Experienced", 
      "summery": "Senior professional with extensive experience and deep expertise in the field. Proven leadership capabilities and track record of successful project delivery and team management."
    }
  ]`;
}

// Function to try newer Gemini models
async function tryNewerGeminiModels(prompt) {
  const newerModels = [
    'gemini-2.0-flash-exp',
    'gemini-2.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro-002'
  ];

  for (const modelName of newerModels) {
    try {
      console.log(`Trying newer model: ${modelName}`);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = extractText(data);
        if (text) {
          console.log(`Successfully used newer model: ${modelName}`);
          return text;
        }
      } else {
        console.warn(`Newer model ${modelName} failed with status: ${response.status}`);
      }
    } catch (err) {
      console.warn(`Newer model ${modelName} failed:`, err.message);
      continue;
    }
  }
  
  return null;
}

// Helper to safely extract text from various possible response shapes
function extractText(response) {
  try {
    // If response is a JSON object and contains a direct text property
    if (response && typeof response === 'object') {
      // For a standard response with text or output_text
      if (response.text) {
        return response.text;
      }
      if (response.output_text) {
        return response.output_text;
      }

      // Look for candidates -> content -> parts -> text
      const candidates = response?.candidates || response?.response?.candidates;
      if (Array.isArray(candidates) && candidates.length > 0) {
        const parts = candidates[0]?.content?.parts || [];
        const textPart = parts.find(p => typeof p.text === 'string');
        if (textPart) return textPart.text;
      }
    }
  } catch (e) {
    console.error('Error extracting text from response:', e);
  }
  return '';
}

// Function to list available models
export async function listAvailableModels() {
  if (!apiKey) {
    console.error('Missing API key. Please set VITE_GOOGLE_AI_API_KEY in your environment.');
    return [];
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const models = await ai.models.list();
    return models;
  } catch (err) {
    console.error('Error listing models:', err);
    return [];
  }
}

// Export a simple function to send a text prompt and get a text response
export async function sendMessage(prompt) {
  console.log('🤖 AI Request:', prompt);

  // First, try newer Gemini models if API key is available
  if (apiKey) {
    try {
      console.log('Trying newer Gemini models...');
      const newerModelResult = await tryNewerGeminiModels(prompt);
      if (newerModelResult) {
        return newerModelResult;
      }
    } catch (err) {
      console.warn('Newer models failed:', err.message);
    }
  }

  // If no API key or newer models failed, use mock responses
  console.log('Using mock AI response for development...');
  const mockResponse = generateMockResponse(prompt);
  
  // Add a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('✅ Mock AI response generated');
  return mockResponse;
}
