import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Realty Canvas',
  description:
    'Read the terms governing your use of Realty Canvas services, website, and property information.',
};

export default function TermsOfServicePage() {
  const lastUpdated = '12 Nov 2025';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 mt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          <p className="mt-2 text-gray-300">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-200">
          <div className="space-y-8">
            <p>
              These Terms of Service ("Terms") govern your access to and use of
              the Realty Canvas website, content, and services. By using our
              site, you agree to these Terms.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-2">Eligibility & Accounts</h2>
              <p>
                You must be at least 18 years old to use our services. When
                creating an account or submitting forms, you agree to provide
                accurate information and keep it updated.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Property Information</h2>
              <p>
                Property listings, prices, offers, availability, and images are
                provided for information purposes and may change without notice.
                We strive for accuracy but do not guarantee completeness or
                availability. Always verify details directly before decisions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Use of Website</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Do not misuse the site (no scraping, spamming, or attacks).</li>
                <li>Do not copy or redistribute content without permission.</li>
                <li>Use forms and contact tools respectfully and lawfully.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Third-Party Links</h2>
              <p>
                Our site may link to third-party websites or developer portals.
                We are not responsible for their content or practices.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Realty Canvas is not
                liable for indirect, incidental, or consequential damages
                arising from your use of the website or reliance on property
                information.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Realty Canvas
                and its affiliates from any claims or liabilities arising out of
                your use of the site or violation of these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Termination</h2>
              <p>
                We may suspend or terminate access to the site for any breach of
                these Terms or for misuse, at our discretion.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
              <p>
                These Terms are governed by the laws of India. Any disputes will
                be subject to the exclusive jurisdiction of courts in Gurugram,
                Haryana.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of
                the site signifies your acceptance of the updated Terms.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p>
                For questions regarding these Terms, contact us at
                <span className="font-medium"> sales@realtycanvas.in</span> or
                write to: Realty Canvas, 1st Floor, Landmark Cyber Park, Sector
                67, Gurugram (122102).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}