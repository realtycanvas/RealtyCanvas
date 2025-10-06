import { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import AboutStory from '@/components/about/AboutStory';
import AboutMission from '@/components/about/AboutMission';
import AboutTeam from '@/components/about/AboutTeam';
import AboutStats from '@/components/about/AboutStats';

export const metadata: Metadata = {
  title: 'About Us - RealityCanvas',
  description: 'Learn about RealityCanvas, our mission to transform the real estate industry, and meet our dedicated team of professionals.',
  keywords: 'about realitycanvas, real estate company, property development, team, mission, vision',
  openGraph: {
    title: 'About Us - RealityCanvas',
    description: 'Learn about RealityCanvas, our mission to transform the real estate industry, and meet our dedicated team of professionals.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <AboutStory />
      <AboutMission />
      {/* <AboutStats /> */}
      {/* <AboutTeam /> */}
    </main>
  );
}