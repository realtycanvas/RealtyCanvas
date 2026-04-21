import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const projectSlug = 'spj-vedatam-sector-14-gurgaon';

// ─── SEO ───────────────────────────────────────────────────────────────────
const seoData = {
  metaTitle: 'SPJ Vedatam Sector 14 Gurgaon | Premium Commercial Project',
  metaDescription:
    'SPJ Vedatam Sector 14 Gurgaon – The first organised retail hub at the heart of Gurugram. Premium retail, food court, multiplex, entertainment & serviced apartments by SPJ Group on 4.15 acres. RERA approved.',
  metaKeywords: [
    'SPJ Vedatam Sector 14 Gurgaon',
    'SPJ Vedatam price',
    'commercial property Sector 14 Gurgaon',
    'retail shops Old Gurgaon',
    'SPJ Group Gurgaon',
    'food court space Gurgaon',
    'multiplex commercial Gurgaon',
    'serviced apartments Sector 14',
    'RERA approved commercial Gurgaon',
    'spj vedatam',
    'sector 14',
    'sustainable',
  ],
  canonicalUrl: 'https://www.realtycanvas.in/projects/spj-vedatam-sector-14-gurgaon',
  ogTitle: 'SPJ Vedatam Sector 14 Gurgaon – The First Organised Retail Hub at the Heart of Gurugram',
  ogDescription:
    'A 4.15-acre RERA approved mixed-use commercial project in Sector 14, Gurugram. Premium retail, food court, multiplex & serviced apartments by SPJ Group.',
  ogImage: 'https://cdn.realtycanvas.in/projects/featured/1755778980944-wg1lh9an4r.png',
  twitterCard: 'summary_large_image',
  schemaMarkup: {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: 'SPJ Vedatam Sector 14 Gurgaon',
    description:
      'The first organised retail hub at the heart of Gurugram. Premium retail, food court, multiplex, entertainment zone and serviced apartments on 4.15 acres in Sector 14.',
    url: 'https://www.realtycanvas.in/projects/spj-vedatam-sector-14-gurgaon',
    image: 'https://cdn.realtycanvas.in/projects/featured/1755778980944-wg1lh9an4r.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Sector 14, Gurugram',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      addressCountry: 'IN',
    },
  },
  h1Tag: 'SPJ Vedatam – The First Organised Retail Hub at the Heart of Gurugram',
  h2Tags: [
    'Project Overview – SPJ Vedatam Gurugram',
    'Location Advantage – Sector 14, Gurugram',
    'KANAKA – Premium Retail Zone',
    'RAASA – Food Court & Dining Zone',
    'TARANG – Multiplex & Entertainment',
    'Amenities & Features',
    'Floor Plans',
    'Why Invest in SPJ Vedatam?',
    'Frequently Asked Questions',
  ],
  featuredImgAlt: 'SPJ Vedatam – Premium Commercial Hub Sector 14 Gurugram',
  imageAltMap: {
    'https://cdn.realtycanvas.in/projects/featured/1755778980944-wg1lh9an4r.png':
      'SPJ Vedatam Commercial Hub Sector 14 Gurugram',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996662-qrtf2j5cxd.png': 'SPJ Vedatam Exterior View Gurugram',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996662-x3m0ybgims.webp': 'SPJ Vedatam Retail Zone Interior',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996663-0cz9j34v4an8.webp': 'SPJ Vedatam Food Court & Dining',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996663-owjwmrkl7bl.webp': 'SPJ Vedatam Entertainment Zone',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996663-1weu5ceg3wx.webp': 'SPJ Vedatam Serviced Apartments',
  },
  localHeading: 'Location Advantage – Sector 14, Gurugram',
  localContent: `Sector 14 has long been at the heart of Gurugram's urban landscape. With a high urban population density of approximately 32 lakh residents, it promises affluent catchment and renewed business opportunities.

Connectivity & Accessibility:
• Mehrauli-Gurgaon Road: >1 km
• IFFCO Chowk & HUDA City Centre Metro: 4–6 km
• Cyber City: 2–3 km
• DLF Phase III: 8.6 km
• Dwarka Expressway: 5 km
• IGI Airport: 10 km

Residential Catchment:
• Sector 15 (1 & 2): 1–2 km
• Sector 17 & 18: 2–3 km
• Sector 22 & 23: 5 km
• Palam Vihar: 6 km
• Sushant Lok: 8 km

Schools & Hospitals:
• The English School: 0.3 km
• Sunrise Public School: 0.45 km
• Saraswati Hospital: 0.31 km
• Medanta The Medicity: 5 km`,
  longFormTitle: 'About SPJ Group – The Developer',
  longFormContent: `A legacy spanning 30+ years, SPJ Group is a business conglomerate serving communities with customer centricity, integrity, sustainability and an uncompromised commitment to quality at its core.

SPJ Group delivers premium residential and commercial developments rooted in meticulous craftsmanship and innovation. Beyond real estate, the portfolio spans:
- SPJ Hospitality – Ramada Ajmer, upcoming Sonmarg project
- SPJ Agriculture – Poly House Sustainable Farming Oasis in Alwar
- SPJ Education – Space Global and Astroport
- SPJ Finance – Tailored financial solutions, venture capital and leasing

Architect: ACPL Architects — pioneers in architectural excellence with a legacy of prestigious projects spanning commercial, residential, and institutional spaces across India.`,
  isIndexable: true,
  sitemapPriority: 0.9,
};

