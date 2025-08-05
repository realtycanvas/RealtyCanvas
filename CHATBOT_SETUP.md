# RealityCanvas AI Chatbot Setup Guide

## Overview
Your RealityCanvas app now includes a sophisticated AI chatbot powered by Google's Gemini API that specializes in real estate assistance.

## 🔧 Environment Setup

### 1. Add Gemini API Key
Add the following to your `.env` file:

```env
# Google Gemini AI API Key
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 2. Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env` file

## 🤖 Chatbot Features

### ✅ **Topic Restrictions**
The chatbot is specifically designed to only answer real estate related questions:
- Property buying, selling, renting
- Real estate investment advice
- Home buying process
- Property types and features
- Market trends and insights
- RealityCanvas platform features
- Property financing and mortgages
- Location and neighborhood information

### 🚫 **Off-Topic Protection**
If users ask non-real estate questions, the bot will politely redirect them back to real estate topics.

### 🎨 **Brand Integration**
- Uses your brand colors (#feb711, #14314b)
- Matches your app's design system
- Dark/light theme support
- Smooth animations and transitions

### 📱 **User Experience**
- **Floating Button**: Positioned bottom-right with pulse animation
- **Quick Suggestions**: Pre-built questions for easy start
- **Conversation Memory**: Remembers context within conversation
- **Typing Indicators**: Shows when AI is responding
- **Clear Chat**: Reset conversation option
- **Responsive Design**: Works on all screen sizes

## 🔧 Customization Options

### Modify Topics
Edit `src/utils/chatPrompts.ts` to:
- Add new real estate topics
- Modify the system prompt
- Update quick suggestions
- Change topic validation logic

### Styling Changes
Customize appearance in:
- `src/components/Chatbot.tsx` - Component structure
- `src/app/globals.css` - Animation styles
- Tailwind classes for colors and spacing

### API Configuration
Modify `src/app/api/chat/route.ts` to:
- Change Gemini model version
- Adjust conversation history length
- Add additional validation
- Modify response formatting

## 🎯 Usage Examples

The chatbot can help users with questions like:
- "How do I search for properties under 2 crores?"
- "What documents do I need to buy a house?"
- "Tell me about real estate investment strategies"
- "How does the RealityCanvas platform work?"
- "What are the current market trends?"

## 🛡️ Security & Limits

- API key is securely stored in environment variables
- Conversation history is limited to prevent token overflow
- Input validation prevents malicious requests
- Rate limiting can be added at API route level

## 📊 Monitoring

Consider adding:
- Usage analytics
- Error tracking
- User feedback collection
- Conversation quality metrics

## 🚀 Deployment Notes

1. Ensure `GEMINI_API_KEY` is set in production environment
2. Consider implementing rate limiting for production use
3. Monitor API usage and costs
4. Add error boundary components for better error handling

Your RealityCanvas chatbot is now ready to assist users with all their real estate needs! 🏠✨