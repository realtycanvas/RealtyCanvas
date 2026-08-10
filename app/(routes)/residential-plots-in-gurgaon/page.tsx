import { Metadata } from 'next';
import Breadcrumb from '@/components/ui/breadcrumb';
import PlotsGuideClient from './plots-guide-client';

export const metadata: Metadata = {
  title: 'Residential Plots in Gurgaon – Sector Maps & Premium Locations (2026)',
  description:
    'Explore sector maps and premium residential plot locations in Gurgaon 2026. DLF Phases, Sushant Lok, South City, Emaar Emerald Hills, Nirvana Country and more - verified listings with expert guidance.',
  alternates: {
    canonical: 'https://www.realtycanvas.in/residential-plots-in-gurgaon',
  },
};

export default function ResidentialPlotsGurgaon() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <Breadcrumb items={[{ label: 'Residential Plots in Gurgaon' }]} />
      <PlotsGuideClient />
    </div>
  );
}
