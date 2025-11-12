import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Realty Canvas',
  description:
    'Understand how Realty Canvas uses cookies and similar technologies and how you can manage your preferences.',
};

export default function CookiePolicyPage() {
  const lastUpdated = '12 Nov 2025';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 mt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Cookie Policy</h1>
          <p className="mt-2 text-gray-300">Last updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-200">
          <div className="space-y-8">
            <p>
              This Cookie Policy explains how Realty Canvas uses cookies and
              similar technologies on our website.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-2">What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device to help the
                website function, remember preferences, and improve your
                experience.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Types of Cookies We Use</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <span className="font-medium">Essential:</span> Required for
                  core site features such as navigation and forms.
                </li>
                <li>
                  <span className="font-medium">Performance/Analytics:</span>
                  Help us understand site usage and improve performance.
                </li>
                <li>
                  <span className="font-medium">Functional:</span> Remember
                  preferences like saved filters and UI settings.
                </li>
                <li>
                  <span className="font-medium">Marketing:</span> Used to
                  deliver relevant content and measure campaign effectiveness.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Managing Cookies</h2>
              <p>
                You can manage or disable cookies via your browser settings.
                Note that disabling essential cookies may affect site
                functionality. For guidance, consult your browser’s help
                documentation.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Third-Party Cookies</h2>
              <p>
                We may use reputable third-party services (e.g., analytics or
                video embeds) that place cookies. We do not control these
                cookies; please refer to the respective providers’ policies.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Updates</h2>
              <p>
                We may update this Cookie Policy from time to time. Changes will
                be posted here with a new effective date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
              <p>
                Questions about our use of cookies? Contact us at
                <span className="font-medium"> sales@realtycanvas.in</span>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}