// ─── PROJECT ────────────────────────────────────────────────────────────────
const projectData = {
  slug: projectSlug,
  title: 'SPJ Vedatam',
  subtitle: 'Premium Commercial Hub in Sector 14, Gurugram',
  description:
    'Vedatam by SPJ is a 21-storey upcoming premier commercial hub, designed to redefine business and retail experiences for modern entrepreneurs and enterprises. Located in Sector 14, Gurugram, it offers curated retail, food, entertainment, and serviced apartment spaces with high visibility and connectivity.',
  category: 'COMMERCIAL' as const,
  type: 'High Street Market',
  status: 'UNDER_CONSTRUCTION' as const,
  reraId: 'RC/REP/HARERA/GGM/927/659/2025/30',
  developerName: 'SPJ Group',
  developerLogo: '',
  possessionDate: new Date('2030-06-30'),
  launchDate: new Date('2025-03-25'),
  address: 'Sector 14, Gurugram',
  locality: 'Sector 14',
  city: 'Gurgaon',
  state: 'Haryana',
  currency: 'INR',
  featuredImage: 'https://cdn.realtycanvas.in/projects/featured/1755778980944-wg1lh9an4r.png',
  galleryImages: [
    'https://cdn.realtycanvas.in/projects/gallery/1755778996662-qrtf2j5cxd.png',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996662-x3m0ybgims.webp',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996663-0cz9j34v4an8.webp',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996663-owjwmrkl7bl.webp',
    'https://cdn.realtycanvas.in/projects/gallery/1755778996663-1weu5ceg3wx.webp',
  ],
  videoUrls: ['https://cdn.realtycanvas.in/projects/videos/1755779581689-u17dlvh8xa.mp4'],
  basePrice: '75 Lakhs Onwards',
  priceRange: '₹75 Lakhs – ₹5.5 Cr+',
  priceMin: 7500000,
  priceMax: 55000000,
  bannerTitle: 'SPJ Vedatam – The First Organised Retail Hub at the Heart of Gurugram',
  bannerSubtitle: 'Premium retail, fine dining, food court, multiplex, entertainment zone, club & lounge',
  bannerDescription:
    'A 4.15-acre RERA-approved commercial destination in Sector 14, Gurugram. Vedatam offers an exclusive blend of premium retail spaces, fine dining, food court, multiplex, entertainment zone, club & lounge with world-class infrastructure.',
  aboutTitle: 'About SPJ Vedatam – Sector 14, Gurugram',
  aboutDescription: `The city has a heart and it's pulsing with new energy. Vedatam is the first organised retail hub right at the heart of Gurugram, putting the spotlight on Sector 14, Old Gurugram, all over again.

Vedatam offers an exclusive blend of:
• Premium retail spaces across three meticulously designed levels
• Fine dining and a sprawling food court with national & international QSR brands
• State-of-the-art multiplex with plush seating, stunning visuals and immersive audio
• Interactive entertainment spaces, pub & lounges
• Serviced apartments

With world-class infrastructure and unparalleled amenities, the project is spread across 4.15 acres and brings everything together under one roof.`,
  sitePlanTitle: 'Master Layout – SPJ Vedatam',
  sitePlanImage: 'https://cdn.realtycanvas.in/projects/location-maps/1756660326282-9iqgpi1b0hu.webp',
  sitePlanDescription:
    'Located in Sector 14, Gurugram with direct connectivity to MG Road, NH-48, IFFCO Chowk & HUDA City Centre metro stations, Cyber City, and IGI Airport.',
  minRatePsf: '',
  maxRatePsf: '',
  minUnitArea: 608,
  maxUnitArea: 918,
  landArea: '4.15 Acres',
  numberOfTowers: 1,
  numberOfFloors: 5,
  seoTitle: 'SPJ Vedatam Sector 14 Gurgaon | Premium Commercial Project',
  seoDescription:
    'SPJ Vedatam Sector 14 Gurgaon offers premium residences in a well-established and central Gurgaon location.',
  seoKeywords: ['spj vedatam', 'sector 14', 'sustainable'],
  projectTags: ['FEATURED', 'TRENDING'],
  isActive: true,
};

