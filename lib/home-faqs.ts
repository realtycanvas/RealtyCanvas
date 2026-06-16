export type HomeFaq = { question: string; answer: string };

// Shared source of truth for the homepage FAQ.
// Rendered visibly by components/home/FAQ-section.tsx and emitted as
// FAQPage JSON-LD by app/page.tsx — keep both in sync via this list.
export const HOME_FAQS: HomeFaq[] = [
  {
    question: 'Who is Realty Canvas?',
    answer:
      'Realty Canvas is a Gurgaon-based real estate advisory focused on verified residential and commercial projects. We provide transparent pricing, RERA-compliant guidance, and end-to-end support from discovery to possession.',
  },
  {
    question: 'What services does Realty Canvas offer?',
    answer:
      'We offer project discovery, price verification, site visits, deal negotiation, documentation assistance, loan facilitation, and post-purchase support including registration and possession.',
  },
  {
    question: 'Why should I choose Realty Canvas?',
    answer:
      'We benchmark prices across builders, ensure paperwork is clean, and prioritize your ROI. Our team works directly with developer sales desks and uses verified information only.',
  },
  {
    question: 'Does Realty Canvas charge any consultation fees?',
    answer:
      'Consultation is free for buyers. We are compensated by the developer channel without affecting your final price. You always receive transparent, all-inclusive quotes.',
  },
  {
    question: 'Can Realty Canvas help me with home loans?',
    answer:
      'Yes. We coordinate with trusted lending partners to secure pre-approvals and process documentation. We aim for quick turnarounds with competitive interest rates.',
  },
  {
    question: 'Where does Realty Canvas operate?',
    answer:
      'We primarily operate in Gurgaon and NCR across premium residential and Grade-A commercial corridors including Golf Course Extension Road, Dwarka Expressway, and New Gurgaon.',
  },
];
