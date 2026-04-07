import Image from 'next/image';
import Link from 'next/link';

const BannerSection = () => {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 md:pt-10">
      <Link
        href="https://www.outlookindia.com/xhub/featured-insights/senior-living-is-emerging-as-indias-next-big-real-estate-opportunity-sunil-bhambhani"
        className="relative w-full overflow-hidden rounded"
        target="_blank"
        rel="noopener nofollow noreferrer"
      >
        <Image
          src="/banner/outlook-feature.webp"
          alt="Banner"
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
          priority={false}
        />
      </Link>
    </section>
  );
};

export default BannerSection;
