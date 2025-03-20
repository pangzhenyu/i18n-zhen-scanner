import OpenAI from 'openai';

// Initialize the OpenAI client with a more robust approach
// We'll provide a fallback that will be replaced at runtime
const apiKey = process.env.OPENAI_API_KEY || 'dummy-key-replace-in-production';

const openai = new OpenAI({
  apiKey: apiKey,
});

export default openai;
