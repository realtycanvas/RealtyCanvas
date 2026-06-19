export default function Head() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.realtycanvas.in';
  const url = `${baseUrl}/contact`;
  const title = 'Contact Realty Canvas | Gurgaon Property Consultants & Investment Advisors';
  const description =
    'Get in touch with Realty Canvas for expert guidance on luxury homes, commercial investments, and verified real estate projects across Gurgaon and Delhi NCR.';
  const keywords =
    'Realty Canvas contact, Gurgaon real estate consultant, property consultation, site visit, Gurgaon office';

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
