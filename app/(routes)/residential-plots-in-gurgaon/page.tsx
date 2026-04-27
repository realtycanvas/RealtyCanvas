import { Metadata } from 'next';
import Breadcrumb from '@/components/ui/breadcrumb';
import PlotsGuideClient from './plots-guide-client';

export const metadata: Metadata = {
  title: 'Residential Plots in Gurgaon – Top Locations, Prices & Projects (2026)',
  description:
    'Complete guide to residential plots in Gurgaon 2026. Explore DLF Phases, Dwarka Expressway, New Gurgaon and Golf Course Road with verified listings and expert investment insights.',
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
