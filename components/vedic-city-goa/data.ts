// Content for the /vedic-city-goa landing page. Ported from the original
// static build; copy is unchanged apart from Realty Canvas contact details.

export const VEDIC = {
  name: 'Vedic City Goa',
  tagline: '46-acre villa plot development · 20 mins from MOPA Airport',
  phoneDisplay: '+91 95555 62626',
  phoneHref: '+919555562626',
  whatsappNumber: '919555562626',
  whatsappText: 'Hi, I am interested in knowing more about Vedic City, North Goa. Please connect with me.',
  // Sent with every lead so these can be filtered out of the normal pipeline.
  lead: {
    projectSlug: 'vedic-city-goa',
    projectTitle: 'Vedic City Goa',
    sourcePath: '/vedic-city-goa',
    propertyType: 'RESIDENTIAL' as const,
    city: 'North Goa',
    state: 'Goa',
  },
} as const;

export const NAV_LINKS = [
  { href: '#overview', label: 'Overview' },
  { href: '#highlights', label: 'Highlight' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#book-site-visit', label: 'Site Plans' },
  { href: '#price-list', label: 'Price List' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#location', label: 'Location' },
  { href: '#contact-us', label: 'Contact Us' },
];

export const HERO = {
  eyebrow: 'Premium Villa Plots, 20 Minutes from MOPA.',
  title: 'VEDIC CITY GOA',
  connectivity: 'NH-66 Highway Connectivity',
  highlights: ['300+ Acre Township', 'Plots from 240 Sq. Yd.'],
  price: { amount: '₹58 Lakh', suffix: 'Onwards' },
};

export const OVERVIEW = {
  kicker: 'Overview',
  heading: 'Why Choose Anandam by Vedic City Goa?',
  // Split so the project name can carry the lead as bold, matching the reference.
  leadStrong: 'Vedic City Anandam North Goa',
  lead: ' is a 46-acre villa plot development within the 300-acre Vedic City township - low-density plotted living, Vedic-inspired planning, and premium amenities designed for families and investors who want land in North Goa with long-term value.',
  features: [
    { title: '30-30-40 Payment Plan', desc: 'Stage-linked payments across 30 months' },
    { title: '20 Mins to MOPA Airport', desc: 'Direct connectivity via NH-66 highway corridor' },
    { title: '46-Acre Development', desc: 'Part of the 300+ acre Vedic City township' },
    { title: '240 - 300 Sq. Yd. Plots', desc: '570 villa plots sized for G+1 construction, FAR 1' },
    { title: 'Only 60% Plotted', desc: '40% reserved for greens, roads & community spaces' },
    { title: 'Beaches Within 30 Mins', desc: 'Morjim, Shiroda & the North Goa coastline' },
  ],
};

export const HIGHLIGHTS = [
  { icon: 'home', title: 'Luxury Villa Plots', desc: 'Premium residential plots for elegant living.' },
  { icon: 'township', title: '100-Acre Township', desc: 'Expansive community with lush surroundings.' },
  { icon: 'signs', title: 'Prime North Goa', desc: 'Just minutes from Mopa Airport.' },
  { icon: 'tree', title: 'Green Landscapes', desc: 'Nature-focused spaces for relaxation.' },
  { icon: 'marker', title: 'Wellness Living', desc: 'Yoga and meditation zones for calm life.' },
  { icon: 'building', title: 'Modern Clubhouse', desc: 'Pool, gym, and recreation spaces.' },
  { icon: 'shield', title: 'Gated Community', desc: '24x7 surveillance and entry control.' },
  { icon: 'bolt', title: 'Infrastructure', desc: 'Power backup and modern utilities.' },
] as const;

export const AMENITIES = [
  { src: '/vedic-city-goa/amenities/amenities-1.webp', label: 'Gated Township' },
  { src: '/vedic-city-goa/amenities/amenities-2.webp', label: 'Tier Security' },
  { src: '/vedic-city-goa/amenities/amenities-3.webp', label: 'Swimming Pool' },
  { src: '/vedic-city-goa/amenities/amenities-4.webp', label: 'Yoga Zone' },
  { src: '/vedic-city-goa/amenities/amenities-5.webp', label: 'Jogging Track' },
  { src: '/vedic-city-goa/amenities/amenities-6.webp', label: 'Gymnasium' },
  { src: '/vedic-city-goa/amenities/amenities-7.webp', label: 'Kids Play Area' },
  { src: '/vedic-city-goa/amenities/amenities-8.webp', label: 'Reflexology and Meditation Center' },
];

export const GALLERY = [
  { src: '/vedic-city-goa/gallery/gallery-01.webp', alt: 'Vedic City Goa site overview' },
  { src: '/vedic-city-goa/gallery/gallery-02.webp', alt: 'Clubhouse and community spaces' },
  { src: '/vedic-city-goa/gallery/gallery-03.webp', alt: 'Landscaped outdoor areas' },
  { src: '/vedic-city-goa/gallery/gallery-04.webp', alt: 'Villa plot development view' },
  { src: '/vedic-city-goa/gallery/gallery-1.webp', alt: 'Vedic City Goa masterplan view' },
  { src: '/vedic-city-goa/gallery/gallery-2.webp', alt: 'Clubhouse and community spaces' },
  { src: '/vedic-city-goa/gallery/gallery-3.webp', alt: 'Community amenities at Vedic City Goa' },
  { src: '/vedic-city-goa/gallery/gallery-4.webp', alt: 'Villa plot development view' },
  { src: '/vedic-city-goa/gallery/gallery-5.webp', alt: 'Vedic City Goa lifestyle' },
  { src: '/vedic-city-goa/gallery/gallery-6.webp', alt: 'Premium villa plot experience' },
  { src: '/vedic-city-goa/gallery/gallery-7.webp', alt: 'Vedic City Goa community views' },
  { src: '/vedic-city-goa/gallery/gallery-8.webp', alt: 'North Goa villa plot setting' },
  { src: '/vedic-city-goa/gallery/gallery-9.webp', alt: 'North Goa villa plot setting' },
];

export const LOCATION_POINTS = [
  { title: '20 Minutes from MOPA Airport', text: "Direct access to Goa's Manohar International Airport." },
  { title: 'NH-66 Highway Corridor', text: 'Well-connected via the Goa-Mumbai highway.' },
  { title: 'North Goa Beaches', text: 'Morjim, Shiroda and the coastline within 30 minutes.' },
  { title: 'Natural Setting', text: 'Low-density planning surrounded by greens and open landscapes.' },
  {
    title: 'Investment Potential',
    text: 'High appreciation potential with MOPA Airport and Aerocity development underway.',
  },
  { title: 'Rental Income', text: 'Strong holiday-home and short-term rental demand across North Goa.' },
];

export const DISCLAIMER = {
  rera: 'Project approvals & RERA / land-title disclosures available on request at the site office',
  short:
    'Information on this website, including brochures, layouts, pricing indications, and amenities, is for general guidance only. Photographs marked as actual site images reflect current or recent development; other visuals may be artistic impressions and are indicative only. Plot sizes, availability, and specifications may change without prior notice.',
  more: 'Nothing on this website constitutes a legal offer, allotment, or binding contract. Any purchase or booking of villa plots at Vedic City Goa shall be governed solely by the written agreement, payment schedule, and documentation executed between the buyer and the authorised seller or developer at the time of transaction. Visitors should verify land title, applicable approvals, and payment terms independently before making a decision.',
};
