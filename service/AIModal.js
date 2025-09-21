// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI } from '@google/genai';
// In the browser, avoid using Node-only modules like 'fs' or 'Buffer'.
// Also, prefer using import.meta.env for environment variables with Vite.
const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;

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

// Export a simple function to send a text prompt and get a text response
export async function sendMessage(prompt) {
  if (!apiKey) {
    console.error('Missing API key. Please set VITE_GOOGLE_AI_API_KEY in your environment.');
    return '';
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use a widely available text model. If your project still sees quota 0, enable billing.
    const model = 'gemini-1.5-flash';
    const contents = [
      { role: 'user', parts: [{ text: String(prompt ?? '') }] },
    ];
    // Request to the AI model for generating content
    const result = await ai.models.generateContent({ model, contents });

    // Assuming the result is returned as JSON, we directly extract the text from it
    const text = extractText(result?.response ?? result);
    return text;
  } catch (err) {
    // Provide clearer messaging for quota/429 errors
    const message = (() => {
      try {
        const raw = typeof err === 'string' ? err : (err?.message || '');
        if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429') || raw.includes('quota')) {
          // Try to extract suggested retry delay from structured error
          const retryMatch = raw.match(/Retry.*?(\d+\.?\d*)s/i);
          const retryIn = retryMatch ? `${retryMatch[1]}s` : '';
          return `Quota exceeded or rate limited. ${retryIn ? `Please retry in ~${retryIn}. ` : ''}Check your plan and billing: https://ai.google.dev/gemini-api/docs/rate-limits`;
        }
        return raw || 'Unknown error';
      } catch { return 'Error generating content'; }
    })();
    console.error('Error generating content:', err);
    throw new Error(message);
  }
}
