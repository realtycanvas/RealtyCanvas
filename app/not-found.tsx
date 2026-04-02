import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mt-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#FBB70F]/10 via-transparent to-[#112D48]/10" />
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#FBB70F]/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#112D48]/20 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBB70F]/15 text-[#FBB70F] text-xs font-semibold uppercase tracking-wider">
            Page not found
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            We couldn’t find the page you’re looking for.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            The link might be outdated or the page may have been moved. Browse featured projects or head back to the
            homepage.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded px-6 py-3 text-sm font-semibold bg-[#FBB70F] text-[#112D48] hover:bg-[#e5a60d] transition-colors shadow-lg"
            >
              Go to Home
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded px-6 py-3 text-sm font-semibold bg-[#112D48] text-white hover:bg-[#091a30] transition-colors shadow-lg"
            >
              Explore Projects
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="rounded border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 px-4 py-3">
              Gurgaon Premium Projects
            </div>
            <div className="rounded border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 px-4 py-3">
              Commercial & Residential Real estate projects
            </div>
            <div className="rounded border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 px-4 py-3">
              Verified Listings
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg">
          <div className="relative rounded-3xl border border-white/40 bg-linear-to-br from-[#112D48] to-[#0a1c2f] shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.3),transparent_45%)]" />
            <div className="relative p-8 sm:p-10">
              <div className="text-white/70 text-sm font-semibold uppercase tracking-[0.3em]">404</div>
              <div className="mt-4 text-5xl sm:text-6xl font-bold text-white">Lost in Gurgaon?</div>
              <p className="mt-4 text-white/70 text-base">
                Our team curates premium projects with transparent pricing and verified details. Let’s get you back on
                track.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white text-sm font-semibold">
                  RC
                </span>
                <div className="text-sm text-white/70">Realty Canvas Support</div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/80">
                <div className="rounded border border-white/20 px-4 py-3">Call: 9555562626</div>
                <div className="rounded border border-white/20 px-4 py-3">WhatsApp Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
