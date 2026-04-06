import HeroSection from '@/components/home/hero-section';
import BenefitsSection from '@/components/home/benefit-section';
import ServicesSection from '@/components/home/service-section';
import PodcastSection from '@/components/home/podcast-section';
import EnquirySection from '@/components/home/enquiry-section';
import FAQSection from '@/components/home/FAQ-section';
import ProjectTagSection from '@/components/home/project-tag-sections';
import LatestBlogsSection from '@/components/home/latest-blogs-section';
import AutoLeadPopup from '@/components/home/auto-lead-popup';
import FeaturedBlogPreview from '@/components/home/featured-blog-preview';
import BannerSection from '@/components/home/banner-section';

const page = () => {
  return (
    <div className="">
      <AutoLeadPopup />
      <HeroSection />
      <BannerSection />
      <div className="pt-0">
        <FeaturedBlogPreview />
      </div>
      <ProjectTagSection
        className="md:pt-28"
        tag="RECOMMENDED"
        title={
          <h2>
            Realty Canvas <span className="text-[#FDB022]">Recommended</span>
          </h2>
        }
      />
      <BenefitsSection />
      <ProjectTagSection
        className=""
        tag="TRENDING"
        title={
          <h2>
            <span className="text-[#FDB022]">Trending</span> Projects in Gurugram
          </h2>
        }
      />
      <ServicesSection />
      <ProjectTagSection
        className=""
        tag="NEW"
        title={
          <h2>
            <span className="text-[#FDB022]">New Launch</span> Projects in Gurgaon
          </h2>
        }
      />
      <ProjectTagSection
        className="bg-white"
        tag="BUDGET"
        title={
          <h2>
            <span className="text-[#FDB022]">Best Budget</span> Projects in Gurugram
          </h2>
        }
      />
      <ProjectTagSection
        tag="DREAM"
        title={
          <h2>
            <span className="text-[#FDB022]">Dream Properties</span> In The Heart of Gurugram
          </h2>
        }
      />
      <ProjectTagSection
        className="bg-white"
        tag="BUDGET_PLOTS"
        title={
          <h2>
            <span className="text-[#FDB022]">Best Budget Plots</span> in Gurugram
          </h2>
        }
      />
      <ProjectTagSection
        tag="COMMERCIAL_GURUGRAM"
        title={
          <h2>
            <span className="text-[#FDB022]">Commercial</span> Projects in Gurugram
          </h2>
        }
      />
      <PodcastSection />
      <EnquirySection />
      <LatestBlogsSection />
      <FAQSection />
    </div>
  );
};

export default page;
