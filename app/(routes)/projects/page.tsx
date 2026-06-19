import ProjectsPage from '@/components/projects/projects-page';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Real Estate Projects – Residential & Commercial | Realty Canvas',
  description:
    'Explore premium residential and commercial real estate projects across Gurgaon & beyond with Realty Canvas. Discover verified listings, top locations, and expert property assistance for buyers and investors.',
  alternates: {
    canonical: 'https://www.realtycanvas.in/projects',
  },
};

const page = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <Breadcrumb items={[{ label: 'Projects' }]} />
      <ProjectsPage />
    </div>
  );
};

export default page;
