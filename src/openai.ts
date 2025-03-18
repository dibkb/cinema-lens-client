import OpenAI from "openai";

// Initialize the OpenAI client with your API key
export const openai = new OpenAI({
  // Use environment variables from your build system instead
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true, // Only use this for client-side usage
});
