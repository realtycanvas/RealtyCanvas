import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Realty Canvas',
  description:
    'Learn how Realty Canvas collects, uses, and protects your personal information. Read our privacy practices and your rights.',
};

export default function PrivacyPolicyPage() {
  const lastUpdated = '12 Nov 2025';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 mt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-gray-300">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-200">
          <div className="space-y-8">
            <p>
              Realty Canvas ("we", "our", "us") is committed to protecting your
              privacy. This Privacy Policy explains what information we collect,
              how we use it, and the choices you have.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  Contact details such as name, email address, and phone number
                  when you inquire, register, or request property information.
                </li>
                <li>
                  Property preferences, budgets, and search filters submitted via
                  our website forms.
                </li>
                <li>
                  Usage data including pages visited, actions taken, device
                  information, and approximate location, captured via analytics
                  and cookies as described in our Cookie Policy.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>To respond to inquiries and provide property recommendations.</li>
                <li>To personalize content and improve site functionality.</li>
                <li>To schedule site visits and coordinate with developers/agents.</li>
                <li>To send updates, marketing, or service communications (you may opt out at any time).</li>
                <li>To comply with legal obligations and enforce our Terms of Service.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Sharing of Information</h2>
              <p>
                We do not sell your personal data. We may share limited
                information with trusted service providers (e.g., hosting,
                analytics, email) under confidentiality obligations, and with
                developers/agents strictly to fulfill your requests.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Data Security</h2>
              <p>
                We implement administrative, technical, and physical safeguards
                to protect your information. No method of transmission or storage
                is 100% secure; we strive to protect your data within industry
                best practices.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Your Choices & Rights</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Access, update, or delete your personal information.</li>
                <li>Opt out of marketing communications at any time.</li>
                <li>Manage cookie preferences in your browser settings.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Children&apos;s Privacy</h2>
              <p>
                Our services are not directed to children under 13. We do not
                knowingly collect data from children.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                post the updated version on this page with a new effective date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p>
                For questions or requests regarding privacy, contact us at
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