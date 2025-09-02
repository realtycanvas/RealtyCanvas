'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  HomeIcon, 
  PhotoIcon, 
  StarIcon, 
  BuildingOfficeIcon, 
  MapPinIcon,
  DocumentTextIcon,
  EyeIcon,
  SparklesIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import MultiStepProcess from '@/components/ui/MultiStepProcess';
import ImageUpload from '@/components/ui/ImageUpload';
import VideoUpload from '@/components/ui/VideoUpload';
import IconSelector from '@/components/ui/IconSelector';
import FloorPlanManager from '@/components/ui/FloorPlanManager';
import PricingTableManager from '@/components/ui/PricingTableManager';
import LocationMapManager from '@/components/ui/LocationMapManager';
import BuyerInfoManager from '@/components/ui/BuyerInfoManager';
import JsonImportExport from '@/components/ui/JsonImportExport';
import SectionJsonManager from '@/components/ui/SectionJsonManager';
import { getSampleDataBySection } from '@/utils/sampleSectionData';
import AdminRouteGuard from '@/components/AdminRouteGuard';

// Define the steps for the project creation process
const steps = [
  { 
    id: 'basic', 
    name: 'Basic Info', 
    description: 'Project details and location',
    icon: HomeIcon
  },
  { 
    id: 'photos', 
    name: 'Photos', 
    description: 'Upload project images',
    icon: PhotoIcon
  },
  { 
    id: 'videos', 
    name: 'Videos', 
    description: 'Upload project videos',
    icon: VideoCameraIcon
  },
  { 
    id: 'features', 
    name: 'Features', 
    description: 'Highlights and amenities',
    icon: StarIcon
  },
  { 
    id: 'units', 
    name: 'Units', 
    description: 'Unit types and pricing',
    icon: BuildingOfficeIcon
  },
  { 
    id: 'floorplans', 
    name: 'Floor Plans', 
    description: 'Layout and floor information',
    icon: DocumentTextIcon
  },
  { 
    id: 'pricing', 
    name: 'Pricing', 
    description: 'Pricing table and rates',
    icon: CurrencyRupeeIcon
  },
  { 
    id: 'location', 
    name: 'Location', 
    description: 'Location map and connectivity',
    icon: MapPinIcon
  },
  { 
    id: 'anchors', 
    name: 'Anchors', 
    description: 'Anchor tenants',
    icon: BuildingOfficeIcon
  },
  { 
    id: 'buyers', 
    name: 'Buyers', 
    description: 'Buyer information tracking',
    icon: UserGroupIcon
  },
  { 
    id: 'faqs', 
    name: 'FAQs', 
    description: 'Common questions',
    icon: DocumentTextIcon
  },
  { 
    id: 'review', 
    name: 'Review', 
    description: 'Final review and publish',
    icon: EyeIcon
  },
];

import { Suspense } from 'react';

function UnifiedProjectFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  // Project basic info
  const [project, setProject] = useState({
    title: '',
    subtitle: '',
    description: '',
    address: '',
    locality: '',
    city: '',
    state: '',
    reraId: '',
    developerName: '',
    possessionDate: '',
    featuredImage: '',
    galleryImages: '',
    bannerTitle: '',
    bannerSubtitle: '',
    bannerDescription: '',
    aboutTitle: '',
    aboutDescription: '',
    category: 'COMMERCIAL' as 'COMMERCIAL' | 'RESIDENTIAL' | 'MIXED_USE',
    status: 'PLANNED' as 'PLANNED' | 'UNDER_CONSTRUCTION' | 'READY',
    basePrice: '',
    priceRange: '',
    videoUrl: '',
    minRatePsf: '',
    maxRatePsf: '',
    isTrending: false,
    // Residential project specific fields
    landArea: '',
    numberOfTowers: '',
    numberOfApartments: '',
  });

  // Video state
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  // Units to be added
  const [units, setUnits] = useState([
    { unitNumber: '', type: 'RETAIL', floor: 'GF', areaSqFt: '' }
  ]);

  // Highlights, amenities, anchors, FAQs
  const [highlights, setHighlights] = useState([{ label: '', icon: '' }]);
  const [amenities, setAmenities] = useState([{ category: 'Retail', name: '', details: '', icon: '' }]);
  const [anchors, setAnchors] = useState([{ name: '', category: 'Fashion', floor: 'GF', areaSqFt: '', icon: '' }]);
  const [faqs, setFaqs] = useState([{ question: '', answer: '' }]);

  // New sections
  const [floorPlans, setFloorPlans] = useState<any[]>([]);
  const [pricingTable, setPricingTable] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any>({
    mapImage: '',
    nearbyPoints: [],
    coordinates: { latitude: 0, longitude: 0 }
  });
  const [buyerInfo, setBuyerInfo] = useState<any[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [isAIAssisted, setIsAIAssisted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load existing project data when in edit mode
  useEffect(() => {
    const editSlug = searchParams.get('edit');
    if (editSlug) {
      setEditingProjectId(editSlug);
      loadProjectData(editSlug);
    }
  }, [searchParams]);

  const loadProjectData = async (projectSlug: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectSlug}`);
      if (!response.ok) {
        throw new Error('Failed to load project data');
      }
      const projectData = await response.json();
      
      // Load project basic info
      setProject({
        title: projectData.title || '',
        subtitle: projectData.subtitle || '',
        description: projectData.description || '',
        address: projectData.address || '',
        locality: projectData.locality || '',
        city: projectData.city || '',
        state: projectData.state || '',
        reraId: projectData.reraId || '',
        developerName: projectData.developerName || '',
        possessionDate: projectData.possessionDate ? (() => {
          try {
            const date = new Date(projectData.possessionDate);
            if (isNaN(date.getTime())) {
              console.warn('Invalid possession date from API:', projectData.possessionDate);
              return '';
            }
            return date.toISOString().split('T')[0];
          } catch (error) {
            console.warn('Error parsing possession date from API:', projectData.possessionDate, error);
            return '';
          }
        })() : '',
        featuredImage: projectData.featuredImage || '',
        galleryImages: Array.isArray(projectData.galleryImages) ? projectData.galleryImages.join(', ') : '',
        bannerTitle: projectData.bannerTitle || '',
        bannerSubtitle: projectData.bannerSubtitle || '',
        bannerDescription: projectData.bannerDescription || '',
        aboutTitle: projectData.aboutTitle || '',
        aboutDescription: projectData.aboutDescription || '',
        category: projectData.category || 'COMMERCIAL',
        status: projectData.status || 'PLANNED',
        basePrice: projectData.basePrice?.toString() || '',
        priceRange: projectData.priceRange || '',
        videoUrl: projectData.videoUrl || '',
        minRatePsf: projectData.minRatePsf || '',
        maxRatePsf: projectData.maxRatePsf || '',
        isTrending: projectData.isTrending || false,
        // Residential project specific fields
        landArea: projectData.landArea || '',
        numberOfTowers: projectData.numberOfTowers?.toString() || '',
        numberOfApartments: projectData.numberOfApartments?.toString() || '',
      });

      // Load video URLs
      if (Array.isArray(projectData.videoUrls)) {
        setVideoUrls(projectData.videoUrls);
      }

      // Load highlights
      if (Array.isArray(projectData.highlights) && projectData.highlights.length > 0) {
        setHighlights(projectData.highlights.map((h: any) => ({
          label: h.label || '',
          icon: h.icon || ''
        })));
      }

      // Load amenities
      if (Array.isArray(projectData.amenities) && projectData.amenities.length > 0) {
        setAmenities(projectData.amenities.map((a: any) => ({
          category: a.category || 'General',
          name: a.name || '',
          details: a.details || '',
          icon: a.icon || ''
        })));
      }

      // Load units
      if (Array.isArray(projectData.units) && projectData.units.length > 0) {
        setUnits(projectData.units.map((u: any) => ({
          unitNumber: u.unitNumber || '',
          type: u.type || 'RETAIL',
          floor: u.floor || 'GF',
          areaSqFt: u.areaSqFt?.toString() || ''
        })));
      }

      // Load anchors
      if (Array.isArray(projectData.anchors) && projectData.anchors.length > 0) {
        setAnchors(projectData.anchors.map((a: any) => ({
          name: a.name || '',
          category: a.category || 'Fashion',
          floor: a.floor || 'GF',
          areaSqFt: a.areaSqFt?.toString() || '',
          icon: ''
        })));
      }

      // Load FAQs
      if (Array.isArray(projectData.faqs) && projectData.faqs.length > 0) {
        setFaqs(projectData.faqs.map((f: any) => ({
          question: f.question || '',
          answer: f.answer || ''
        })));
      } else {
        // Clear default empty FAQ if no FAQs exist
        setFaqs([{ question: '', answer: '' }]);
      }

      // Load floor plans
      console.log('Floor plans from API:', projectData.floorPlans);
      if (Array.isArray(projectData.floorPlans) && projectData.floorPlans.length > 0) {
        console.log('Setting floor plans:', projectData.floorPlans);
        setFloorPlans(projectData.floorPlans);
      } else {
        console.log('No floor plans found or invalid data');
      }

      // Load pricing table
      if (Array.isArray(projectData.pricingTable) && projectData.pricingTable.length > 0) {
        setPricingTable(projectData.pricingTable);
      }

      // Load location data (map image, nearby points, coordinates)
      setLocationData({
        mapImage: projectData.sitePlanImage || '',
        nearbyPoints: Array.isArray(projectData.nearbyPoints) ? projectData.nearbyPoints : [],
        coordinates: {
          latitude: projectData.latitude || 0,
          longitude: projectData.longitude || 0
        }
      });

    } catch (error) {
      console.error('Error loading project data:', error);
      alert('Failed to load project data for editing');
    } finally {
      setIsLoading(false);
    }
  };

  // Step completion validation
  const isStepComplete = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Basic Info
        return !!(project.title && project.description && project.address);
      case 1: // Photos
        return !!project.featuredImage || !!project.galleryImages;
      case 2: // Videos
        return true; // Optional step
      case 3: // Features
        return highlights.some(h => h.label) || amenities.some(a => a.name);
      case 4: // Units
        return units.some(u => u.unitNumber?.trim());
      case 5: // Floor Plans
        return true; // Optional step
      case 6: // Pricing
        return true; // Optional step
      case 7: // Location
        return true; // Optional step
      case 8: // Anchors
        return project.category === 'RESIDENTIAL' || anchors.some(a => a.name);
      case 9: // Buyers
        return true; // Optional step
      case 10: // FAQs
        return true; // Optional step
      case 11: // Review
        return true;
      default:
        return false;
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      // Save current step data to prevent duplication
      if (editingProjectId) {
        setSubmitting(true);
        try {
          // Only save the current step data without recreating all nested data
          const projectPayload = {
            title: project.title,
            subtitle: project.subtitle,
            description: project.description,
            category: project.category || 'COMMERCIAL',
            status: project.status || 'PLANNED',
            reraId: project.reraId,
            developerName: project.developerName,
            possessionDate: project.possessionDate ? new Date(project.possessionDate) : undefined,
            address: project.address,
            locality: project.locality,
            city: project.city,
            state: project.state,
            featuredImage: project.featuredImage,
            galleryImages: project.galleryImages ? project.galleryImages.split(',').map(url => url.trim()) : [],
            videoUrl: project.videoUrl,
            videoUrls: videoUrls,
            basePrice: project.basePrice ? parseFloat(project.basePrice) : undefined,
            priceRange: project.priceRange,
            bannerTitle: project.bannerTitle,
            bannerSubtitle: project.bannerSubtitle,
            bannerDescription: project.bannerDescription,
            aboutTitle: project.aboutTitle,
            aboutDescription: project.aboutDescription,
            minRatePsf: project.minRatePsf,
            maxRatePsf: project.maxRatePsf,
            // Add residential project specific fields
            landArea: project.landArea || null,
            numberOfTowers: project.numberOfTowers ? parseInt(project.numberOfTowers) : null,
            numberOfApartments: project.numberOfApartments ? parseInt(project.numberOfApartments) : null,
          };

          // Update project basic info without recreating nested data
          await fetch(`/api/projects/${editingProjectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectPayload),
          });
        } catch (error) {
          console.error('Error saving current step data:', error);
        } finally {
          setSubmitting(false);
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Auto-detect project category based on unit types
  const getProjectCategory = () => {
    const unitTypes = units.map(u => u.type);
    const hasCommercial = unitTypes.some(t => ['RETAIL', 'ANCHOR', 'FOOD_COURT', 'MULTIPLEX', 'OFFICE', 'KIOSK'].includes(t));
    const hasResidential = unitTypes.some(t => ['APARTMENT', 'STUDIO', 'VILLA', 'PLOT'].includes(t));
    
    if (hasCommercial && hasResidential) return 'MIXED_USE';
    if (hasResidential) return 'RESIDENTIAL';
    return 'COMMERCIAL';
  };

  const addUnit = () => {
    setUnits([...units, { unitNumber: '', type: 'RETAIL', floor: 'GF', areaSqFt: '' }]);
  };

  const updateUnit = (index: number, field: string, value: string) => {
    const updated = [...units];
    updated[index] = { ...updated[index], [field]: value };
    setUnits(updated);
  };

  const removeUnit = (index: number) => {
    if (units.length > 1) {
      setUnits(units.filter((_, i) => i !== index));
    }
  };

  const addHighlight = () => {
    setHighlights([...highlights, { label: '', icon: '' }]);
  };

  const updateHighlight = (index: number, field: string, value: string) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: value };
    setHighlights(updated);
  };

  const addAmenity = () => {
    setAmenities([...amenities, { category: 'Retail', name: '', details: '', icon: '' }]);
  };

  const updateAmenity = (index: number, field: string, value: string) => {
    const updated = [...amenities];
    updated[index] = { ...updated[index], [field]: value };
    setAmenities(updated);
  };

  const addAnchor = () => {
    setAnchors([...anchors, { name: '', category: 'Fashion', floor: 'GF', areaSqFt: '', icon: '' }]);
  };

  const updateAnchor = (index: number, field: string, value: string) => {
    const updated = [...anchors];
    updated[index] = { ...updated[index], [field]: value };
    setAnchors(updated);
  };

  const removeAnchor = (index: number) => {
    if (anchors.length > 1) {
      setAnchors(anchors.filter((_, i) => i !== index));
    }
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  // AI assistance functions
  const generateWithAI = async (type: string) => {
    if (!isAIAssisted) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          data: {
            title: project.title,
            category: project.category,
            address: project.address,
            unitTypes: units.map(u => u.type),
            amenities: amenities.map(a => a.name)
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        switch (type) {
          case 'description':
            setProject(prev => ({ ...prev, description: result.content }));
            break;
          case 'highlights':
            setHighlights(result.content);
            break;
          case 'amenities':
            setAmenities(result.content);
            break;
          case 'faqs':
            setFaqs(result.content);
            break;
        }
      }
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // JSON Import function
  const handleJsonImport = (data: any) => {
    try {
      console.log('Importing JSON data:', data);
      
      // Handle both flat structure and nested structure (with project key)
      const projectData = data.project || data;
      const highlightsData = data.highlights || [];
      const amenitiesData = data.amenities || [];
      const unitsData = data.units || [];
      const faqsData = data.faqs || [];
      const floorPlansData = data.floorPlans || [];
      const pricingPlansData = data.pricingPlans || [];
      const pricingTableData = data.pricingTable || [];
      const nearbyPointsData = data.nearbyPoints || [];
      const anchorsData = data.anchors || [];
      const mediaData = data.media || [];

      // Import basic project info with comprehensive mapping
      setProject({
        title: projectData.title || '',
        subtitle: projectData.subtitle || '',
        description: projectData.description || '',
        address: projectData.address || '',
        locality: projectData.locality || '',
        city: projectData.city || '',
        state: projectData.state || '',
        reraId: projectData.reraId || '',
        developerName: projectData.developerName || '',
        possessionDate: projectData.possessionDate ? (() => {
          try {
            const date = new Date(projectData.possessionDate);
            if (isNaN(date.getTime())) {
              console.warn('Invalid possession date from import:', projectData.possessionDate);
              return '';
            }
            return date.toISOString().split('T')[0];
          } catch (error) {
            console.warn('Error parsing possession date from import:', projectData.possessionDate, error);
            return '';
          }
        })() : '',
        featuredImage: projectData.featuredImage || '',
        galleryImages: Array.isArray(projectData.galleryImages) 
          ? projectData.galleryImages.join(', ') 
          : projectData.galleryImages || '',
        bannerTitle: projectData.bannerTitle || '',
        bannerSubtitle: projectData.bannerSubtitle || '',
        bannerDescription: projectData.bannerDescription || '',
        aboutTitle: projectData.aboutTitle || '',
        aboutDescription: projectData.aboutDescription || '',
        category: projectData.category || 'COMMERCIAL',
        status: projectData.status || 'PLANNED',
        basePrice: projectData.basePrice?.toString() || '',
        priceRange: projectData.priceRange || '',
        videoUrl: projectData.videoUrl || '',
        minRatePsf: projectData.minRatePsf || '',
        maxRatePsf: projectData.maxRatePsf || '',
        isTrending: projectData.isTrending || false,
        // Residential project specific fields
        landArea: projectData.landArea || '',
        numberOfTowers: projectData.numberOfTowers?.toString() || '',
        numberOfApartments: projectData.numberOfApartments?.toString() || '',
      });

      // Import video URLs
      if (Array.isArray(projectData.videoUrls)) {
        setVideoUrls(projectData.videoUrls);
      }
      
      // Import highlights with proper mapping
      if (Array.isArray(highlightsData) && highlightsData.length > 0) {
        const mappedHighlights = highlightsData.map((h: any) => ({
          label: h.label || '',
          icon: h.icon || ''
        }));
        setHighlights(mappedHighlights);
        console.log('Imported highlights:', mappedHighlights);
      }
      
      // Import amenities with proper mapping
      if (Array.isArray(amenitiesData) && amenitiesData.length > 0) {
        const mappedAmenities = amenitiesData.map((a: any) => ({
          category: a.category || 'General',
          name: a.name || '',
          details: a.details || '',
          icon: ''
        }));
        setAmenities(mappedAmenities);
        console.log('Imported amenities:', mappedAmenities);
      }
      
      // Import units with proper mapping
      if (Array.isArray(unitsData) && unitsData.length > 0) {
        const mappedUnits = unitsData.map((u: any) => ({
          unitNumber: u.unitNumber || '',
          type: u.type || 'RETAIL',
          floor: u.floor || 'GF',
          areaSqFt: u.areaSqFt?.toString() || ''
        }));
        setUnits(mappedUnits);
        console.log('Imported units:', mappedUnits);
      }
      
      // Import FAQs with proper mapping
      if (Array.isArray(faqsData) && faqsData.length > 0) {
        const mappedFaqs = faqsData.map((f: any) => ({
          question: f.question || '',
          answer: f.answer || ''
        }));
        setFaqs(mappedFaqs);
        console.log('Imported FAQs:', mappedFaqs);
      } else {
        // Clear to default empty FAQ if no FAQs to import
        setFaqs([{ question: '', answer: '' }]);
      }
      
      // Import floor plans
      if (Array.isArray(floorPlansData) && floorPlansData.length > 0) {
        setFloorPlans(floorPlansData);
        console.log('Imported floor plans:', floorPlansData);
      }
      
      // Import pricing table
      if (Array.isArray(pricingTableData) && pricingTableData.length > 0) {
        setPricingTable(pricingTableData);
        console.log('Imported pricing table:', pricingTableData);
      }
      
      // Import anchors with proper mapping
      if (Array.isArray(anchorsData) && anchorsData.length > 0) {
        const mappedAnchors = anchorsData.map((a: any) => ({
          name: a.name || '',
          category: a.category || 'Fashion',
          floor: a.floor || 'GF',
          areaSqFt: a.areaSqFt?.toString() || '',
          icon: ''
        }));
        setAnchors(mappedAnchors);
        console.log('Imported anchors:', mappedAnchors);
      }
      
      // Import location data (map image, nearby points, coordinates)
      setLocationData({
        mapImage: projectData.sitePlanImage || '',
        nearbyPoints: Array.isArray(nearbyPointsData) ? nearbyPointsData : [],
        coordinates: {
          latitude: projectData.latitude || 0,
          longitude: projectData.longitude || 0
        }
      });
      console.log('Imported location data:', {
        mapImage: projectData.sitePlanImage,
        nearbyPoints: nearbyPointsData,
        coordinates: { latitude: projectData.latitude, longitude: projectData.longitude }
      });

      // If gallery images are in media array, extract them
      if (Array.isArray(mediaData) && mediaData.length > 0) {
        const galleryUrls = mediaData
          .filter((m: any) => m.type === 'IMAGE')
          .map((m: any) => m.url)
          .filter(Boolean);
        
        if (galleryUrls.length > 0) {
          setProject(prev => ({ 
            ...prev, 
            galleryImages: galleryUrls.join(', ')
          }));
          console.log('Imported gallery images from media:', galleryUrls);
        }
      }
      
      // Import buyer info
      if (data.buyerInfo && Array.isArray(data.buyerInfo)) {
        setBuyerInfo(data.buyerInfo);
        console.log('Imported buyer info:', data.buyerInfo);
      }
      
      console.log('JSON import completed successfully!');
      alert('JSON data imported successfully! All form fields have been updated. You can now navigate through the steps to see the imported data.');
    } catch (error) {
      console.error('Import error:', error);
      alert('Error importing JSON data. Please check the format.');
    }
  };

  // Export current data as JSON
  const getExportData = () => {
    return {
      title: project.title,
      subtitle: project.subtitle,
      description: project.description,
      category: project.category,
      basePrice: project.basePrice ? parseInt(project.basePrice) : null,
      priceRange: project.priceRange,
      address: project.address,
      locality: project.locality,
      city: project.city,
      state: project.state,
      reraId: project.reraId,
      developerName: project.developerName,
      possessionDate: project.possessionDate,
      featuredImage: project.featuredImage,
      galleryImages: project.galleryImages ? project.galleryImages.split(',').map(img => img.trim()) : [],
      videoUrl: project.videoUrl,
      videoUrls,
      highlights,
      amenities,
      units,
      floorPlans,
      pricingTable,
      locationData,
      anchors,
      buyerInfo,
      faqs
    };
  };

  const handleSubmit = async () => {
    // Validate required fields before submission
    if (!project.title || !project.description || !project.address || !project.featuredImage) {
      const missingFields = [];
      if (!project.title) missingFields.push('Title');
      if (!project.description) missingFields.push('Description');
      if (!project.address) missingFields.push('Address');
      if (!project.featuredImage) missingFields.push('Featured Image');
      
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setSubmitting(false);
      return;
    }

    setSubmitting(true);

    try {
      const projectPayload = {
        ...project,
        category: project.category, // Use manually selected category instead of auto-detection
        galleryImages: project.galleryImages ? project.galleryImages.split(',').map(s => s.trim()).filter(Boolean) : [],
        videoUrl: project.videoUrl || undefined,
        videoUrls: videoUrls.filter(Boolean),
        possessionDate: project.possessionDate && project.possessionDate.trim() !== '' ? (() => {
          try {
            const date = new Date(project.possessionDate);
            if (isNaN(date.getTime())) {
              console.warn('Invalid possession date provided:', project.possessionDate);
              return undefined;
            }
            return date.toISOString();
          } catch (error) {
            console.warn('Error parsing possession date:', project.possessionDate, error);
            return undefined;
          }
        })() : undefined,
        // Add location data
        sitePlanImage: locationData.mapImage || null,
        latitude: locationData.coordinates?.latitude || null,
        longitude: locationData.coordinates?.longitude || null,
        // Add residential project specific fields
        landArea: project.landArea || null,
        numberOfTowers: project.numberOfTowers ? parseInt(project.numberOfTowers) : null,
        numberOfApartments: project.numberOfApartments ? parseInt(project.numberOfApartments) : null,
      };

      let projectResult;

      if (editingProjectId) {
        // Update existing project - use comprehensive import API for complete replacement
        // Debug log to check data
        console.log('DEBUG - Form Data Before Save:', {
          pricingTable,
          floorPlans: floorPlans.map(fp => ({ 
            level: fp.level, 
            title: fp.title, 
            imageUrl: fp.imageUrl,
            hasImage: !!fp.imageUrl 
          })),
          faqs,
          locationData: {
            mapImage: locationData.mapImage,
            hasMapImage: !!locationData.mapImage,
            nearbyPointsCount: locationData.nearbyPoints?.length || 0
          }
        });

        const fullProjectData = {
          project: { ...projectPayload, id: editingProjectId },
          highlights: highlights.filter(h => h.label).map((h, index) => ({
            label: h.label,
            icon: h.icon || null,
            sortOrder: index + 1
          })),
          amenities: amenities.filter(a => a.name).map((a, index) => ({
            category: a.category || 'General',
            name: a.name,
            details: a.details || null,
            sortOrder: index + 1
          })),
          faqs: faqs.filter(f => f.question && f.answer).map((f, index) => ({
            question: f.question,
            answer: f.answer,
            sortOrder: index + 1
          })),
          media: [] as Array<{
            type: string;
            url: string;
            caption: string;
            tags: string[];
            floor: string | null;
            sortOrder: number;
          }>, // Will be populated from gallery images
          floorPlans: floorPlans.filter(fp => fp.level && fp.imageUrl).map((fp, index) => ({
            level: fp.level,
            title: fp.title || null,
            imageUrl: fp.imageUrl,
            details: fp.details || null,
            sortOrder: index + 1
          })),
          documents: [],
          configurations: [],
          units: units.filter(u => u.unitNumber?.trim()).map(u => ({
            unitNumber: u.unitNumber,
            type: u.type,
            floor: u.floor || 'N/A',
            areaSqFt: u.areaSqFt && u.areaSqFt.trim() && u.areaSqFt.toLowerCase() !== 'n/a' ? u.areaSqFt.trim() : '0',
            availability: 'AVAILABLE'
          })),
          anchors: project.category !== 'RESIDENTIAL' ? anchors.filter(a => a.name).map(a => ({
            name: a.name,
            category: a.category,
            status: 'PLANNED',
            floor: a.floor,
            areaSqFt: a.areaSqFt && a.areaSqFt.trim() ? a.areaSqFt.trim() : null
          })) : [],
          pricingTable: pricingTable,
          construction: [],
          nearbyPoints: (locationData.nearbyPoints || []) as Array<{
            type: string;
            name: string;
            distanceKm?: number;
            travelTimeMin?: number;
          }>
        };

        // Add media from gallery images
        if (projectPayload.galleryImages && projectPayload.galleryImages.length > 0) {
          fullProjectData.media = projectPayload.galleryImages.map((url, index) => ({
            type: 'IMAGE',
            url: url,
            caption: `Gallery Image ${index + 1}`,
            tags: ['gallery'],
            floor: null,
            sortOrder: index
          }));
        }

        // First, delete existing nested data to avoid duplicates
        try {
          console.log('Starting deletion of existing nested data...');
          
          // Execute DELETE requests sequentially to ensure completion
          const endpointsToDelete = [
            { name: 'highlights', url: `/api/projects/${editingProjectId}/highlights` },
            { name: 'amenities', url: `/api/projects/${editingProjectId}/amenities` },
            { name: 'units', url: `/api/projects/${editingProjectId}/units` },
            { name: 'faqs', url: `/api/projects/${editingProjectId}/faqs` },
            { name: 'media', url: `/api/projects/${editingProjectId}/media` },
            { name: 'floorPlans', url: `/api/projects/${editingProjectId}/floorPlans` },
            { name: 'anchors', url: `/api/projects/${editingProjectId}/anchors` },
            { name: 'nearbyPoints', url: `/api/projects/${editingProjectId}/nearbyPoints` },
            { name: 'pricingTable', url: `/api/projects/pricingTable?projectId=${editingProjectId}` }
          ];
          
          // Process each deletion sequentially with proper error handling
          const deletionResults = [];
          for (const endpoint of endpointsToDelete) {
            try {
              console.log(`Deleting ${endpoint.name}...`);
              const response = await fetch(endpoint.url, { 
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              
              if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                console.warn(`Failed to delete ${endpoint.name}: ${response.status} ${response.statusText} - ${errorText}`);
                deletionResults.push({ name: endpoint.name, success: false, error: `${response.status}: ${errorText}` });
              } else {
                console.log(`Successfully deleted ${endpoint.name}`);
                deletionResults.push({ name: endpoint.name, success: true });
                // Increased delay to ensure database operations complete
                await new Promise(resolve => setTimeout(resolve, 200));
              }
            } catch (err) {
              console.error(`Error deleting ${endpoint.name}:`, err);
              deletionResults.push({ name: endpoint.name, success: false, error: err instanceof Error ? err.message : String(err) });
            }
          }
          
          // Check if critical deletions failed
          const failedDeletions = deletionResults.filter(r => !r.success);
          if (failedDeletions.length > 0) {
            console.warn('Some deletions failed:', failedDeletions);
            // Wait additional time for any pending database operations
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          
          console.log('Deletion process completed');
        } catch (error) {
          console.error('Error during delete operations:', error);
          // Wait before proceeding to ensure database consistency
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.warn('Proceeding with update after error recovery delay');
        }

        // Update project basic info
        const projectRes = await fetch(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectPayload),
        });

        if (!projectRes.ok) throw new Error('Failed to update project');
        projectResult = await projectRes.json();

        // Recreate all nested data - filter out empty items first
        const validHighlights = fullProjectData.highlights.filter(h => h.label?.trim());
        const validAmenities = fullProjectData.amenities.filter(a => a.name?.trim());
        const validUnits = fullProjectData.units.filter(u => u.unitNumber?.trim());
        const validAnchors = fullProjectData.anchors.filter(a => a.name?.trim());
        
        console.log(`Creating: ${validHighlights.length} highlights, ${validAmenities.length} amenities, ${validUnits.length} units, ${validAnchors.length} anchors`);
        
        try {
          console.log('Starting creation of new items...');
          
          // Create highlights sequentially
          console.log(`Creating ${validHighlights.length} highlights...`);
          for (const highlight of validHighlights) {
            try {
              if (!highlight.label?.trim()) continue;
              
              const response = await fetch('/api/projects/highlights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: editingProjectId, ...highlight }),
              });
              
              if (!response.ok) {
                console.warn(`Failed to create highlight: ${highlight.label}`);
              }
            } catch (err) {
              console.error('Error creating highlight:', err);
            }
          }
          
          // Create amenities in batches for better performance
          console.log(`Creating ${validAmenities.length} amenities...`);
          const amenityBatchSize = 5;
          for (let i = 0; i < validAmenities.length; i += amenityBatchSize) {
            const batch = validAmenities.slice(i, i + amenityBatchSize);
            const batchPromises = batch.map(async (amenity) => {
              try {
                if (!amenity.name?.trim()) return null;
                
                const response = await fetch('/api/projects/amenities', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ projectId: editingProjectId, ...amenity }),
                });
                
                if (!response.ok) {
                  const errorText = await response.text().catch(() => 'Unknown error');
                  console.warn(`Failed to create amenity: ${amenity.name} - ${errorText}`);
                  return { success: false, name: amenity.name, error: errorText };
                }
                return { success: true, name: amenity.name };
              } catch (err) {
                console.error('Error creating amenity:', err);
                return { success: false, name: amenity.name, error: err instanceof Error ? err.message : String(err) };
              }
            });
            
            await Promise.all(batchPromises);
            // Small delay between batches to prevent overwhelming the database
            if (i + amenityBatchSize < validAmenities.length) {
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
          
          // Create units sequentially
          console.log(`Creating ${validUnits.length} units...`);
          for (const unit of validUnits) {
            try {
              if (!unit.unitNumber?.trim()) continue;
              
              const response = await fetch(`/api/projects/${editingProjectId}/units`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(unit),
              });
              
              if (!response.ok) {
                console.warn(`Failed to create unit: ${unit.unitNumber}`);
              }
            } catch (err) {
              console.error('Error creating unit:', err);
            }
          }
          
          // Create anchors sequentially
          console.log(`Creating ${validAnchors.length} anchors...`);
          for (const anchor of validAnchors) {
            try {
              if (!anchor.name?.trim()) continue;
              
              const response = await fetch('/api/projects/anchors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: editingProjectId, ...anchor }),
              });
              
              if (!response.ok) {
                console.warn(`Failed to create anchor: ${anchor.name}`);
              }
            } catch (err) {
              console.error('Error creating anchor:', err);
            }
          }
        } catch (error) {
          console.error('Error recreating nested data:', error);
          throw new Error('Failed to recreate nested data');
        }
        // Create remaining nested data sequentially
        try {
          // Create floor plans
          const validFloorPlans = fullProjectData.floorPlans.filter(fp => fp.level?.trim() && fp.imageUrl?.trim());
          console.log(`Creating ${validFloorPlans.length} floor plans...`);
          
          for (const floorPlan of validFloorPlans) {
            try {
              console.log(`Creating floor plan: ${floorPlan.level}`);
              const response = await fetch('/api/projects/floorPlans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: editingProjectId, ...floorPlan }),
              });
              
              if (!response.ok) {
                console.error('Floor plan creation failed:', response.status, response.statusText);
                const error = await response.json().catch(() => ({}));
                console.error('Floor plan error details:', error);
              } else {
                console.log(`Floor plan created successfully: ${floorPlan.level}`);
              }
              
              // Small delay to prevent overwhelming the server
              await new Promise(resolve => setTimeout(resolve, 50));
            } catch (err) {
              console.error('Error creating floor plan:', err);
            }
          }
          
          // Create FAQs
          const validFaqs = fullProjectData.faqs.filter(f => f.question?.trim() && f.answer?.trim());
          console.log(`Creating ${validFaqs.length} FAQs...`);
          
          for (const faq of validFaqs) {
            try {
              const response = await fetch('/api/projects/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: editingProjectId, ...faq }),
              });
              
              if (!response.ok) {
                console.warn(`Failed to create FAQ: ${faq.question.substring(0, 30)}...`);
              }
            } catch (err) {
              console.error('Error creating FAQ:', err);
            }
          }
          
          // Create media
          const validMedia = fullProjectData.media.filter((m: any) => m.url?.trim());
          console.log(`Creating ${validMedia.length} media items...`);
          
          for (const media of validMedia) {
            try {
              const response = await fetch('/api/projects/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: editingProjectId, ...media }),
              });
              
              if (!response.ok) {
                console.warn(`Failed to create media: ${media.caption || 'Unnamed'}`);
              }
            } catch (err) {
              console.error('Error creating media:', err);
            }
          }
          
          // Create pricing table entries
          const validPricingRows = fullProjectData.pricingTable.filter(p => p.unitType?.trim());
          console.log(`Creating ${validPricingRows.length} pricing table rows...`);
          
          for (const pricingRow of validPricingRows) {
            try {
              const response = await fetch('/api/projects/pricingTable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: editingProjectId, ...pricingRow }),
              });
              
              if (!response.ok) {
                console.warn(`Failed to create pricing row: ${pricingRow.unitType}`);
              }
            } catch (err) {
              console.error('Error creating pricing row:', err);
            }
          }
          
          // Create nearby points
          const validNearbyPoints = fullProjectData.nearbyPoints.filter((np: any) => np.name?.trim() && np.type?.trim());
          console.log(`Creating ${validNearbyPoints.length} nearby points...`);
          
          for (const nearbyPoint of validNearbyPoints) {
            try {
              const response = await fetch('/api/projects/nearbyPoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: editingProjectId, ...nearbyPoint }),
              });
              
              if (!response.ok) {
                console.warn(`Failed to create nearby point: ${nearbyPoint.name}`);
              }
            } catch (err) {
              console.error('Error creating nearby point:', err);
            }
          }
          
          console.log('All nested data creation completed');
        } catch (error) {
          console.error('Error creating remaining nested data:', error);
          // Continue with the process even if some items fail
        }

      } else {
        // Create new project
      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload),
      });

      if (!projectRes.ok) throw new Error('Failed to create project');
        projectResult = await projectRes.json();

      // Add units
      for (const unit of units.filter(u => u.unitNumber?.trim())) {
        const unitPayload = {
          unitNumber: unit.unitNumber,
          type: unit.type,
          floor: unit.floor || 'N/A',
          areaSqFt: unit.areaSqFt && unit.areaSqFt.trim() && unit.areaSqFt.toLowerCase() !== 'n/a' ? unit.areaSqFt.trim() : '0',
        };

          await fetch(`/api/projects/${projectResult.id}/units`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(unitPayload),
        });
      }

      // Add highlights
      for (const highlight of highlights.filter(h => h.label)) {
        await fetch('/api/projects/highlights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              projectId: projectResult.id,
            label: highlight.label,
            icon: highlight.icon || null,
          }),
        });
      }

      // Add amenities
      for (const amenity of amenities.filter(a => a.name)) {
        await fetch('/api/projects/amenities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              projectId: projectResult.id,
            category: amenity.category,
            name: amenity.name,
            details: amenity.details || null,
          }),
        });
      }

      // Add anchors (for commercial projects)
      if (project.category !== 'RESIDENTIAL') {
        for (const anchor of anchors.filter(a => a.name)) {
          await fetch('/api/projects/anchors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: projectResult.id,
              name: anchor.name,
              category: anchor.category,
              floor: anchor.floor,
              areaSqFt: anchor.areaSqFt && anchor.areaSqFt.trim() ? anchor.areaSqFt.trim() : null,
            }),
          });
          }
        }

      // Add FAQs
      for (const faq of faqs.filter(f => f.question && f.answer)) {
        await fetch('/api/projects/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: projectResult.id,
            question: faq.question,
            answer: faq.answer,
          }),
        });
      }

      // Add floor plans
      for (const floorPlan of floorPlans.filter(fp => fp.level && fp.imageUrl)) {
        await fetch('/api/projects/floorPlans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: projectResult.id,
            level: floorPlan.level,
            title: floorPlan.title || null,
            imageUrl: floorPlan.imageUrl,
            details: floorPlan.details || null,
          }),
        });
      }

      // Add pricing table
      for (const pricingRow of pricingTable.filter(pr => pr.unitType)) {
        await fetch('/api/projects/pricingTable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: projectResult.id,
            ...pricingRow,
          }),
        });
      }

      // Add location data (nearby points)
      const validNearbyPoints = (locationData.nearbyPoints || []).filter((np: any) => np.name?.trim() && np.type?.trim());
      for (const nearbyPoint of validNearbyPoints) {
        await fetch('/api/projects/nearbyPoints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: projectResult.id,
            ...nearbyPoint,
          }),
        });
      }
      }

      router.push(`/projects/${projectResult.slug}`);
    } catch (err) {
      console.error(err);
      alert(editingProjectId ? 'Error updating project' : 'Error creating project');
    } finally {
      setSubmitting(false);
    }
  };

  const category = project.category; // Use manually selected category

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Project details and location information</p>
              </div>
              <SectionJsonManager
                sectionName="Basic Info"
                data={{
                  title: project.title,
                  subtitle: project.subtitle,
                  description: project.description,
                  category: project.category,
                  status: project.status,
                  address: project.address,
                  city: project.city,
                  state: project.state,
                  reraId: project.reraId,
                  developerName: project.developerName,
                  possessionDate: project.possessionDate
                }}
                onImport={(data) => {
                  setProject(prev => ({ ...prev, ...data }));
                }}
                sampleData={getSampleDataBySection('basic')}
              />
            </div>
            {/* AI Assistant Toggle */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    AI-Powered Project Assistant
                  </h4>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Enable AI to help generate compelling descriptions and content
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAIAssisted(!isAIAssisted)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isAIAssisted
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  {isAIAssisted ? 'AI Enabled' : 'Enable AI'}
                </button>
        </div>
      </div>

            {/* Project Category Selection */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Project Category</h4>
              <div className="grid grid-cols-3 gap-3">
                {['COMMERCIAL', 'RESIDENTIAL', 'MIXED_USE'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProject(prev => ({ ...prev, category: cat as any }))}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      project.category === cat
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Status Selection */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Project Status</h4>
              <div className="grid grid-cols-3 gap-3">
                {['PLANNED', 'UNDER_CONSTRUCTION', 'READY'].map((stat) => (
                  <button
                    key={stat}
                    type="button"
                    onClick={() => setProject(prev => ({ ...prev, status: stat as any }))}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      project.status === stat
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {stat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Toggle */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    🔥 Trending Project
                  </h4>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Mark this project as trending to boost its visibility
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setProject(prev => ({ ...prev, isTrending: !prev.isTrending }))}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    project.isTrending
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {project.isTrending ? '🔥 Trending' : 'Make Trending'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Project Title *"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.title}
              onChange={e => setProject(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <input
              placeholder="Subtitle"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.subtitle}
              onChange={e => setProject(prev => ({ ...prev, subtitle: e.target.value }))}
            />
            <textarea
              placeholder="Description *"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
                rows={4}
              value={project.description}
              onChange={e => setProject(prev => ({ ...prev, description: e.target.value }))}
              required
            />
            <input
              placeholder="Address *"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.address}
              onChange={e => setProject(prev => ({ ...prev, address: e.target.value }))}
              required
            />
            <input
              placeholder="Locality (e.g., Sector 25)"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.locality}
              onChange={e => setProject(prev => ({ ...prev, locality: e.target.value }))}
            />
            <input
              placeholder="City"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.city}
              onChange={e => setProject(prev => ({ ...prev, city: e.target.value }))}
            />
            <input
              placeholder="State"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.state}
              onChange={e => setProject(prev => ({ ...prev, state: e.target.value }))}
            />
            <input
              placeholder="RERA ID"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.reraId}
              onChange={e => setProject(prev => ({ ...prev, reraId: e.target.value }))}
            />
            <input
              placeholder="Developer Name"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.developerName}
              onChange={e => setProject(prev => ({ ...prev, developerName: e.target.value }))}
            />
            <input
              type="date"
              placeholder="Possession Date"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={project.possessionDate}
              onChange={e => setProject(prev => ({ ...prev, possessionDate: e.target.value }))}
            />
            <input
                placeholder="Base Price (e.g., ₹50 Lakhs, ₹2 Crores)"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={project.basePrice}
                onChange={e => setProject(prev => ({ ...prev, basePrice: e.target.value }))}
              />
              <input
                placeholder="Price Range (e.g., ₹50L - ₹2Cr)"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={project.priceRange}
                onChange={e => setProject(prev => ({ ...prev, priceRange: e.target.value }))}
              />
              <input
                placeholder="Min Rate per Sq Ft (₹)"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={project.minRatePsf}
                onChange={e => setProject(prev => ({ ...prev, minRatePsf: e.target.value }))}
              />
              <input
                placeholder="Max Rate per Sq Ft (₹)"
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={project.maxRatePsf}
                onChange={e => setProject(prev => ({ ...prev, maxRatePsf: e.target.value }))}
              />
            </div>

            {/* Residential Project Specific Fields */}
            {project.category === 'RESIDENTIAL' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-4">
                  🏠 Residential Project Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    placeholder="Land Area (e.g., 2.5 Acres, 10,000 sq ft)"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={project.landArea}
                    onChange={e => setProject(prev => ({ ...prev, landArea: e.target.value }))}
                  />
                  <input
                    type="number"
                    placeholder="Number of Towers"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={project.numberOfTowers}
                    onChange={e => setProject(prev => ({ ...prev, numberOfTowers: e.target.value }))}
                  />
                  <input
                    type="number"
                    placeholder="Number of Apartments"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={project.numberOfApartments}
                    onChange={e => setProject(prev => ({ ...prev, numberOfApartments: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* AI Description Generator */}
            {isAIAssisted && project.title && project.address && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      AI Description Generator
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Generate a compelling project description using AI
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => generateWithAI('description')}
                    disabled={isGenerating}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Generate Description
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      case 1: // Photos
        return (
          <div className="space-y-8">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Images</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Featured image and gallery photos</p>
              </div>
              <SectionJsonManager
                sectionName="Photos"
                data={{
                  featuredImage: project.featuredImage,
                  galleryImages: project.galleryImages ? project.galleryImages.split(',').map(img => img.trim()) : []
                }}
                onImport={(data) => {
                  if (data.featuredImage) {
                    setProject(prev => ({ ...prev, featuredImage: data.featuredImage }));
                  }
                  if (data.galleryImages && Array.isArray(data.galleryImages)) {
                    setProject(prev => ({ ...prev, galleryImages: data.galleryImages.join(', ') }));
                  }
                }}
                sampleData={{
                  featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200",
                  galleryImages: [
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
                    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
                  ]
                }}
              />
            </div>
            {/* Featured Image */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Featured Image</h3>
              <ImageUpload
              value={project.featuredImage}
                onChange={(url) => setProject(prev => ({ ...prev, featuredImage: url }))}
                placeholder="Upload or enter featured image URL"
                folder="projects/featured"
            />
          </div>

            {/* Gallery Images */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Gallery Images
                {project.galleryImages && project.galleryImages.split(',').filter(Boolean).length > 0 && (
                  <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                    ({project.galleryImages.split(',').filter(Boolean).length} images)
                  </span>
                )}
              </h3>
              
              {/* Gallery Image Display */}
              {project.galleryImages && project.galleryImages.split(',').filter(Boolean).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {project.galleryImages.split(',').filter(Boolean).map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url.trim()}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                      <button
                        onClick={() => {
                          const images = project.galleryImages.split(',').filter(Boolean);
                          images.splice(index, 1);
                          setProject(prev => ({ ...prev, galleryImages: images.join(', ') }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Gallery Upload */}
              <ImageUpload
                value=""
                onChange={(urls) => {
                  const existingImages = project.galleryImages ? project.galleryImages.split(',').filter(Boolean) : [];
                  const newImages = urls.split(',').filter(Boolean);
                  const allImages = [...existingImages, ...newImages];
                  setProject(prev => ({ ...prev, galleryImages: allImages.join(', ') }));
                }}
                placeholder="Upload or enter gallery image URLs"
                folder="projects/gallery"
                multiple={true}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                For multiple URLs, separate them with commas. Click &quot;Add&quot; button to add images to gallery.
              </p>
        </div>
          </div>
        );

      case 2: // Videos
        return (
          <div className="space-y-8">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Videos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Main video and additional video content</p>
              </div>
              <SectionJsonManager
                sectionName="Videos"
                data={{
                  videoUrl: project.videoUrl,
                  videoUrls: videoUrls
                }}
                onImport={(data) => {
                  if (data.videoUrl) {
                    setProject(prev => ({ ...prev, videoUrl: data.videoUrl }));
                  }
                  if (data.videoUrls && Array.isArray(data.videoUrls)) {
                    setVideoUrls(data.videoUrls);
                  }
                }}
                sampleData={getSampleDataBySection('videos')}
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Videos</h3>
              <VideoUpload
                value={videoUrls}
                onChange={setVideoUrls}
                mainVideo={project.videoUrl}
                onMainVideoChange={(url) => setProject(prev => ({ ...prev, videoUrl: url }))}
                label="Upload project videos and virtual tours"
              />
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Video Tips
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Add a main project overview video for maximum impact</li>
                  <li>• Include virtual tours, construction progress, or unit walkthroughs</li>
                  <li>• Support for YouTube, Vimeo links or direct video uploads</li>
                  <li>• Recommended format: MP4, max size: 100MB</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 3: // Features
        return (
          <div className="space-y-8">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Features</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Highlights and amenities</p>
              </div>
              <SectionJsonManager
                sectionName="Features"
                data={{
                  highlights: highlights,
                  amenities: amenities
                }}
                onImport={(data) => {
                  if (data.highlights) setHighlights(data.highlights);
                  if (data.amenities) setAmenities(data.amenities);
                }}
                sampleData={getSampleDataBySection('features')}
              />
            </div>
            {/* AI Highlights Generator */}
            {isAIAssisted && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-green-900 dark:text-green-100">
                      AI Highlights Generator
                    </h4>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Generate project highlights based on your project details
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => generateWithAI('highlights')}
                    disabled={isGenerating}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Generate Highlights
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Highlights */}
            <div>
          <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Project Highlights</h3>
                <button 
                  type="button" 
                  onClick={addHighlight} 
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Add Highlight
                </button>
              </div>
              <div className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <input
                      placeholder="Highlight (e.g., Prime Location)"
                      className="col-span-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={highlight.label}
                      onChange={e => updateHighlight(index, 'label', e.target.value)}
                    />
                    <IconSelector
                      selectedIcon={highlight.icon}
                      onSelect={(icon) => updateHighlight(index, 'icon', icon)}
                      className="col-span-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = highlights.filter((_, i) => i !== index);
                        setHighlights(updated);
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Amenities Generator */}
            {isAIAssisted && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      AI Amenities Generator
                    </h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Generate amenities based on your project category
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => generateWithAI('amenities')}
                    disabled={isGenerating}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Generate Amenities
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Amenities */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Amenities</h3>
                <button 
                  type="button" 
                  onClick={addAmenity} 
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                >
                  Add Amenity
                </button>
              </div>
              <div className="space-y-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-5 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <select
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={amenity.category}
                      onChange={e => updateAmenity(index, 'category', e.target.value)}
                    >
                      <option value="Recreation">Recreation</option>
                      <option value="Security">Security</option>
                      <option value="Parking">Parking</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Business">Business</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Convenience">Convenience</option>
                      <option value="Technology">Technology</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Food & Dining">Food & Dining</option>
                    </select>
                    <input
                      placeholder="Amenity Name"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={amenity.name}
                      onChange={e => updateAmenity(index, 'name', e.target.value)}
                    />
                    <IconSelector
                      selectedIcon={amenity.icon}
                      onSelect={(icon) => updateAmenity(index, 'icon', icon)}
                    />
                    <input
                      placeholder="Details"
                      className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      value={amenity.details}
                      onChange={e => updateAmenity(index, 'details', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = amenities.filter((_, i) => i !== index);
                        setAmenities(updated);
                      }}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4: // Units
        return (
          <div>
            <div className="flex justify-between items-center mb-10 flex-col">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Units/Inventory</h3>
                {/* <p className="text-sm text-gray-600 dark:text-gray-400">Unit types and pricing information</p> */}
              </div>
              <div className="flex items-center gap-3 mb-10">
                <SectionJsonManager
                  sectionName="Units"
                  data={units}
                  onImport={(data) => {
                    // Ensure proper data format with string values
                    const formattedUnits = Array.isArray(data) ? data : [data];
                    const processedUnits = formattedUnits.map(unit => ({
                      unitNumber: unit.unitNumber || '',
                      type: unit.type || 'RETAIL',
                      floor: unit.floor || 'GF',
                      areaSqFt: unit.areaSqFt?.toString() || '',
                      ratePsf: unit.ratePsf?.toString() || '',
                      priceTotal: unit.priceTotal?.toString() || ''
                    }));
                    setUnits(processedUnits);
                  }}
                  sampleData={getSampleDataBySection('units')}
                />
                <button 
                type="button" 
                onClick={addUnit} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
              Add Unit
            </button>
          </div>
            
            {/* Helpful info box */}
            {/* <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Units Input Tips
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• <strong>Unit Number is required</strong> - All other fields are optional</li>
                <li>• Area can be a single value (e.g., "1200") or range (e.g., "1200-2700")</li>
                <li>• For unknown values, use "N/A" or "0"</li>
                <li>• Floor examples: "Ground Floor", "1st Floor", "3rd & 4th Floor"</li>
                <li>• Sample data shows real project structure for reference</li>
              </ul>
            </div> */}
            
            <div className="space-y-4">
          {units.map((unit, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <input
                placeholder="Unit #"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={unit.unitNumber}
                onChange={e => updateUnit(index, 'unitNumber', e.target.value)}
              />
              <select
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={unit.type}
                onChange={e => updateUnit(index, 'type', e.target.value)}
              >
                <optgroup label="Commercial">
                  <option value="RETAIL">Retail</option>
                  <option value="ANCHOR">Anchor</option>
                  <option value="FOOD_COURT">Food Court</option>
                  <option value="MULTIPLEX">Multiplex</option>
                  <option value="OFFICE">Office</option>
                  <option value="KIOSK">Kiosk</option>
                </optgroup>
                <optgroup label="Residential">
                  <option value="APARTMENT">Apartment</option>
                  <option value="STUDIO">Studio</option>
                  <option value="VILLA">Villa</option>
                  <option value="PLOT">Plot</option>
                </optgroup>
              </select>
              <input
                placeholder="Floor (e.g., Ground Floor, 1st Floor)"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={unit.floor}
                onChange={e => updateUnit(index, 'floor', e.target.value)}
              />
              <input
                placeholder="Area (e.g., 1200 or 1200-2700)"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={unit.areaSqFt}
                onChange={e => updateUnit(index, 'areaSqFt', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeUnit(index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                disabled={units.length === 1}
              >
                    Remove
              </button>
            </div>
          ))}
        </div>
          </div>
          </div>
        );

      case 8: // Anchors (moved to correct position)
        return category !== 'RESIDENTIAL' ? (
          <div className="space-y-6">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Anchor Tenants</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Major tenants and anchor stores</p>
              </div>
              <div className="flex items-center gap-3">
                <SectionJsonManager
                  sectionName="Anchors"
                  data={anchors}
                  onImport={(data) => {
                    // Ensure proper data format with string values
                    const formattedAnchors = Array.isArray(data) ? data : [data];
                    const processedAnchors = formattedAnchors.map(anchor => ({
                      name: anchor.name || '',
                      category: anchor.category || 'Fashion',
                      floor: anchor.floor || 'GF',
                      areaSqFt: anchor.areaSqFt?.toString() || '',
                      icon: anchor.icon || ''
                    }));
                    setAnchors(processedAnchors);
                  }}
                  sampleData={getSampleDataBySection('anchors')}
                />
                <button 
                  type="button" 
                  onClick={addAnchor} 
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Add Anchor
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {anchors.map((anchor, index) => (
                <div key={index} className="grid grid-cols-5 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <input
                    placeholder="Anchor Name"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={anchor.name}
                    onChange={e => updateAnchor(index, 'name', e.target.value)}
                  />
              <select
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={anchor.category}
                    onChange={e => updateAnchor(index, 'category', e.target.value)}
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Hypermarket">Hypermarket</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Cinema">Cinema</option>
                <option value="F&B">F&B</option>
              </select>
              <input
                    placeholder="Floor"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={anchor.floor}
                    onChange={e => updateAnchor(index, 'floor', e.target.value)}
              />
              <input
                    placeholder="Area (e.g., 1200 or 1200-2700)"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={anchor.areaSqFt}
                    onChange={e => updateAnchor(index, 'areaSqFt', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeAnchor(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Anchor tenants not applicable for residential projects.</p>
          </div>
        );

      case 5: // Floor Plans
        return (
          <div className="space-y-6">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Floor Plans</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Layout and floor information</p>
              </div>
              <SectionJsonManager
                sectionName="Floor Plans"
                data={floorPlans}
                onImport={(data) => {
                  setFloorPlans(Array.isArray(data) ? data : [data]);
                }}
                sampleData={getSampleDataBySection('floorplans')}
              />
            </div>
            <FloorPlanManager
              value={floorPlans}
              onChange={setFloorPlans}
            />
          </div>
        );

      case 6: // Pricing
        return (
          <div className="space-y-6">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing Table</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pricing information and rate structures</p>
              </div>
              <SectionJsonManager
                sectionName="Pricing Table"
                data={pricingTable}
                onImport={(data) => {
                  setPricingTable(Array.isArray(data) ? data : [data]);
                }}
                sampleData={getSampleDataBySection('pricing')}
              />
            </div>
            <PricingTableManager
              value={pricingTable}
              onChange={setPricingTable}
            />
          </div>
        );

      case 7: // Location
        return (
          <div className="space-y-6">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location & Connectivity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Map, coordinates and nearby points</p>
              </div>
              <SectionJsonManager
                sectionName="Location"
                data={locationData}
                onImport={(data) => {
                  setLocationData(data);
                }}
                sampleData={getSampleDataBySection('location')}
              />
            </div>
            <LocationMapManager
              value={locationData}
              onChange={setLocationData}
            />
          </div>
        );



      case 9: // Buyers
        return (
          <BuyerInfoManager
            value={buyerInfo}
            onChange={setBuyerInfo}
          />
        );

      case 10: // FAQs
        return (
          <div className="space-y-8">
            {/* Section Header with JSON Manager */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Common questions and answers</p>
              </div>
              <SectionJsonManager
                sectionName="FAQs"
                data={faqs}
                onImport={(data) => {
                  setFaqs(Array.isArray(data) ? data : [data]);
                }}
                sampleData={getSampleDataBySection('faqs')}
              />
            </div>
            {/* AI FAQ Generator */}
            {isAIAssisted && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      AI FAQ Generator
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Generate relevant FAQs for your project
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => generateWithAI('faqs')}
                    disabled={isGenerating}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        Generate FAQs
                      </>
                    )}
                  </button>
                </div>
          </div>
        )}

            {/* FAQs */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Frequently Asked Questions</h3>
          <button
                  type="button" 
                  onClick={addFaq} 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Add FAQ
          </button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="space-y-3">
                      <input
                        placeholder="Question"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        value={faq.question}
                        onChange={e => updateFaq(index, 'question', e.target.value)}
                      />
                      <textarea
                        placeholder="Answer"
                        rows={3}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        value={faq.answer}
                        onChange={e => updateFaq(index, 'answer', e.target.value)}
                      />
          <button
            type="button"
                        onClick={() => {
                          const updated = faqs.filter((_, i) => i !== index);
                          setFaqs(updated);
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Remove FAQ
          </button>
        </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 11: // Review
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Review Your Project</h3>
              <p className="text-gray-600 dark:text-gray-300">Please review all information before publishing your project.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Project Title</h4>
                <p className="text-gray-600 dark:text-gray-300">{project.title || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Category</h4>
                <p className="text-blue-600 dark:text-blue-400 font-medium">{project.category}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Base Price</h4>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  {project.basePrice ? `₹${parseInt(project.basePrice).toLocaleString('en-IN')}` : 'Not specified'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Price Range</h4>
                <p className="text-gray-600 dark:text-gray-300">{project.priceRange || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-300">{project.description || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Address</h4>
                <p className="text-gray-600 dark:text-gray-300">{project.address || 'Not provided'}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Units Count</h4>
                <p className="text-gray-600 dark:text-gray-300">{units.filter(u => u.unitNumber).length} units configured</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Highlights</h4>
                <p className="text-gray-600 dark:text-gray-300">{highlights.filter(h => h.label).length} highlights added</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Amenities</h4>
                <p className="text-gray-600 dark:text-gray-300">{amenities.filter(a => a.name).length} amenities configured</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">FAQs</h4>
                <p className="text-gray-600 dark:text-gray-300">{faqs.filter(f => f.question).length} FAQs added</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Floor Plans</h4>
                <p className="text-gray-600 dark:text-gray-300">{floorPlans.length} floor plans configured</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pricing Table</h4>
                <p className="text-gray-600 dark:text-gray-300">{pricingTable.length} pricing entries</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Location Data</h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {locationData.nearbyPoints?.length || 0} nearby landmarks
                  {locationData.mapImage && ' • Map uploaded'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Anchor Tenants</h4>
                <p className="text-gray-600 dark:text-gray-300">{anchors.filter(a => a.name).length} anchor tenants</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Buyer Information</h4>
                <p className="text-gray-600 dark:text-gray-300">{buyerInfo.length} buyer records</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading project data...</p>
              </div>
            </div>
          </div>
        </div>
      );
  }

  return (
      <div className="pt-16">
        {/* Header with JSON Import/Export */}
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {editingProjectId ? "Edit Project" : "Create New Project"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {editingProjectId ? "Update your project information" : "Follow the step-by-step process or import from JSON"}
              </p>
            </div>
            <JsonImportExport
              onImport={handleJsonImport}
              exportData={getExportData()}
              title="Project JSON Manager"
            />
          </div>
        </div>

        <MultiStepProcess
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onNext={nextStep}
          onPrevious={prevStep}
          onSubmit={handleSubmit}
          isStepComplete={isStepComplete}
          isSubmitting={submitting}
          finalButtonText={editingProjectId ? "Update Project" : "Create Project"}
        >
          {renderStepContent()}
        </MultiStepProcess>
      </div>
    );
}

export default function UnifiedProjectForm() {
  return (
    <AdminRouteGuard>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading project form...</p>
              </div>
            </div>
          </div>
        </div>
      }>
        <UnifiedProjectFormContent />
      </Suspense>
    </AdminRouteGuard>
  );
}
