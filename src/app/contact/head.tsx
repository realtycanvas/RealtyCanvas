export default function Head() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  const url = `${baseUrl}/contact`;
  const title = 'Contact Realty Canvas | Property Consultations in Gurgaon | Site Visits & Support';
  const description = 'Visit Realty Canvas at Landmark Cyber Park, Sector 67, Gurugram or call 9555562626 for personalized property recommendations, site visits, and complete document support across Gurgaon';
  const keywords = 'Realty Canvas contact, Gurgaon real estate consultant, property consultation, site visit, Gurgaon office';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Realty Canvas" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      <meta name="robots" content="index,follow" />
    </>
  );
}