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

export default function UnifiedProjectForm() {
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
    basePrice: '',
    priceRange: '',
    videoUrl: '',
    minRatePsf: '',
    maxRatePsf: '',
  });

  // Video state
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  // Units to be added
  const [units, setUnits] = useState([
    { unitNumber: '', type: 'RETAIL', floor: 'GF', areaSqFt: '', ratePsf: '', priceTotal: '' }
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
    const editId = searchParams.get('edit');
    if (editId) {
      setEditingProjectId(editId);
      loadProjectData(editId);
    }
  }, [searchParams]);

  const loadProjectData = async (projectId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`);
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
        possessionDate: projectData.possessionDate ? new Date(projectData.possessionDate).toISOString().split('T')[0] : '',
        featuredImage: projectData.featuredImage || '',
        galleryImages: Array.isArray(projectData.galleryImages) ? projectData.galleryImages.join(', ') : '',
        bannerTitle: projectData.bannerTitle || '',
        bannerSubtitle: projectData.bannerSubtitle || '',
        bannerDescription: projectData.bannerDescription || '',
        aboutTitle: projectData.aboutTitle || '',
        aboutDescription: projectData.aboutDescription || '',
        category: projectData.category || 'COMMERCIAL',
        basePrice: projectData.basePrice?.toString() || '',
        priceRange: projectData.priceRange || '',
        videoUrl: projectData.videoUrl || '',
        minRatePsf: projectData.minRatePsf || '',
        maxRatePsf: projectData.maxRatePsf || '',
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
          areaSqFt: u.areaSqFt?.toString() || '',
          ratePsf: u.ratePsf?.toString() || '',
          priceTotal: u.priceTotal?.toString() || ''
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
        return units.some(u => u.unitNumber && u.areaSqFt);
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
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
    setUnits([...units, { unitNumber: '', type: 'RETAIL', floor: 'GF', areaSqFt: '', ratePsf: '', priceTotal: '' }]);
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
        possessionDate: projectData.possessionDate ? new Date(projectData.possessionDate).toISOString().split('T')[0] : '',
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
        basePrice: projectData.basePrice?.toString() || '',
        priceRange: projectData.priceRange || '',
        videoUrl: projectData.videoUrl || '',
        minRatePsf: projectData.minRatePsf || '',
        maxRatePsf: projectData.maxRatePsf || '',
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
          areaSqFt: u.areaSqFt?.toString() || '',
          ratePsf: u.ratePsf?.toString() || '',
          priceTotal: u.priceTotal?.toString() || ''
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
    setSubmitting(true);

    try {
      const projectPayload = {
        ...project,
        category: getProjectCategory(),
        galleryImages: project.galleryImages ? project.galleryImages.split(',').map(s => s.trim()).filter(Boolean) : [],
        videoUrl: project.videoUrl || undefined,
        videoUrls: videoUrls.filter(Boolean),
        possessionDate: project.possessionDate ? new Date(project.possessionDate).toISOString() : undefined,
        // Add location data
        sitePlanImage: locationData.mapImage || null,
        latitude: locationData.coordinates?.latitude || null,
        longitude: locationData.coordinates?.longitude || null,
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
          units: units.filter(u => u.unitNumber && u.areaSqFt).map(u => ({
            unitNumber: u.unitNumber,
            type: u.type,
            floor: u.floor,
            areaSqFt: parseInt(u.areaSqFt),
            ratePsf: u.ratePsf ? parseFloat(u.ratePsf) : null,
            priceTotal: u.priceTotal ? parseInt(u.priceTotal) : null,
            availability: 'AVAILABLE'
          })),
          anchors: getProjectCategory() !== 'RESIDENTIAL' ? anchors.filter(a => a.name).map(a => ({
            name: a.name,
            category: a.category,
            status: 'PLANNED',
            floor: a.floor,
            areaSqFt: a.areaSqFt ? parseInt(a.areaSqFt) : null
          })) : [],
          pricingPlans: pricingTable,
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
        await Promise.all([
          fetch(`/api/projects/${editingProjectId}/highlights`, { method: 'DELETE' }).catch(() => {}),
          fetch(`/api/projects/${editingProjectId}/amenities`, { method: 'DELETE' }).catch(() => {}),
          fetch(`/api/projects/${editingProjectId}/units`, { method: 'DELETE' }).catch(() => {}),
          fetch(`/api/projects/${editingProjectId}/faqs`, { method: 'DELETE' }).catch(() => {}),
          fetch(`/api/projects/${editingProjectId}/media`, { method: 'DELETE' }).catch(() => {}),
          fetch(`/api/projects/${editingProjectId}/floorPlans`, { method: 'DELETE' }).catch(() => {}),
          fetch(`/api/projects/${editingProjectId}/anchors`, { method: 'DELETE' }).catch(() => {}),
          fetch(`/api/projects/${editingProjectId}/nearbyPoints`, { method: 'DELETE' }).catch(() => {}),
          fetch(`/api/projects/pricingTable?projectId=${editingProjectId}`, { method: 'DELETE' }).catch(() => {}),
        ]);

        // Update project basic info
        const projectRes = await fetch(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectPayload),
        });

        if (!projectRes.ok) throw new Error('Failed to update project');
        projectResult = await projectRes.json();

        // Recreate all nested data
        await Promise.all([
          // Create highlights
          ...fullProjectData.highlights.map(highlight =>
            fetch('/api/projects/highlights', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...highlight }),
            })
          ),
          // Create amenities
          ...fullProjectData.amenities.map(amenity =>
            fetch('/api/projects/amenities', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...amenity }),
            })
          ),
          // Create units
          ...fullProjectData.units.map(unit =>
            fetch(`/api/projects/${editingProjectId}/units`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(unit),
            })
          ),
          // Create anchors
          ...fullProjectData.anchors.map(anchor =>
            fetch('/api/projects/anchors', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...anchor }),
            })
          ),
          // Create floor plans
          ...fullProjectData.floorPlans.map(floorPlan => {
            console.log('Creating floor plan:', { projectId: editingProjectId, ...floorPlan });
            return fetch('/api/projects/floorPlans', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...floorPlan }),
            }).then(response => {
              if (!response.ok) {
                console.error('Floor plan creation failed:', response.status, response.statusText);
                return response.json().then(error => {
                  console.error('Floor plan error details:', error);
                });
              }
              return response.json().then(result => {
                console.log('Floor plan created successfully:', result);
              });
            });
          }),
          // Create FAQs
          ...fullProjectData.faqs.map(faq =>
            fetch('/api/projects/faqs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...faq }),
            })
          ),
          // Create media
          ...fullProjectData.media.map((media: any) =>
            fetch('/api/projects/media', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...media }),
            })
          ),
          // Create pricing plans
          ...fullProjectData.pricingPlans.map(pricingPlan =>
            fetch('/api/projects/pricingPlans', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...pricingPlan }),
            })
          ),
          // Create pricing table
          ...pricingTable.map(pricingRow =>
            fetch('/api/projects/pricingTable', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...pricingRow }),
            })
          ),
          // Create nearby points
          ...fullProjectData.nearbyPoints.map((nearbyPoint: any) =>
            fetch('/api/projects/nearbyPoints', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ projectId: editingProjectId, ...nearbyPoint }),
            })
          ),
        ]);

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
      for (const unit of units.filter(u => u.unitNumber && u.areaSqFt)) {
        const unitPayload = {
          unitNumber: unit.unitNumber,
          type: unit.type,
          floor: unit.floor,
          areaSqFt: parseInt(unit.areaSqFt),
          ratePsf: unit.ratePsf ? parseFloat(unit.ratePsf) : undefined,
          priceTotal: unit.priceTotal ? parseInt(unit.priceTotal) : undefined,
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
      if (getProjectCategory() !== 'RESIDENTIAL') {
        for (const anchor of anchors.filter(a => a.name)) {
          await fetch('/api/projects/anchors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: projectResult.id,
              name: anchor.name,
              category: anchor.category,
              floor: anchor.floor,
              areaSqFt: anchor.areaSqFt ? parseInt(anchor.areaSqFt) : null,
            }),
          });
          }
        }
      }

      router.push(`/projects/${projectResult.id}`);
    } catch (err) {
      console.error(err);
      alert(editingProjectId ? 'Error updating project' : 'Error creating project');
    } finally {
      setSubmitting(false);
    }
  };

  const category = getProjectCategory();

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
  return (
          <div className="space-y-6">
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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Units/Inventory</h3>
              <button 
                type="button" 
                onClick={addUnit} 
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
              Add Unit
            </button>
          </div>
            <div className="space-y-4">
          {units.map((unit, index) => (
                <div key={index} className="grid grid-cols-2 md:grid-cols-6 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
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
                placeholder="Floor"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={unit.floor}
                onChange={e => updateUnit(index, 'floor', e.target.value)}
              />
              <input
                placeholder="Area (sq ft)"
                type="number"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={unit.areaSqFt}
                onChange={e => updateUnit(index, 'areaSqFt', e.target.value)}
              />
              <input
                placeholder="Rate/sq ft"
                type="number"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                value={unit.ratePsf}
                onChange={e => updateUnit(index, 'ratePsf', e.target.value)}
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
        );

      case 4: // Anchors
        return category !== 'RESIDENTIAL' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Anchor Tenants</h3>
              <button 
                type="button" 
                onClick={addAnchor} 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Add Anchor
            </button>
          </div>
            <div className="space-y-4">
              {anchors.map((anchor, index) => (
                <div key={index} className="grid grid-cols-4 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
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
                    placeholder="Area (sq ft)"
                    type="number"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    value={anchor.areaSqFt}
                    onChange={e => updateAnchor(index, 'areaSqFt', e.target.value)}
              />
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
          <FloorPlanManager
            value={floorPlans}
            onChange={setFloorPlans}
          />
        );

      case 6: // Pricing
        return (
          <PricingTableManager
            value={pricingTable}
            onChange={setPricingTable}
          />
        );

      case 7: // Location
        return (
          <LocationMapManager
            value={locationData}
            onChange={setLocationData}
          />
        );

      case 8: // Anchors
        return project.category !== 'RESIDENTIAL' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Anchor Tenants</h3>
              <button 
                type="button" 
                onClick={addAnchor} 
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Add Anchor
              </button>
            </div>
            <div className="space-y-4">
            {anchors.map((anchor, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-5 gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <input
                  placeholder="Anchor Name"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={anchor.name}
                  onChange={e => updateAnchor(index, 'name', e.target.value)}
                />
                  <IconSelector
                    selectedIcon={anchor.icon}
                    onSelect={(icon) => updateAnchor(index, 'icon', icon)}
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
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Home & Decor">Home & Decor</option>
                    <option value="Sports">Sports</option>
                </select>
                <input
                  placeholder="Floor"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={anchor.floor}
                  onChange={e => updateAnchor(index, 'floor', e.target.value)}
                />
                <input
                  placeholder="Area (sq ft)"
                  type="number"
                    className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  value={anchor.areaSqFt}
                  onChange={e => updateAnchor(index, 'areaSqFt', e.target.value)}
                />
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
