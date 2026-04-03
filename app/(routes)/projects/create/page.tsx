'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { PROJECT_TAGS } from '@/lib/project-tags';
import ImageUpload from '@/components/ui/image-upload';

// ─── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = ['COMMERCIAL', 'RESIDENTIAL'] as const;
const STATUSES = ['UNDER_CONSTRUCTION', 'READY'] as const;
const NEARBY_TYPES = ['METRO', 'ROAD', 'AIRPORT', 'MALL', 'HOTEL', 'SCHOOL', 'HOSPITAL', 'OFFICE_HUB', 'PARK'] as const;

const priceRanges = [
  { label: 'Any Price', min: 0, max: 0 },
  { label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { label: '₹1Cr - ₹5Cr', min: 10000000, max: 50000000 },
  { label: '₹5Cr - ₹10Cr', min: 50000000, max: 100000000 },
  { label: '₹10Cr - ₹25Cr', min: 100000000, max: 250000000 },
  { label: '₹25Cr+', min: 250000000, max: 0 },
];

const TABS = [
  { id: 'basic', label: '1. Basic' },
  { id: 'pricing', label: '2. Pricing' },
  { id: 'media', label: '3. Media' },
  { id: 'content', label: '4. Content' },
  { id: 'details', label: '5. Details' },
  { id: 'seo', label: '6. SEO' },
] as const;

type TabId = (typeof TABS)[number]['id'];

type ProjectSeoData = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string[];
  h1Tag?: string | null;
  featuredImgAlt?: string | null;
  localHeading?: string | null;
  localContent?: string | null;
  longFormTitle?: string | null;
  longFormContent?: string | null;
};

