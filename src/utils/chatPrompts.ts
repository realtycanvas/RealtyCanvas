export const REAL_ESTATE_TOPICS = [
  'property buying and selling',
  'real estate investment',
  'home buying process',
  'property types (residential, commercial)',
  'real estate market trends',
  'property features and amenities',
  'location and neighborhood information',
  'property financing and mortgages',
  'property management',
  'RealityCanvas platform features',
  'property valuation',
  'real estate legal advice',
  'rental properties',
  'property inspection',
  'real estate agents',
  'property taxes',
  'home insurance',
  'property maintenance'
];

export const SYSTEM_PROMPT = `You are RealityCanvas Assistant, a helpful AI chatbot for a premium real estate platform called "RealityCanvas". 

ABOUT REALITYCANVAS:
- A modern real estate platform for buying, selling, and renting properties
- Features property search, advanced filters, virtual tours, and expert consultations
- Serves customers across India with residential and commercial properties
- Offers verified listings, legal documentation support, and financing assistance

YOUR ROLE & CAPABILITIES:
You should ONLY answer questions related to:
${REAL_ESTATE_TOPICS.map(topic => `• ${topic}`).join('\n')}

RESPONSE GUIDELINES:
- Be professional, helpful, and knowledgeable about real estate
- Keep responses concise but informative (2-4 sentences typical)
- Always prioritize user safety and legal compliance
- Suggest contacting RealityCanvas experts for complex legal/financial advice
- Mention relevant RealityCanvas features when appropriate

RESTRICTIONS:
- NEVER answer questions unrelated to real estate or property
- Don't provide personal advice outside real estate scope
- Don't discuss other industries, entertainment, personal life, etc.
- If asked about unrelated topics, politely redirect with:
  "Thank you for reaching out! I'm RealityCanvas Assistant, and I'm specifically designed to help with real estate matters. I'd be happy to assist you with property searches, buying/selling guidance, investment advice, market insights, or any questions about our platform. What real estate topic can I help you with today? 🏠"

EXAMPLE TOPICS TO HELP WITH:
- "How do I find properties in Mumbai under 2 crores?"
- "What documents do I need for buying a house?"
- "How does property investment work?"
- "What are the current market trends?"
- "How can I list my property on RealityCanvas?"`;

export const QUICK_SUGGESTIONS = [
  'How do I search for properties?',
  'What documents do I need to buy a house?',
  'Tell me about property investment',
  'How do I list my property?',
  'What are current market trends?',
  'Help me understand home loans'
];

export function isRealEstateRelated(message: string): boolean {
  const realEstateKeywords = [
    'property', 'house', 'home', 'apartment', 'villa', 'flat', 'plot',
    'buy', 'sell', 'rent', 'lease', 'investment', 'mortgage', 'loan',
    'real estate', 'realtor', 'agent', 'broker', 'market', 'price',
    'location', 'neighborhood', 'area', 'sqft', 'bedroom', 'bathroom',
    'commercial', 'residential', 'office', 'shop', 'warehouse',
    'realitycanvas', 'platform', 'listing', 'search', 'filter',
    'buying', 'selling', 'renting', 'financing', 'documentation',
    'legal', 'registration', 'transfer', 'possession', 'owner',
    'tenant', 'landlord', 'deposit', 'emi', 'down payment',
    'crore', 'lakh', 'builders', 'construction', 'amenities'
  ];

  const messageLower = message.toLowerCase();
  
  // Check for common non-real estate patterns first
  const nonRealEstatePatterns = [
    'weather', 'movie', 'music', 'sports', 'food', 'recipe',
    'celebrity', 'entertainment', 'game', 'politics', 'news',
    'personal', 'relationship', 'health', 'medical', 'education',
    'technology', 'programming', 'software', 'travel', 'vacation'
  ];
  
  // If it clearly contains non-real estate terms, reject it
  if (nonRealEstatePatterns.some(pattern => messageLower.includes(pattern))) {
    return false;
  }
  
  // If it contains real estate keywords, allow it
  return realEstateKeywords.some(keyword => messageLower.includes(keyword));
}