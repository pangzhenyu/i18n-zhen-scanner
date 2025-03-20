import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Hindi',
  'Turkish',
  'Dutch',
  'Swedish'
];

// Mock translations for build/deployment without API key
const getMockTranslations = (keyword: string) => {
  const mockData = {
    translations: [
      { language: "English", translation: keyword },
      { language: "Spanish", translation: keyword + "es" },
      { language: "French", translation: keyword + "fr" },
      { language: "German", translation: keyword + "de" },
      { language: "Italian", translation: keyword + "it" }
    ]
  };
  return mockData;
};

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json();

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    // Check if we're in a test/build environment with dummy API key
    const apiKey = process.env.OPENAI_API_KEY || '';
    if (!apiKey || apiKey === 'dummy-key-replace-in-production') {
      console.log('Using mock translation data because API key is not available');
      return NextResponse.json(getMockTranslations(keyword));
    }

    // Use GPT-4o mini to translate the keyword
    const prompt = `Translate the keyword "${keyword}" into the following languages.
    For each translation, provide ONLY the translated word in ASCII format
    (transliterate non-Latin scripts).

    ${LANGUAGES.join(', ')}

    Return the results as a JSON array of objects with 'language' and 'translation' keys.
    Make sure all translations use only ASCII characters that are valid for domain names.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful translator that only responds with valid JSON. Make sure Japanese, Chinese, Korean, Russian, Arabic and other non-Latin scripts are transliterated to ASCII.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    // Parse the response to get the translations
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    let translations;
    try {
      const parsedContent = JSON.parse(content);
      translations = parsedContent.translations || [];
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error);
      throw new Error('Failed to parse translation response');
    }

    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to translate keyword' },
      { status: 500 }
    );
  }
}