// ─── HIGHLIGHTS ──────────────────────────────────────────────────────────────
const highlightsData = [
  { label: 'Premium retail shops', icon: '🛍', sortOrder: 1 },
  { label: 'Multiplex signed with PVR Cinemas', icon: '🎬', sortOrder: 2 },
  { label: 'Blend of high street and shopping complex', icon: '🏬', sortOrder: 3 },
  { label: 'High visibility for retail spaces', icon: '👁', sortOrder: 4 },
  { label: 'Excellent connectivity to business hubs', icon: '🔗', sortOrder: 5 },
  { label: 'State-of-the-art infrastructure', icon: '🏗', sortOrder: 6 },
  { label: 'Premium commercial property', icon: '💎', sortOrder: 7 },
  { label: 'Ample parking spaces', icon: '🅿️', sortOrder: 8 },
];

// ─── AMENITIES ───────────────────────────────────────────────────────────────
const amenitiesData = [
  {
    category: 'Parking',
    name: 'Up to 1,100 car parking spaces with seamless ingress and egress',
    details:
      'Three-level car parking — the only one of its kind in the vicinity. Generous 14 ft. basement height for easy movement. Advanced security measures.',
    sortOrder: 1,
  },
  {
    category: 'Infrastructure',
    name: 'High speed elevators and escalators',
    details: 'Seamless vertical connectivity across all commercial floors',
    sortOrder: 2,
  },
  {
    category: 'Safety',
    name: 'Complete CCTV monitoring',
    details: 'Comprehensive surveillance coverage across the entire project',
    sortOrder: 3,
  },
  {
    category: 'Utilities',
    name: '100% power back up',
    details: 'Uninterrupted power supply for all retail and commercial operations',
    sortOrder: 4,
  },
  {
    category: 'Safety',
    name: 'Earthquake resistant structure',
    details: 'Built to withstand seismic activity with advanced structural engineering',
    sortOrder: 5,
  },
  {
    category: 'Utilities',
    name: 'Uninterrupted water supply',
    details: 'Dedicated water supply infrastructure for the entire complex',
    sortOrder: 6,
  },
  {
    category: 'Dining',
    name: 'Sprawling food court with national & international QSR brands',
    details: 'Dedicated culinary destination on the second floor with diverse outlets',
    sortOrder: 7,
  },
  {
    category: 'Dining',
    name: 'Exclusive fine dining restaurants for families',
    details: 'Premium dining options within the RAASA zone',
    sortOrder: 8,
  },
  {
    category: 'Entertainment',
    name: 'Dedicated family entertainment zone',
    details: 'Interactive entertainment spaces complementing the multiplex experience',
    sortOrder: 9,
  },
  {
    category: 'Shopping',
    name: 'One-stop shop for major fast fashion & lifestyle brands',
    details: 'Curated retail across three levels — lower ground, upper ground, and first floor',
    sortOrder: 10,
  },
  {
    category: 'Open Spaces',
    name: 'Ample open spaces with Central Courtyard',
    details: 'Landscaped open areas creating a welcoming environment for visitors',
    sortOrder: 11,
  },
  {
    category: 'Safety',
    name: 'Superior fire safety measures',
    details: 'Advanced fire detection and suppression systems throughout the building',
    sortOrder: 12,
  },
  {
    category: 'Facilities',
    name: 'Changing/feeding room for babies',
    details: 'Family-friendly facilities for parents with infants',
    sortOrder: 13,
  },
];

