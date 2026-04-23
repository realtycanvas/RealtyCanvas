import { Metadata } from 'next';
import Breadcrumb from '@/components/ui/breadcrumb';
import BestPlotsClient from './best-plots-client';

export const metadata: Metadata = {
  title: 'Best Plots in Gurugram – Premium Plot Listings | Realty Canvas',
  description:
    'Explore the best residential and commercial plots in Gurugram. Find verified plot listings in top sectors with expert guidance from Realty Canvas.',
  alternates: {
    canonical: 'https://www.realtycanvas.in/gurugram-residential-plots',
  },
};

export default function BestPlotsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <Breadcrumb items={[{ label: 'Best Plots in Gurugram' }]} />

      {/* Hero */}
      <div className="bg-gray-900 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">
            Best <span className="text-[#FDB022]">Plots</span> in Gurugram
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl">
            Handpicked plot listings across Gurugram's top sectors — verified, investment-grade, and ready to explore.
          </p>
        </div>
      </div>

      <BestPlotsClient />
    </div>
  );
}