type ProjectResponse = {
  slug: string;
  title: string;
  subtitle?: string | null;
  description: string;
  category: string;
  type?: string | null;
  status: string;
  address: string;
  locality?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  currency?: string | null;
  developerName?: string | null;
  developerLogo?: string | null;
  reraId?: string | null;
  possessionDate?: string | null;
  launchDate?: string | null;
  basePrice?: string | null;
  priceRange?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  minRatePsf?: string | null;
  maxRatePsf?: string | null;
  minUnitArea?: number | null;
  maxUnitArea?: number | null;
  landArea?: string | null;
  numberOfTowers?: number | null;
  numberOfFloors?: number | null;
  totalUnits?: number | null;
  soldUnits?: number | null;
  availableUnits?: number | null;
  numberOfApartments?: number | null;
  featuredImage?: string | null;
  sitePlanImage?: string | null;
  bannerTitle?: string | null;
  bannerSubtitle?: string | null;
  bannerDescription?: string | null;
  aboutTitle?: string | null;
  aboutDescription?: string | null;
  sitePlanTitle?: string | null;
  sitePlanDescription?: string | null;
  projectTags?: string[];
  isActive?: boolean;
  galleryImages?: string[];
  videoUrls?: string[];
  highlights?: { label: string; icon: string | null }[];
  amenities?: { category: string; name: string; details: string | null }[];
  offerings?: { icon: string | null; title: string; description: string }[];
  pricingTable?: {
    unitArea?: string | null;
    type: string;
    reraArea: string;
    price: string;
    pricePerSqft?: string | null;
    availabilityStatus?: string | null;
    floorNumbers?: string | null;
  }[];
  nearbyPoints?: { type: string; name: string; distanceKm?: number | null; travelTimeMin?: number | null }[];
  floorPlans?: { level: string; title?: string | null; imageUrl: string; details?: unknown }[];
  faqs?: { question: string; answer?: string | null }[];
  seo?: ProjectSeoData | null;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const fmtLabel = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const rupeeHint = (val: string) => {
  const n = parseInt(val);
  if (!n) return '';
  if (n >= 10000000) return `≈ ₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `≈ ₹${(n / 100000).toFixed(1)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

// ─── Tiny UI Atoms ─────────────────────────────────────────────────────────────

const Label = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <label className="block text-xs font-medium text-gray-600 mb-1">
    {children}
    {req && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const Input = ({ cls = '', ...p }: React.InputHTMLAttributes<HTMLInputElement> & { cls?: string }) => (
  <input
    {...p}
    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition ${cls}`}
  />
);

const Textarea = ({ cls = '', ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { cls?: string }) => (
  <textarea
    {...p}
    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition resize-y ${cls}`}
  />
);

const Select = ({ cls = '', ...p }: React.SelectHTMLAttributes<HTMLSelectElement> & { cls?: string }) => (
  <select
    {...p}
    className={`w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none bg-white transition ${cls}`}
  />
);

const AddBtn = ({ onClick, label = 'Add Row' }: { onClick: () => void; label?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="mt-3 flex items-center gap-1 text-xs font-semibold text-yellow-700 hover:text-yellow-900 transition"
  >
    <span className="text-base leading-none">＋</span> {label}
  </button>
);

const DelBtn = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    title="Remove"
    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition text-base leading-none"
  >
    ×
  </button>
);

const Card = ({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) => (
  <div className="bg-white rounded border border-gray-200 overflow-hidden">
    <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const G2 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);
const G3 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
);
const G4 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{children}</div>
);

const RowBox = ({ children, onDel }: { children: React.ReactNode; onDel: () => void }) => (
  <div className="relative p-4 bg-gray-50 rounded border border-gray-100">
    <div className="absolute top-2 right-2">
      <DelBtn onClick={onDel} />
    </div>
    {children}
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

type CreateProjectPageProps = {
  adminMode?: boolean;
};

function CreateProjectPage({ adminMode = false }: CreateProjectPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('slug')?.trim() || '';

  const [tab, setTab] = useState<TabId>('basic');
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [slugLocked, setSlugLocked] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [initialSlug, setInitialSlug] = useState('');

  // ── Flat core fields ───────────────────────────────────────────────────────
  const [f, setF] = useState({
    // Identity
    title: '',
    subtitle: '',
    slug: '',
    description: '',
    category: 'COMMERCIAL',
    type: '',
    status: 'PLANNED',
    isActive: true,
    // Location
    address: '',
    locality: '',
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    currency: 'INR',
    // Developer
    developerName: '',
    developerLogo: '',
    reraId: '',
    possessionDate: '',
    launchDate: '',
    // Pricing display
    basePrice: '',
    priceRange: '',
    priceMin: '',
    priceMax: '',
    minRatePsf: '',
    maxRatePsf: '',
    minUnitArea: '',
    maxUnitArea: '',
    // Unit stats
    landArea: '',
    numberOfTowers: '',
    numberOfFloors: '',
    totalUnits: '',
    soldUnits: '',
    availableUnits: '',
    numberOfApartments: '',
    // Media
    featuredImage: '',
    sitePlanImage: '',
    // Banner
    bannerTitle: '',
    bannerSubtitle: '',
    bannerDescription: '',
    // About
    aboutTitle: '',
    aboutDescription: '',
    // Site plan text
    sitePlanTitle: '',
    sitePlanDescription: '',
    // SEO
    seoMetaTitle: '',
    seoMetaDesc: '',
    seoMetaKeywords: '',
    seoH1: '',
    seoFeaturedImgAlt: '',
    seoLocalHeading: '',
    seoLocalContent: '',
    seoLongTitle: '',
    seoLongContent: '',
  });

  // ── Array states ───────────────────────────────────────────────────────────
  const [gallery, setGallery] = useState<string[]>(['']);
  const [videos, setVideos] = useState<string[]>(['']);
  const [highlights, setHighlights] = useState([{ label: '', icon: '' }]);
  const [amenities, setAmenities] = useState([{ category: '', name: '', details: '' }]);
  const [offerings, setOfferings] = useState([{ icon: '', title: '', description: '' }]);
  const [pricing, setPricing] = useState([
    {
      unitArea: '',
      type: '',
      reraArea: '',
      price: '',
      pricePerSqft: '',
      availabilityStatus: 'available',
      floorNumbers: '',
    },
  ]);
  const [nearby, setNearby] = useState([
    {
      type: 'METRO',
      name: '',
      distanceKm: '',
      travelTimeMin: '',
    },
  ]);
  const [floorPlans, setFloorPlans] = useState([
    {
      level: '',
      title: '',
      imageUrl: '',
      details: '',
    },
  ]);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);

  // ── Auth check ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    const run = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        const authData = await authRes.json();
        if (!authData.user) {
          router.push('/admin/login');
          return;
        }
      } catch {
        router.push('/admin/login');
        return;
      }

      if (editSlug) {
        setIsEditing(true);
        setSlugLocked(true);
        try {
          const res = await fetch(`/api/projects/${encodeURIComponent(editSlug)}`);
          const data = await res.json();
          if (!res.ok) {
            const message = typeof data?.error === 'string' ? data.error : 'Failed to load project';
            throw new Error(message);
          }
          const project = data as ProjectResponse;
          if (!active) return;

          const toStr = (value: number | string | null | undefined) => (value == null ? '' : String(value));
          const toDate = (value: string | Date | null | undefined) => {
            if (!value) return '';
            const d = typeof value === 'string' ? new Date(value) : value;
            return Number.isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
          };
          const toDetails = (value: unknown) => {
            if (!value) return '';
            if (typeof value === 'string') return value;
            try {
              return JSON.stringify(value);
            } catch {
              return '';
            }
          };

          setInitialSlug(project.slug || editSlug);
          setSelectedTags(project.projectTags || []);
          setF({
            title: project.title || '',
            subtitle: project.subtitle || '',
            slug: project.slug || '',
            description: project.description || '',
            category: project.category || 'COMMERCIAL',
            type: project.type || '',
            status: project.status || 'PLANNED',
            isActive: project.isActive ?? true,
            address: project.address || '',
            locality: project.locality || '',
            city: project.city || '',
            state: project.state || '',
            latitude: toStr(project.latitude),
            longitude: toStr(project.longitude),
            currency: project.currency || 'INR',
            developerName: project.developerName || '',
            developerLogo: project.developerLogo || '',
            reraId: project.reraId || '',
            possessionDate: toDate(project.possessionDate),
            launchDate: toDate(project.launchDate),
            basePrice: project.basePrice || '',
            priceRange: project.priceRange || '',
            priceMin: toStr(project.priceMin),
            priceMax: toStr(project.priceMax),
            minRatePsf: project.minRatePsf || '',
            maxRatePsf: project.maxRatePsf || '',
            minUnitArea: toStr(project.minUnitArea),
            maxUnitArea: toStr(project.maxUnitArea),
            landArea: project.landArea || '',
            numberOfTowers: toStr(project.numberOfTowers),
            numberOfFloors: toStr(project.numberOfFloors),
            totalUnits: toStr(project.totalUnits),
            soldUnits: toStr(project.soldUnits),
            availableUnits: toStr(project.availableUnits),
            numberOfApartments: toStr(project.numberOfApartments),
            featuredImage: project.featuredImage || '',
            sitePlanImage: project.sitePlanImage || '',
            bannerTitle: project.bannerTitle || '',
            bannerSubtitle: project.bannerSubtitle || '',
            bannerDescription: project.bannerDescription || '',
            aboutTitle: project.aboutTitle || '',
            aboutDescription: project.aboutDescription || '',
            sitePlanTitle: project.sitePlanTitle || '',
            sitePlanDescription: project.sitePlanDescription || '',
            seoMetaTitle: project.seo?.metaTitle || '',
            seoMetaDesc: project.seo?.metaDescription || '',
            seoMetaKeywords: project.seo?.metaKeywords?.join(', ') || '',
            seoH1: project.seo?.h1Tag || '',
            seoFeaturedImgAlt: project.seo?.featuredImgAlt || '',
            seoLocalHeading: project.seo?.localHeading || '',
            seoLocalContent: project.seo?.localContent || '',
            seoLongTitle: project.seo?.longFormTitle || '',
            seoLongContent: project.seo?.longFormContent || '',
          });

          setGallery(project.galleryImages?.length ? [...project.galleryImages, ''] : ['']);
          setVideos(project.videoUrls?.length ? [...project.videoUrls, ''] : ['']);
          setHighlights(
            project.highlights?.length
              ? project.highlights.map((h) => ({ label: h.label || '', icon: h.icon || '' }))
              : [{ label: '', icon: '' }]
          );
          setAmenities(
            project.amenities?.length
              ? project.amenities.map((a) => ({
                  category: a.category || '',
                  name: a.name || '',
                  details: a.details || '',
                }))
              : [{ category: '', name: '', details: '' }]
          );
          setOfferings(
            project.offerings?.length
              ? project.offerings.map((o) => ({
                  icon: o.icon || '',
                  title: o.title || '',
                  description: o.description || '',
                }))
              : [{ icon: '', title: '', description: '' }]
          );
          setPricing(
            project.pricingTable?.length
              ? project.pricingTable.map((p) => ({
                  unitArea: p.unitArea || '',
                  type: p.type || '',
                  reraArea: p.reraArea || '',
                  price: p.price || '',
                  pricePerSqft: p.pricePerSqft || '',
                  availabilityStatus: p.availabilityStatus || 'available',
                  floorNumbers: p.floorNumbers || '',
                }))
              : [
                  {
                    unitArea: '',
                    type: '',
                    reraArea: '',
                    price: '',
                    pricePerSqft: '',
                    availabilityStatus: 'available',
                    floorNumbers: '',
                  },
                ]
          );
          setNearby(
            project.nearbyPoints?.length
              ? project.nearbyPoints.map((n) => ({
                  type: n.type || 'METRO',
                  name: n.name || '',
                  distanceKm: toStr(n.distanceKm),
                  travelTimeMin: toStr(n.travelTimeMin),
                }))
              : [
                  {
                    type: 'METRO',
                    name: '',
                    distanceKm: '',
                    travelTimeMin: '',
                  },
                ]
          );
          setFloorPlans(
            project.floorPlans?.length
              ? project.floorPlans.map((fp) => ({
                  level: fp.level || '',
                  title: fp.title || '',
                  imageUrl: fp.imageUrl || '',
                  details: toDetails(fp.details),
                }))
              : [
                  {
                    level: '',
                    title: '',
                    imageUrl: '',
                    details: '',
                  },
                ]
          );
          setFaqs(
            project.faqs?.length
              ? project.faqs.map((fq) => ({ question: fq.question || '', answer: fq.answer || '' }))
              : [{ question: '', answer: '' }]
          );
        } catch (err: unknown) {
          if (!active) return;
          setError(err instanceof Error ? err.message : 'Failed to load project');
        }
      } else {
        setIsEditing(false);
        setInitialSlug('');
      }

      if (active) setPageLoading(false);
    };
    run();
    return () => {
      active = false;
    };
  }, [router, editSlug]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    if (name === 'title' && !slugLocked) {
      setF((p) => ({ ...p, title: value, slug: slugify(value) }));
    } else {
      setF((p) => ({ ...p, [name]: val }));
    }
  };

  const changeSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugLocked(true);
    setF((p) => ({ ...p, slug: e.target.value }));
  };

  const selectPriceRange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const r = priceRanges.find((x) => x.label === e.target.value);
    if (r) setF((p) => ({ ...p, priceMin: String(r.min), priceMax: r.max > 0 ? String(r.max) : '' }));
  };

  // ── Generic array helpers ──────────────────────────────────────────────────
  const addStr = (set: React.Dispatch<React.SetStateAction<string[]>>) => set((p) => [...p, '']);
  const delStr = (set: React.Dispatch<React.SetStateAction<string[]>>, i: number) =>
    set((p) => p.filter((_, j) => j !== i));
  const updStr = (set: React.Dispatch<React.SetStateAction<string[]>>, i: number, v: string) =>
    set((p) => p.map((x, j) => (j === i ? v : x)));

  function addRow<T>(set: React.Dispatch<React.SetStateAction<T[]>>, empty: T) {
    set((p) => [...p, { ...empty }]);
  }
  function delRow<T>(set: React.Dispatch<React.SetStateAction<T[]>>, i: number) {
    set((p) => p.filter((_, j) => j !== i));
  }
  function moveRow<T>(set: React.Dispatch<React.SetStateAction<T[]>>, from: number, to: number) {
    set((p) => {
      if (to < 0 || to >= p.length) return p;
      const next = [...p];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }
  function updRow<T extends Record<string, unknown>>(
    set: React.Dispatch<React.SetStateAction<T[]>>,
    i: number,
    key: keyof T,
    val: string
  ) {
    set((p) => p.map((row, j) => (j === i ? { ...row, [key]: val } : row)));
  }

  const toggleTag = (value: string) => {
    setSelectedTags((prev) => (prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!isEditing || !initialSlug) return;
    const confirmed = window.confirm('Delete this project? This cannot be undone.');
    if (!confirmed) return;
    setError('');
    setSuccess('');
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(initialSlug)}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete project');
      router.push(adminMode ? '/admin/projects' : '/projects');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setDeleting(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!f.title.trim()) return setError('Project title is required');
    if (!f.slug.trim()) return setError('URL slug is required');
    if (!f.address.trim()) return setError('Address is required');
    if (!f.featuredImage.trim()) return setError('Featured image URL is required');

    setSaving(true);

    const {
      seoMetaTitle,
      seoMetaDesc,
      seoMetaKeywords,
      seoH1,
      seoFeaturedImgAlt,
      seoLocalHeading,
      seoLocalContent,
      seoLongTitle,
      seoLongContent,
      priceMin,
      priceMax,
      ...core
    } = f;

    const payload = {
      ...core,
      projectTags: selectedTags,
      latitude: core.latitude ? parseFloat(core.latitude) : null,
      longitude: core.longitude ? parseFloat(core.longitude) : null,
      priceMin: priceMin ? parseInt(priceMin) : null,
      priceMax: priceMax ? parseInt(priceMax) : null,
      minUnitArea: core.minUnitArea ? parseInt(core.minUnitArea) : null,
      maxUnitArea: core.maxUnitArea ? parseInt(core.maxUnitArea) : null,
      totalUnits: core.totalUnits ? parseInt(core.totalUnits) : null,
      soldUnits: core.soldUnits ? parseInt(core.soldUnits) : null,
      availableUnits: core.availableUnits ? parseInt(core.availableUnits) : null,
      numberOfApartments: core.numberOfApartments ? parseInt(core.numberOfApartments) : null,
      numberOfTowers: core.numberOfTowers ? parseInt(core.numberOfTowers) : null,
      numberOfFloors: core.numberOfFloors ? parseInt(core.numberOfFloors) : null,
      possessionDate: core.possessionDate ? new Date(core.possessionDate).toISOString() : null,
      launchDate: core.launchDate ? new Date(core.launchDate).toISOString() : null,

      galleryImages: gallery.filter(Boolean),
      videoUrls: videos.filter(Boolean),

      highlights: highlights.filter((h) => h.label.trim()).map((h, i) => ({ ...h, sortOrder: i + 1 })),

      amenities: amenities.filter((a) => a.name.trim()).map((a, i) => ({ ...a, sortOrder: i + 1 })),

      offerings: offerings.filter((o) => o.title.trim()).map((o, i) => ({ ...o, sortOrder: i + 1 })),

      pricingTable: pricing
        .filter((p) => p.type.trim())
        .map((p) => ({
          ...p,
          unitArea: p.unitArea?.trim() || '',
          availabilityStatus: p.availabilityStatus || null,
        })),

      nearbyPoints: nearby
        .filter((n) => n.name.trim())
        .map((n) => ({
          ...n,
          distanceKm: n.distanceKm ? parseFloat(n.distanceKm) : null,
          travelTimeMin: n.travelTimeMin ? parseInt(n.travelTimeMin) : null,
        })),

      floorPlans: floorPlans.filter((fp) => fp.level.trim()).map((fp, i) => ({ ...fp, sortOrder: i + 1 })),

      faqs: faqs.filter((fq) => fq.question.trim()).map((fq, i) => ({ ...fq, sortOrder: i + 1 })),

      seo: {
        h1Tag: seoH1 || null,
        featuredImgAlt: seoFeaturedImgAlt || null,
        localHeading: seoLocalHeading || null,
        localContent: seoLocalContent || null,
        longFormTitle: seoLongTitle || null,
        longFormContent: seoLongContent || null,
        metaTitle: seoMetaTitle || null,
        metaDescription: seoMetaDesc || null,
        metaKeywords: seoMetaKeywords
          ? seoMetaKeywords
              .split(',')
              .map((k) => k.trim())
              .filter(Boolean)
          : [],
        h2Tags: [],
        imageAltMap: {},
        isIndexable: true,
        sitemapPriority: 0.8,
      },
    };

    try {
      const endpoint = isEditing ? `/api/projects/${encodeURIComponent(initialSlug || f.slug)}` : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');
      setSuccess(
        isEditing ? 'Project updated successfully! Redirecting…' : 'Project created successfully! Redirecting…'
      );
      const nextSlug = data.slug || f.slug;
      setTimeout(() => router.push(`/projects/${nextSlug}`), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={adminMode ? 'bg-gray-50' : 'min-h-screen bg-gray-50 mt-20'}>
      {/* ── Form Body ──────────────────────────────────────────────────────── */}
      <form id="project-form" onSubmit={submit}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-5">
          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 1 — BASIC INFO
          ────────────────────────────────────────────────────────────────── */}
          {tab === 'basic' && (
            <div className="space-y-5">
              <Card title="Project Identity">
                <div className="space-y-4">
                  <div>
                    <Label req>Project Title</Label>
                    <Input
                      name="title"
                      value={f.title}
                      onChange={change}
                      required
                      placeholder="e.g. SPJ Vedatam – Premier Commercial Hub in Sector 14, Gurugram"
                    />
                  </div>
                  <G2>
                    <div>
                      <Label>Subtitle</Label>
                      <Input
                        name="subtitle"
                        value={f.subtitle}
                        onChange={change}
                        placeholder="Short tagline for the project"
                      />
                    </div>
                    <div>
                      <Label req>URL Slug</Label>
                      <Input
                        name="slug"
                        value={f.slug}
                        onChange={changeSlug}
                        placeholder="auto-generated from title"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        /projects/<strong className="text-gray-600">{f.slug || 'your-slug-here'}</strong>
                      </p>
                    </div>
                    <div>
                      <Label req>Category</Label>
                      <Select name="category" value={f.category} onChange={change}>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {fmtLabel(c)}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Input name="type" value={f.type} onChange={change} placeholder="e.g. Retail, Office, Plots" />
                    </div>
                    <div>
                      <Label req>Status</Label>
                      <Select name="status" value={f.status} onChange={change}>
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {fmtLabel(s)}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </G2>
                  <label className="inline-flex items-center gap-3 rounded border border-gray-200 px-4 py-3 bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={f.isActive}
                      onChange={change}
                      className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Project Active</p>
                      <p className="text-xs text-gray-500">Only active projects are shown on the public website.</p>
                    </div>
                  </label>
                  <div>
                    <Label req>Short Description</Label>
                    <Textarea
                      name="description"
                      value={f.description}
                      onChange={change}
                      rows={4}
                      placeholder="2-3 sentence overview shown at the top of detail page"
                      required
                      className=""
                    />
                  </div>
                  {/* Project Tags */}
                  <div>
                    <Label>Project Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {PROJECT_TAGS.map((tag) => {
                        const active = selectedTags.includes(tag.value);
                        return (
                          <button
                            key={tag.value}
                            type="button"
                            onClick={() => toggleTag(tag.value)}
                            className={`
                              flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold
                              border-2 transition select-none cursor-pointer
                              ${
                                active
                                  ? `${tag.color} border-current shadow-sm scale-105`
                                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
                              }
                            `}
                          >
                            <span>{tag.emoji}</span>
                            {tag.label}
                            {active && <span className="ml-0.5 text-[10px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    {selectedTags.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2">
                        Selected: {selectedTags.map((t) => PROJECT_TAGS.find((p) => p.value === t)?.label).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              <Card title="Location">
                <div className="space-y-4">
                  <div>
                    <Label req>Street Address</Label>
                    <Input
                      name="address"
                      value={f.address}
                      onChange={change}
                      placeholder="e.g. Old Delhi Road"
                      required
                    />
                  </div>
                  <G3>
                    <div>
                      <Label>Locality / Sector</Label>
                      <Input name="locality" value={f.locality} onChange={change} placeholder="e.g. Sector 14" />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input name="city" value={f.city} onChange={change} placeholder="e.g. Gurugram" />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input name="state" value={f.state} onChange={change} placeholder="e.g. Haryana" />
                    </div>
                    <div>
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        step="any"
                        name="latitude"
                        value={f.latitude}
                        onChange={change}
                        placeholder="e.g. 28.4595"
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        step="any"
                        name="longitude"
                        value={f.longitude}
                        onChange={change}
                        placeholder="e.g. 77.0266"
                      />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select name="currency" value={f.currency} onChange={change}>
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                      </Select>
                    </div>
                  </G3>
                </div>
              </Card>

              <Card title="Developer Info">
                <G2>
                  <div>
                    <Label>Developer Name</Label>
                    <Input
                      name="developerName"
                      value={f.developerName}
                      onChange={change}
                      placeholder="e.g. SPJ Group"
                    />
                  </div>
                  <div>
                    <Label>RERA ID</Label>
                    <Input name="reraId" value={f.reraId} onChange={change} placeholder="RC/REP/HARERA/GGM/..." />
                  </div>
                  <div>
                    <ImageUpload
                      label="Developer Logo"
                      value={f.developerLogo}
                      onChange={(url) => setF({ ...f, developerLogo: url as string })}
                      maxSize={100}
                    />
                  </div>
                  <div />
                  <div>
                    <Label>Launch Date</Label>
                    <Input type="date" name="launchDate" value={f.launchDate} onChange={change} />
                  </div>
                  <div>
                    <Label>Possession Date</Label>
                    <Input type="date" name="possessionDate" value={f.possessionDate} onChange={change} />
                  </div>
                </G2>
              </Card>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 2 — PRICING
          ────────────────────────────────────────────────────────────────── */}
          {tab === 'pricing' && (
            <div className="space-y-5">
              <Card title="Price Display" desc="These strings are shown as-is on the detail page.">
                <G2>
                  <div>
                    <Label>Base Price (text)</Label>
                    <Input
                      name="basePrice"
                      value={f.basePrice}
                      onChange={change}
                      placeholder="e.g. ₹50 Lakhs onwards"
                    />
                  </div>
                  <div>
                    <Label>Price Range (text)</Label>
                    <Input
                      name="priceRange"
                      value={f.priceRange}
                      onChange={change}
                      placeholder="e.g. ₹50 Lakhs – ₹5.5 Cr+"
                    />
                  </div>
                </G2>
              </Card>

              <Card title="Numeric Price Band" desc="Used for filtering on the projects listing page.">
                <div className="space-y-4">
                  <div>
                    <Label>Quick Select</Label>
                    <Select onChange={selectPriceRange} defaultValue="">
                      <option value="" disabled>
                        Select a range to auto-fill…
                      </option>
                      {priceRanges.map((r) => (
                        <option key={r.label} value={r.label}>
                          {r.label}
                        </option>
                      ))}
                    </Select>
                    <p className="text-xs text-gray-400 mt-1">
                      Selecting auto-fills Min/Max below. You can still edit manually.
                    </p>
                  </div>
                  <G2>
                    <div>
                      <Label>Price Min (₹ numeric)</Label>
                      <Input
                        type="number"
                        name="priceMin"
                        value={f.priceMin}
                        onChange={change}
                        placeholder="e.g. 5000000"
                      />
                      {f.priceMin && (
                        <p className="text-xs text-yellow-600 mt-1 font-medium">{rupeeHint(f.priceMin)}</p>
                      )}
                    </div>
                    <div>
                      <Label>Price Max (₹ numeric)</Label>
                      <Input
                        type="number"
                        name="priceMax"
                        value={f.priceMax}
                        onChange={change}
                        placeholder="e.g. 55000000"
                      />
                      {f.priceMax && (
                        <p className="text-xs text-yellow-600 mt-1 font-medium">{rupeeHint(f.priceMax)}</p>
                      )}
                    </div>
                    <div>
                      <Label>Min Rate PSF</Label>
                      <Input name="minRatePsf" value={f.minRatePsf} onChange={change} placeholder="e.g. ₹16,500" />
                    </div>
                    <div>
                      <Label>Max Rate PSF</Label>
                      <Input name="maxRatePsf" value={f.maxRatePsf} onChange={change} placeholder="e.g. ₹23,500" />
                    </div>
                    <div>
                      <Label>Min Unit Area (sq.ft)</Label>
                      <Input
                        type="number"
                        name="minUnitArea"
                        value={f.minUnitArea}
                        onChange={change}
                        placeholder="e.g. 300"
                      />
                    </div>
                    <div>
                      <Label>Max Unit Area (sq.ft)</Label>
                      <Input
                        type="number"
                        name="maxUnitArea"
                        value={f.maxUnitArea}
                        onChange={change}
                        placeholder="e.g. 2400"
                      />
                    </div>
                  </G2>
                </div>
              </Card>

              <Card title="Unit Statistics" desc="Shown in the sidebar price card.">
                <G4>
                  <div>
                    <Label>Land Area</Label>
                    <Input name="landArea" value={f.landArea} onChange={change} placeholder="e.g. 4.15 Acres" />
                  </div>
                  <div>
                    <Label>Towers</Label>
                    <Input
                      type="number"
                      name="numberOfTowers"
                      value={f.numberOfTowers}
                      onChange={change}
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <Label>Floors</Label>
                    <Input
                      type="number"
                      name="numberOfFloors"
                      value={f.numberOfFloors}
                      onChange={change}
                      placeholder="9"
                    />
                  </div>
                  <div>
                    <Label>Apartments</Label>
                    <Input
                      type="number"
                      name="numberOfApartments"
                      value={f.numberOfApartments}
                      onChange={change}
                      placeholder="48"
                    />
                  </div>
                  <div>
                    <Label>Total Units</Label>
                    <Input type="number" name="totalUnits" value={f.totalUnits} onChange={change} placeholder="320" />
                  </div>
                  <div>
                    <Label>Sold Units</Label>
                    <Input type="number" name="soldUnits" value={f.soldUnits} onChange={change} placeholder="87" />
                  </div>
                  <div>
                    <Label>Available Units</Label>
                    <Input
                      type="number"
                      name="availableUnits"
                      value={f.availableUnits}
                      onChange={change}
                      placeholder="233"
                    />
                  </div>
                </G4>
              </Card>

              <Card title="Pricing Table" desc='Rows shown in "Price & Unit Size Overview" table.'>
                <div className="space-y-4">
                  {pricing.map((row, i) => (
                    <RowBox key={i} onDel={() => delRow(setPricing, i)}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                        <div>
                          <Label>Unit</Label>
                          <Input
                            value={row.unitArea}
                            onChange={(e) => updRow(setPricing, i, 'unitArea', e.target.value)}
                            placeholder="e.g. Unit Type 12 / Shop 14"
                          />
                        </div>
                        <div>
                          <Label>Property Type</Label>
                          <Input
                            value={row.type}
                            onChange={(e) => updRow(setPricing, i, 'type', e.target.value)}
                            placeholder="e.g. Retail Shops"
                          />
                        </div>
                        <div>
                          <Label>RERA Area</Label>
                          <Input
                            value={row.reraArea}
                            onChange={(e) => updRow(setPricing, i, 'reraArea', e.target.value)}
                            placeholder="e.g. 300 – 1,465 Sq.ft"
                          />
                        </div>
                        <div>
                          <Label>Indicative Price</Label>
                          <Input
                            value={row.price}
                            onChange={(e) => updRow(setPricing, i, 'price', e.target.value)}
                            placeholder="e.g. ₹50 Lakhs – ₹2.9 Cr+"
                          />
                        </div>
                        <div>
                          <Label>Price / Sq.ft</Label>
                          <Input
                            value={row.pricePerSqft}
                            onChange={(e) => updRow(setPricing, i, 'pricePerSqft', e.target.value)}
                            placeholder="e.g. ₹16,500 – ₹19,800"
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={row.availabilityStatus}
                            onChange={(e) => updRow(setPricing, i, 'availabilityStatus', e.target.value)}
                          >
                            <option value="available">Available</option>
                            <option value="not-available">Not Available</option>
                          </Select>
                        </div>
                        <div>
                          <Label>Floor Numbers</Label>
                          <Input
                            value={row.floorNumbers}
                            onChange={(e) => updRow(setPricing, i, 'floorNumbers', e.target.value)}
                            placeholder="e.g. Ground – 3rd Floor"
                          />
                        </div>
                      </div>
                    </RowBox>
                  ))}
                  <AddBtn
                    onClick={() =>
                      addRow(setPricing, {
                        unitArea: '',
                        type: '',
                        reraArea: '',
                        price: '',
                        pricePerSqft: '',
                        availabilityStatus: 'available',
                        floorNumbers: '',
                      })
                    }
                    label="Add Pricing Row"
                  />
                </div>
              </Card>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 3 — MEDIA
          ────────────────────────────────────────────────────────────────── */}
          {tab === 'media' && (
            <div className="space-y-5">
              <Card title="Featured & Site Plan Images">
                <G2>
                  <div>
                    <ImageUpload
                      label="Featured Image"
                      value={f.featuredImage}
                      onChange={(url) => setF({ ...f, featuredImage: url as string })}
                      maxSize={100}
                    />
                  </div>
                  <div>
                    <ImageUpload
                      label="Site Plan Image"
                      value={f.sitePlanImage}
                      onChange={(url) => setF({ ...f, sitePlanImage: url as string })}
                      maxSize={100}
                    />
                  </div>
                </G2>
              </Card>

              <Card title="Gallery Images" desc="Additional images shown in the gallery slider.">
                <ImageUpload
                  label="Gallery Images"
                  value={gallery.filter(Boolean)}
                  onChange={(urls) => {
                    const urlArray = Array.isArray(urls) ? urls : [urls];
                    const updated = [...gallery];
                    // Clear existing and add new ones
                    updated.splice(0, updated.length, ...urlArray, '');
                    setGallery(updated);
                  }}
                  multiple={true}
                  maxSize={100}
                />
              </Card>

              <Card title="Video URLs" desc="Supports YouTube (watch/short/embed/shorts) and direct .mp4 links.">
                <div className="space-y-2">
                  {videos.map((url, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => updStr(setVideos, i, e.target.value)}
                        placeholder={`Video ${i + 1} — YouTube or direct URL`}
                      />
                      <DelBtn onClick={() => delStr(setVideos, i)} />
                    </div>
                  ))}
                  <AddBtn onClick={() => addStr(setVideos)} label="Add Video URL" />
                </div>
              </Card>

              <Card title="Floor Plan Images" desc="Shown in the Floor Plans & Layouts section.">
                <div className="space-y-4">
                  {floorPlans.map((fp, i) => (
                    <RowBox key={i} onDel={() => delRow(setFloorPlans, i)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                        <div>
                          <Label>Floor Level</Label>
                          <Input
                            value={fp.level}
                            onChange={(e) => updRow(setFloorPlans, i, 'level', e.target.value)}
                            placeholder="e.g. Ground Floor"
                          />
                        </div>
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={fp.title}
                            onChange={(e) => updRow(setFloorPlans, i, 'title', e.target.value)}
                            placeholder="e.g. High-Street Retail Zone"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Image</Label>
                          <ImageUpload
                            label=""
                            value={fp.imageUrl}
                            onChange={(url) => updRow(setFloorPlans, i, 'imageUrl', url as string)}
                            maxSize={100}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Details</Label>
                          <Input
                            value={fp.details}
                            onChange={(e) => updRow(setFloorPlans, i, 'details', e.target.value)}
                            placeholder="e.g. 42,000 sq.ft · 68 units"
                          />
                        </div>
                      </div>
                    </RowBox>
                  ))}
                  <AddBtn
                    onClick={() => addRow(setFloorPlans, { level: '', title: '', imageUrl: '', details: '' })}
                    label="Add Floor Plan"
                  />
                </div>
              </Card>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 4 — CONTENT
          ────────────────────────────────────────────────────────────────── */}
          {tab === 'content' && (
            <div className="space-y-5">
              {/* Banner */}
              <Card title="Banner" desc="Hero banner title/subtitle shown at the top.">
                <div className="space-y-3">
                  <div>
                    <Label>Banner Title</Label>
                    <Input
                      name="bannerTitle"
                      value={f.bannerTitle}
                      onChange={change}
                      placeholder="e.g. SPJ Vedatam – Premier Commercial Hub"
                    />
                  </div>
                  <div>
                    <Label>Banner Subtitle</Label>
                    <Input
                      name="bannerSubtitle"
                      value={f.bannerSubtitle}
                      onChange={change}
                      placeholder="e.g. Premium high-street retail, dining, entertainment"
                    />
                  </div>
                  <div>
                    <Label>Banner Description</Label>
                    <Textarea
                      name="bannerDescription"
                      value={f.bannerDescription}
                      onChange={change}
                      rows={2}
                      placeholder="Short sentence below the subtitle"
                    />
                  </div>
                </div>
              </Card>

              {/* About / Overview */}
              <Card title="Project Overview" desc='Section 1 on the detail page — "About the project".'>
                <div className="space-y-3">
                  <div>
                    <Label>Section Heading</Label>
                    <Input
                      name="aboutTitle"
                      value={f.aboutTitle}
                      onChange={change}
                      placeholder="e.g. Project Overview – SPJ Vedatam Gurugram"
                    />
                  </div>
                  <div>
                    <Label>Section Body</Label>
                    <Textarea
                      name="aboutDescription"
                      value={f.aboutDescription}
                      onChange={change}
                      rows={6}
                      placeholder="Detailed project description with bullet points..."
                    />
                  </div>
                </div>
              </Card>

              {/* Site Plan text */}
              <Card title="Site Plan Content" desc="Text shown alongside the site plan image.">
                <div className="space-y-3">
                  <div>
                    <Label>Site Plan Title</Label>
                    <Input
                      name="sitePlanTitle"
                      value={f.sitePlanTitle}
                      onChange={change}
                      placeholder="e.g. Location & Site Plan – SPJ Vedatam"
                    />
                  </div>
                  <div>
                    <Label>Site Plan Description</Label>
                    <Textarea
                      name="sitePlanDescription"
                      value={f.sitePlanDescription}
                      onChange={change}
                      rows={2}
                      placeholder="Brief description of the site layout..."
                    />
                  </div>
                </div>
              </Card>

              {/* Highlights */}
              <Card
                title="Highlights / Why Invest"
                desc='Shown in the "Why Invest" section and the sidebar Key Highlights.'
              >
                <div className="space-y-3">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <Input
                        value={h.label}
                        onChange={(e) => updRow(setHighlights, i, 'label', e.target.value)}
                        placeholder="Highlight text — e.g. RERA approved project"
                        className="w-full"
                      />
                      <div className="sm:self-center">
                        <DelBtn onClick={() => delRow(setHighlights, i)} />
                      </div>
                    </div>
                  ))}
                  <AddBtn onClick={() => addRow(setHighlights, { label: '', icon: '' })} label="Add Highlight" />
                </div>
              </Card>

              {/* Offerings */}
              <Card title="Offerings / Space Types" desc="Cards shown in the Retail, F&B & Commercial Spaces section.">
                <div className="space-y-4">
                  {offerings.map((o, i) => (
                    <RowBox key={i} onDel={() => delRow(setOfferings, i)}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-8">
                        <div>
                          <Label>Icon (emoji)</Label>
                          <Input
                            value={o.icon}
                            onChange={(e) => updRow(setOfferings, i, 'icon', e.target.value)}
                            placeholder="🛍"
                          />
                        </div>
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={o.title}
                            onChange={(e) => updRow(setOfferings, i, 'title', e.target.value)}
                            placeholder="e.g. High-Street Retail Shops"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <Label>Description</Label>
                          <Textarea
                            value={o.description}
                            onChange={(e) => updRow(setOfferings, i, 'description', e.target.value)}
                            rows={2}
                            placeholder="Short description of this space type..."
                          />
                        </div>
                      </div>
                    </RowBox>
                  ))}
                  <AddBtn
                    onClick={() => addRow(setOfferings, { icon: '', title: '', description: '' })}
                    label="Add Offering"
                  />
                </div>
              </Card>

              {/* Amenities */}
              <Card title="Amenities & Features" desc="Grouped by category in the Amenities section.">
                <div className="space-y-3">
                  {amenities.map((a, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                        <Input
                          value={a.category}
                          onChange={(e) => updRow(setAmenities, i, 'category', e.target.value)}
                          placeholder="Category (e.g. Parking)"
                        />
                        <Input
                          value={a.name}
                          onChange={(e) => updRow(setAmenities, i, 'name', e.target.value)}
                          placeholder="Amenity name"
                        />
                        <Input
                          value={a.details}
                          onChange={(e) => updRow(setAmenities, i, 'details', e.target.value)}
                          placeholder="Details (optional)"
                        />
                      </div>
                      <DelBtn onClick={() => delRow(setAmenities, i)} />
                    </div>
                  ))}
                  <AddBtn
                    onClick={() => addRow(setAmenities, { category: '', name: '', details: '' })}
                    label="Add Amenity"
                  />
                </div>
              </Card>

              {/* Nearby Points */}
              <Card title="Nearby Points" desc="Distance table shown under Location Advantage.">
                <div className="space-y-3">
                  {nearby.map((n, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
                        <Select value={n.type} onChange={(e) => updRow(setNearby, i, 'type', e.target.value)}>
                          {NEARBY_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {fmtLabel(t)}
                            </option>
                          ))}
                        </Select>
                        <Input
                          value={n.name}
                          onChange={(e) => updRow(setNearby, i, 'name', e.target.value)}
                          placeholder="Place name"
                        />
                        <Input
                          type="number"
                          step="0.1"
                          value={n.distanceKm}
                          onChange={(e) => updRow(setNearby, i, 'distanceKm', e.target.value)}
                          placeholder="Distance km"
                        />
                        <Input
                          type="number"
                          value={n.travelTimeMin}
                          onChange={(e) => updRow(setNearby, i, 'travelTimeMin', e.target.value)}
                          placeholder="Travel min"
                        />
                      </div>
                      <DelBtn onClick={() => delRow(setNearby, i)} />
                    </div>
                  ))}
                  <AddBtn
                    onClick={() => addRow(setNearby, { type: 'METRO', name: '', distanceKm: '', travelTimeMin: '' })}
                    label="Add Nearby Point"
                  />
                </div>
              </Card>

              {/* FAQs */}
              <Card title="FAQs" desc="Shown in the Frequently Asked Questions accordion.">
                <div className="space-y-4">
                  {faqs.map((fq, i) => (
                    <RowBox key={i} onDel={() => delRow(setFaqs, i)}>
                      <div className="space-y-2 pr-8">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-400">#{i + 1}</span>
                          <div className="flex gap-1 ml-auto">
                            <button
                              type="button"
                              disabled={i === 0}
                              onClick={() => moveRow(setFaqs, i, i - 1)}
                              title="Move up"
                              className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={i === faqs.length - 1}
                              onClick={() => moveRow(setFaqs, i, i + 1)}
                              title="Move down"
                              className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                        <div>
                          <Label>Question</Label>
                          <Input
                            value={fq.question}
                            onChange={(e) => updRow(setFaqs, i, 'question', e.target.value)}
                            placeholder="e.g. Where is the project located?"
                          />
                        </div>
                        <div>
                          <Label>Answer</Label>
                          <Textarea
                            value={fq.answer}
                            onChange={(e) => updRow(setFaqs, i, 'answer', e.target.value)}
                            rows={2}
                            placeholder="Detailed answer..."
                          />
                        </div>
                      </div>
                    </RowBox>
                  ))}
                  <AddBtn onClick={() => addRow(setFaqs, { question: '', answer: '' })} label="Add FAQ" />
                </div>
              </Card>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 5 — DETAILS (extra meta)
          ────────────────────────────────────────────────────────────────── */}
          {tab === 'details' && (
            <div className="space-y-5">
              <Card title="Project Branding">
                <p className="text-xs text-gray-400 mb-4">
                  These fields are optional — fill only what is needed for your listing.
                </p>
                <div className="space-y-4">
                  <G2>
                    <div>
                      <Label>minRatePSF (display text)</Label>
                      <Input name="minRatePsf" value={f.minRatePsf} onChange={change} placeholder="e.g. ₹16,500" />
                    </div>
                    <div>
                      <Label>maxRatePSF (display text)</Label>
                      <Input name="maxRatePsf" value={f.maxRatePsf} onChange={change} placeholder="e.g. ₹23,500" />
                    </div>
                  </G2>
                </div>
              </Card>

              <Card title="Quick Review" desc="Summary of all entered data — check before publishing.">
                <div className="text-xs text-gray-600 space-y-2">
                  {[
                    ['Title', f.title || '—'],
                    ['Slug', f.slug || '—'],
                    ['Category', f.category],
                    ['Tags', selectedTags.length ? selectedTags.join(', ') : 'None'],
                    ['Status', f.status],
                    ['Address', [f.address, f.locality, f.city, f.state].filter(Boolean).join(', ') || '—'],
                    ['Price Range', f.priceRange || '—'],
                    ['Price Min', f.priceMin ? rupeeHint(f.priceMin) : '—'],
                    ['Price Max', f.priceMax ? rupeeHint(f.priceMax) : '—'],
                    ['Featured Image', f.featuredImage ? '✅ Set' : '❌ Missing'],
                    ['Gallery', `${gallery.filter(Boolean).length} image(s)`],
                    ['Videos', `${videos.filter(Boolean).length} video(s)`],
                    ['Highlights', `${highlights.filter((h) => h.label).length} row(s)`],
                    ['Amenities', `${amenities.filter((a) => a.name).length} row(s)`],
                    ['Offerings', `${offerings.filter((o) => o.title).length} row(s)`],
                    ['Pricing Table', `${pricing.filter((p) => p.type).length} row(s)`],
                    ['Nearby Points', `${nearby.filter((n) => n.name).length} row(s)`],
                    ['Floor Plans', `${floorPlans.filter((fp) => fp.level).length} row(s)`],
                    ['FAQs', `${faqs.filter((fq) => fq.question).length} row(s)`],
                    ['SEO H1', f.seoH1 || '—'],
                    ['Meta Title', f.seoMetaTitle || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-500 w-36 shrink-0">{k}</span>
                      <span className="text-gray-700 text-right truncate max-w-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────
              TAB 6 — SEO
          ────────────────────────────────────────────────────────────────── */}
          {tab === 'seo' && (
            <div className="space-y-5">
              <Card title="Meta Tags" desc="Shown in Google search results.">
                <div className="space-y-4">
                  <div>
                    <Label>
                      Meta Title <span className="text-gray-400 font-normal">(max 60 chars)</span>
                    </Label>
                    <Input
                      name="seoMetaTitle"
                      value={f.seoMetaTitle}
                      onChange={change}
                      maxLength={60}
                      placeholder="SPJ Vedatam Sector 14 Gurugram – Premium Commercial Property"
                    />
                    <p className="text-xs text-gray-400 mt-1">{f.seoMetaTitle.length}/60 characters</p>
                  </div>
                  <div>
                    <Label>
                      Meta Description <span className="text-gray-400 font-normal">(max 160 chars)</span>
                    </Label>
                    <Textarea
                      name="seoMetaDesc"
                      value={f.seoMetaDesc}
                      onChange={change}
                      maxLength={160}
                      rows={3}
                      placeholder="Explore SPJ Vedatam – a 4.15-acre commercial hub in Sector 14 Gurugram..."
                    />
                    <p className="text-xs text-gray-400 mt-1">{f.seoMetaDesc.length}/160 characters</p>
                  </div>
                  <div>
                    <Label>
                      Meta Keywords <span className="text-gray-400 font-normal">(comma-separated)</span>
                    </Label>
                    <Input
                      name="seoMetaKeywords"
                      value={f.seoMetaKeywords}
                      onChange={change}
                      placeholder="commercial property Gurugram, retail space Sector 14, SPJ Vedatam"
                    />
                  </div>
                </div>
              </Card>

              <Card title="On-Page SEO" desc="Controls the H1 tag and image alt text on the detail page.">
                <G2>
                  <div>
                    <Label>H1 Tag</Label>
                    <Input
                      name="seoH1"
                      value={f.seoH1}
                      onChange={change}
                      placeholder="e.g. SPJ Vedatam – Commercial Spaces in Sector 14 Gurugram"
                    />
                    <p className="text-xs text-gray-400 mt-1">Falls back to project title if empty.</p>
                  </div>
                  <div>
                    <Label>Featured Image Alt Text</Label>
                    <Input
                      name="seoFeaturedImgAlt"
                      value={f.seoFeaturedImgAlt}
                      onChange={change}
                      placeholder="e.g. SPJ Vedatam Commercial Hub Sector 14 Gurugram"
                    />
                  </div>
                </G2>
              </Card>

              <Card title="Location SEO Content" desc='Shown in the "Location Advantage" section.'>
                <div className="space-y-3">
                  <div>
                    <Label>Section Heading</Label>
                    <Input
                      name="seoLocalHeading"
                      value={f.seoLocalHeading}
                      onChange={change}
                      placeholder="e.g. Location Advantage – Sector 14, Gurugram"
                    />
                  </div>
                  <div>
                    <Label>Section Content</Label>
                    <Textarea
                      name="seoLocalContent"
                      value={f.seoLocalContent}
                      onChange={change}
                      rows={8}
                      placeholder="Describe the location advantages, connectivity, nearby landmarks, highway access etc..."
                    />
                  </div>
                </div>
              </Card>

              <Card title="Long-form SEO Content" desc='"Who Should Consider" section — helps with organic rankings.'>
                <div className="space-y-3">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      name="seoLongTitle"
                      value={f.seoLongTitle}
                      onChange={change}
                      placeholder="e.g. Who Should Consider SPJ Vedatam?"
                    />
                  </div>
                  <div>
                    <Label>Section Content</Label>
                    <Textarea
                      name="seoLongContent"
                      value={f.seoLongContent}
                      onChange={change}
                      rows={8}
                      placeholder="Target audience, investment rationale, ideal buyer personas..."
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ── Sticky Bottom Submit Bar ──────────────────────────────────── */}
          <div className="sticky bottom-4 z-30">
            <div className="bg-white border border-gray-200 rounded shadow px-5 py-3 flex items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`cursor-pointer px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition ${
                      tab === t.id ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 rounded border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm disabled:opacity-50 transition"
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="shrink-0 px-6 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm disabled:opacity-50 transition flex items-center gap-2"
                >
                  {saving && (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {saving ? (isEditing ? 'Updating…' : 'Publishing…') : isEditing ? '✓ Update' : '✓ Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export function CreateProjectPageWrapper({ adminMode = false }: CreateProjectPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CreateProjectPage adminMode={adminMode} />
    </Suspense>
  );
}

export default function CreateProjectPageDefault() {
  return <CreateProjectPageWrapper />;
}