// ─── OFFERINGS ───────────────────────────────────────────────────────────────
const offeringsData = [
  {
    icon: '🛍',
    title: 'KANAKA – Premium Retail Zone',
    description:
      'Urban retail excellence across three meticulously designed levels — Lower Ground Floor (8,450 sq.mt.), Upper Ground Floor (9,430 sq.mt.), and First Floor (9,000 sq.mt.). A gateway to timeless and exceptional shopping experience with curated selection of premium brands. High visibility and accessibility creating an ideal showcase for brands.',
    sortOrder: 1,
  },
  {
    icon: '🍽',
    title: 'RAASA – Food Court & Dining Zone',
    description:
      'A dedicated culinary destination on the Second Floor (8,750 sq.mt.), featuring fine dining options, diverse outlets, and a spacious food court. Caters to quick bites, multi-cuisine family restaurants, and gourmet restaurants. Its vibrant ambience ensures every visit is a delightful and unforgettable experience.',
    sortOrder: 2,
  },
  {
    icon: '🎬',
    title: 'TARANG – Multiplex & Entertainment',
    description:
      "Third Floor (8,230 sq.mt.) — the city's premier entertainment destination. Multiplex signed with PVR Cinemas offering world-class cinematic experience with plush seating, stunning visuals and immersive audio. Complemented with interactive entertainment spaces, pub & lounges for an all-encompassing experience across age groups.",
    sortOrder: 3,
  },
  {
    icon: '🏙',
    title: 'Serviced Apartments',
    description:
      'Premium serviced apartments on upper floors. Studio Apartments and Service Apartments (918 sq.ft.) available, designed for business travelers and long-stay guests, adding lifestyle value to the complex.',
    sortOrder: 4,
  },
];

// ─── PRICING TABLE ───────────────────────────────────────────────────────────
const pricingData = [
  {
    type: 'LGF Shop',
    reraArea: '699 Sq.ft',
    price: 'Price on Request',
    pricePerSqft: 'Price on Request',
    availabilityStatus: 'available',
    floorNumbers: 'Lower Ground Floor',
  },
  {
    type: 'FF Shop',
    reraArea: '608 Sq.ft',
    price: 'Price on Request',
    pricePerSqft: 'Price on Request',
    availabilityStatus: 'available',
    floorNumbers: 'First Floor',
  },
  {
    type: 'Service Apartment',
    reraArea: '918 Sq.ft',
    price: 'Price on Request',
    pricePerSqft: 'Price on Request',
    availabilityStatus: 'available',
    floorNumbers: 'Sixth Floor',
  },
  {
    type: 'Studio Apartment',
    reraArea: 'On Request',
    price: 'Price on Request',
    pricePerSqft: 'Price on Request',
    availabilityStatus: 'available',
    floorNumbers: 'Sixth Floor',
  },
];

// ─── NEARBY POINTS ───────────────────────────────────────────────────────────
const nearbyPointsData = [
  { type: 'ROAD' as const, name: 'Mehrauli-Gurgaon Road', distanceKm: 1.0, travelTimeMin: 3 },
  { type: 'METRO' as const, name: 'IFFCO Chowk Metro Station', distanceKm: 4.0, travelTimeMin: 10 },
  { type: 'METRO' as const, name: 'HUDA City Centre Metro Station', distanceKm: 6.0, travelTimeMin: 15 },
  { type: 'OFFICE_HUB' as const, name: 'Cyber City (DLF)', distanceKm: 2.5, travelTimeMin: 8 },
  { type: 'OFFICE_HUB' as const, name: 'DLF Phase III', distanceKm: 8.6, travelTimeMin: 20 },
  { type: 'ROAD' as const, name: 'Dwarka Expressway', distanceKm: 5.0, travelTimeMin: 12 },
  { type: 'AIRPORT' as const, name: 'IGI Airport', distanceKm: 10.0, travelTimeMin: 20 },
  { type: 'HOTEL' as const, name: 'The Oberoi Gurugram', distanceKm: 3.0, travelTimeMin: 8 },
  { type: 'MALL' as const, name: 'Ambience Creacions', distanceKm: 4.0, travelTimeMin: 10 },
];

