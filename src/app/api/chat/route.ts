import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, isRealEstateRelated } from '@/utils/chatPrompts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Pre-check if the message is real estate related
    if (!isRealEstateRelated(message)) {
      return NextResponse.json({ 
        response: "Thank you for reaching out! I'm RealityCanvas Assistant, and I'm specifically designed to help with real estate matters. I'd be happy to assist you with property searches, buying/selling guidance, investment advice, market insights, or any questions about our platform. What real estate topic can I help you with today? 🏠"
      });
    }

    // Build conversation context
    let conversationContext = SYSTEM_PROMPT;
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext += '\n\nPrevious conversation:\n';
      conversationHistory.slice(-6).forEach((msg: any) => {
        conversationContext += `${msg.role}: ${msg.content}\n`;
      });
    }
    
    conversationContext += `\nUser: ${message}\nAssistant:`;

    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Sorry, I encountered an error. Please try again.' },
      { status: 500 }
    );
  }
}