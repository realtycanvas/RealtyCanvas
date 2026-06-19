export type BannerItem = {
  id: string;
  desktopImage: string;
  mobileImage: string;
  tabletImage?: string;
  tvImage?: string;
  link: string;
  sortOrder: number;
};

export const banners: BannerItem[] = [
  {
    id: 'home-hero-aipl-joy-district',
    desktopImage: '/banner/extended/aipl-desktop.webp',
    mobileImage: '/banner/mobile/aipl-mobile.webp',
    tabletImage: '/banner/tablet/aipl-tablet.webp',
    tvImage: '/banner/tv/aipl-tv.webp',
    link: '/projects/aipl-joy-district-sector-88-gurgaon',
    sortOrder: 1,
  },
  {
    id: 'home-hero-downtown',
    desktopImage: '/banner/extended/downtown-desktop.webp',
    mobileImage: '/banner/mobile/downtown-Mobile.webp',
    tabletImage: '/banner/tablet/downtown-tablet.webp',
    tvImage: '/banner/tv/downtown-tv.webp',
    link: '/projects/bptp-downtown-66-sector-66-gurgaon',
    sortOrder: 2,
  },
  {
    id: 'home-hero-ishva',
    desktopImage: '/banner/extended/ishva-desktop.webp',
    mobileImage: '/banner/mobile/ishva-mobile.webp',
    tabletImage: '/banner/tablet/ishva-tablet.webp',
    tvImage: '/banner/tv/ishva-tv.webp',
    link: '/projects/tarc-ishva-sector-63a-gurgaon',
    sortOrder: 3,
  },
];