// ─── FLOOR PLANS ─────────────────────────────────────────────────────────────
const floorPlansData = [
  {
    level: 'Typical Floor',
    title: 'Master Layout',
    imageUrl: 'https://cdn.realtycanvas.in/projects/floor-plans/1756660172868-1sql1pllg6f.webp',
    details: { usage: 'Overall master layout of SPJ Vedatam' },
    sortOrder: 1,
  },
  {
    level: 'Lower Ground Floor',
    title: 'KANAKA – Retail Zone',
    imageUrl: 'https://cdn.realtycanvas.in/projects/floor-plans/1755779714671-oc9lcqdelhh.webp',
    details: { totalArea: '8,450 sq.mt. approx.', usage: 'Premium retail shops' },
    sortOrder: 2,
  },
  {
    level: 'First Floor',
    title: 'KANAKA – Retail Zone',
    imageUrl: 'https://cdn.realtycanvas.in/projects/floor-plans/1755779733870-trs4dtaoip.webp',
    details: { totalArea: '9,000 sq.mt. approx.', usage: 'Premium retail shops' },
    sortOrder: 3,
  },
  {
    level: 'Second Floor',
    title: 'RAASA – Food Court & Dining',
    imageUrl: 'https://cdn.realtycanvas.in/projects/floor-plans/1755779747340-odn18irjpke.webp',
    details: { totalArea: '8,750 sq.mt. approx.', usage: 'Fine dining, food court, diverse outlets' },
    sortOrder: 4,
  },
  {
    level: 'Third Floor',
    title: 'TARANG – Multiplex & Entertainment',
    imageUrl: 'https://cdn.realtycanvas.in/projects/floor-plans/1755779787677-1llb22f6yv2j.webp',
    details: { totalArea: '8,230 sq.mt. approx.', usage: 'Multiplex (PVR), entertainment, pub & lounges' },
    sortOrder: 5,
  },
  {
    level: 'Fourth Floor',
    title: 'Upper Level',
    imageUrl: 'https://cdn.realtycanvas.in/projects/floor-plans/1755779806648-2jxey743iqr.webp',
    details: {},
    sortOrder: 6,
  },
  {
    level: 'Fifth Floor',
    title: 'Upper Level',
    imageUrl: 'https://cdn.realtycanvas.in/projects/floor-plans/1755779934568-p0hs27ovm2.webp',
    details: {},
    sortOrder: 7,
  },
  {
    level: 'Sixth Floor',
    title: 'Serviced Apartments',
    imageUrl: 'https://cdn.realtycanvas.in/projects/floor-plans/1755779968864-h70fbvxunf.jpg',
    details: { usage: 'Studio Apartments & Service Apartments (918 sq.ft.)' },
    sortOrder: 8,
  },
];

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────
const documentsData = [
  {
    docType: 'APPROVAL' as const,
    title: 'RERA Registration Certificate',
    fileUrl: '',
    number: 'RC/REP/HARERA/GGM/927/659/2025/30',
    issueDate: new Date('2025-03-25'),
    expiryDate: null,
  },
];

// ─── MEDIA ───────────────────────────────────────────────────────────────────
const mediaData = [
  {
    type: 'IMAGE' as const,
    url: 'https://cdn.realtycanvas.in/projects/gallery/1755778996662-qrtf2j5cxd.png',
    caption: 'SPJ Vedatam – Exterior View',
    tags: ['gallery'],
    floor: null,
    sortOrder: 0,
  },
  {
    type: 'IMAGE' as const,
    url: 'https://cdn.realtycanvas.in/projects/gallery/1755778996662-x3m0ybgims.webp',
    caption: 'SPJ Vedatam – Retail Zone',
    tags: ['gallery'],
    floor: null,
    sortOrder: 1,
  },
  {
    type: 'IMAGE' as const,
    url: 'https://cdn.realtycanvas.in/projects/gallery/1755778996663-0cz9j34v4an8.webp',
    caption: 'SPJ Vedatam – Food Court & Dining',
    tags: ['gallery'],
    floor: null,
    sortOrder: 2,
  },
  {
    type: 'IMAGE' as const,
    url: 'https://cdn.realtycanvas.in/projects/gallery/1755778996663-owjwmrkl7bl.webp',
    caption: 'SPJ Vedatam – Entertainment Zone',
    tags: ['gallery'],
    floor: null,
    sortOrder: 3,
  },
  {
    type: 'IMAGE' as const,
    url: 'https://cdn.realtycanvas.in/projects/gallery/1755778996663-1weu5ceg3wx.webp',
    caption: 'SPJ Vedatam – Serviced Apartments',
    tags: ['gallery'],
    floor: null,
    sortOrder: 4,
  },
  {
    type: 'VIDEO' as const,
    url: 'https://cdn.realtycanvas.in/projects/videos/1755779581689-u17dlvh8xa.mp4',
    caption: 'SPJ Vedatam – Project Walkthrough',
    tags: ['video', 'walkthrough'],
    floor: null,
    sortOrder: 0,
  },
];

// ─── FAQS ────────────────────────────────────────────────────────────────────
const faqsData = [
  {
    question: "What is SPJ Vedatam's RERA number?",
    answer: 'RC/REP/HARERA/GGM/927/659/2025/30',
    sortOrder: 1,
  },
  {
    question: 'What is the starting price for SPJ Vedatam shops?',
    answer: 'SPJ Vedatam offers premium projects with prices starting at ₹75 Lakhs onwards.',
    sortOrder: 2,
  },
  {
    question: 'Where is SPJ Vedatam located?',
    answer:
      'SPJ Vedatam is located in Sector 14, Gurugram, Haryana. It is within 1 km of Mehrauli-Gurgaon Road, 4–6 km from IFFCO Chowk & HUDA City Centre metro stations, 2–3 km from Cyber City, and approximately 10 km from IGI Airport.',
    sortOrder: 3,
  },
  {
    question: 'What types of spaces are available at SPJ Vedatam?',
    answer:
      'SPJ Vedatam offers premium retail shops (KANAKA zone across three levels), a food court and fine dining zone (RAASA on second floor), a multiplex signed with PVR Cinemas and entertainment zone (TARANG on third floor), and serviced apartments on upper floors.',
    sortOrder: 4,
  },
  {
    question: 'What are the key amenities at SPJ Vedatam?',
    answer:
      'Amenities include a multiplex (PVR), food court, fitness center, private club, shopping, ample parking with up to 1,100 car spaces across three basement levels, 100% power backup, high-speed elevators & escalators, CCTV monitoring, earthquake resistant structure, central courtyard, and superior fire safety.',
    sortOrder: 5,
  },
  {
    question: 'Who is the developer of SPJ Vedatam?',
    answer:
      'SPJ Vedatam is developed by SPJ Group, a business conglomerate with a legacy spanning 30+ years across real estate, hospitality, education, agriculture, and financial services. The architectural design is by ACPL Architects.',
    sortOrder: 6,
  },
  {
    question: 'What is the total land area of SPJ Vedatam?',
    answer: 'SPJ Vedatam is spread across 4.15 acres in Sector 14, Gurugram.',
    sortOrder: 7,
  },
  {
    question: 'What is the retail area breakdown at SPJ Vedatam?',
    answer:
      'The KANAKA retail zone spans three levels: Lower Ground Floor (8,450 sq.mt. approx.), Upper Ground Floor (9,430 sq.mt. approx.), and First Floor (9,000 sq.mt. approx.). The RAASA food court on the Second Floor covers 8,750 sq.mt. approx. The TARANG entertainment zone on the Third Floor covers 8,230 sq.mt. approx.',
    sortOrder: 8,
  },
];

async function main() {
  console.log(`🌱 Seeding project: ${projectSlug}...`);

  await prisma.project.upsert({
    where: { slug: projectSlug },
    create: {
      ...projectData,
      highlights: { create: highlightsData },
      amenities: { create: amenitiesData },
      offerings: { create: offeringsData },
      pricingTable: { create: pricingData },
      nearbyPoints: { create: nearbyPointsData },
      floorPlans: { create: floorPlansData },
      documents: { create: documentsData },
      media: { create: mediaData },
      faqs: { create: faqsData },
      seo: { create: seoData },
    },
    update: {
      ...projectData,
      highlights: { deleteMany: {}, create: highlightsData },
      amenities: { deleteMany: {}, create: amenitiesData },
      offerings: { deleteMany: {}, create: offeringsData },
      pricingTable: { deleteMany: {}, create: pricingData },
      nearbyPoints: { deleteMany: {}, create: nearbyPointsData },
      floorPlans: { deleteMany: {}, create: floorPlansData },
      documents: { deleteMany: {}, create: documentsData },
      media: { deleteMany: {}, create: mediaData },
      faqs: { deleteMany: {}, create: faqsData },
      seo: {
        upsert: {
          create: seoData,
          update: seoData,
        },
      },
    },
  });

  console.log(`Project seeded successfully: ${projectSlug}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
