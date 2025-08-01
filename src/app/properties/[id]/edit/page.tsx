'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { use } from 'react';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    return RQ;
  }, {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"></div>,
  }
);

// Import the custom hook for Quill editor
import { useQuillEditor } from '@/hooks/useQuillEditor';

// Import Quill styles
import 'react-quill/dist/quill.snow.css';
// Import Quill table UI styles
import 'quill-table-ui/dist/index.css';

type PropertyFormData = {
  title: string;
  description: string;
  price: number;
  address: string;
  location: string;
  currency: string;
  featuredImage: string;
  galleryImages: string[];
  beds: number;
  baths: number;
  area: number;
};

type UploadedImage = {
  file: File;
  preview: string;
};

type PropertyEditPageProps = {
  params: Promise<{
    id: string;
  }>;
  };


export default function PropertyEditPage({ params }: PropertyEditPageProps) {
  // Unwrap params Promise using React.use() for Next.js 15 compatibility
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    address: '',
    location: '',
    currency: 'USD',
    featuredImage: '',
    galleryImages: [],
    beds: 0,
    baths: 0,
    area: 0,
  });
  
  // State for file uploads
  const [newFeaturedImage, setNewFeaturedImage] = useState<UploadedImage | null>(null);
  const [newGalleryImages, setNewGalleryImages] = useState<UploadedImage[]>([]);
  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);

  // Initialize Quill editor
  const { isEditorReady } = useQuillEditor(formData.description);
  
  // Fetch property data
  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await fetch(`/api/properties/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch property: ${response.status}`);
        }
        
        const property = await response.json();
        
        setFormData({
          title: property.title,
          description: property.description,
          price: property.price,
          address: property.address,
          location: property.location,
          currency: property.currency || 'USD',
          featuredImage: property.featuredImage || '',
          galleryImages: property.galleryImages || [],
          beds: property.beds || 0,
          baths: property.baths || 0,
          area: property.area || 0,
        });
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('Failed to load property data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'beds' || name === 'baths' || name === 'area' 
        ? Number(value) 
        : value
    }));
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewFeaturedImage({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setNewGalleryImages(prev => [...prev, ...newImages]);
    }
  };

  const removeFeaturedImage = () => {
    if (newFeaturedImage) {
      URL.revokeObjectURL(newFeaturedImage.preview);
      setNewFeaturedImage(null);
    } else {
      setFormData(prev => ({ ...prev, featuredImage: '' }));
    }
  };

  const removeGalleryImage = (index: number, isNewImage: boolean) => {
    if (isNewImage) {
      // Remove from new gallery images
      setNewGalleryImages(prev => {
        const updatedImages = [...prev];
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(updatedImages[index].preview);
        updatedImages.splice(index, 1);
        return updatedImages;
      });
    } else {
      // Mark existing image for removal
      const imageUrl = formData.galleryImages[index];
      setRemovedGalleryImages(prev => [...prev, imageUrl]);
      
      // Remove from form data
      setFormData(prev => ({
        ...prev,
        galleryImages: prev.galleryImages.filter((_, i) => i !== index)
      }));
    }
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (newFeaturedImage) {
        URL.revokeObjectURL(newFeaturedImage.preview);
      }
      newGalleryImages.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [newFeaturedImage, newGalleryImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Upload new featured image if exists
      let featuredImageUrl = formData.featuredImage;
      if (newFeaturedImage) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', newFeaturedImage.file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        
        if (response.ok) {
          const data = await response.json();
          featuredImageUrl = data.url;
        } else {
          console.error('Featured image upload failed:', await response.text());
        }
      }

      // Upload new gallery images if any
      const newGalleryUrls = await Promise.all(
        newGalleryImages.map(async (image) => {
          try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', image.file);
            
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formDataUpload,
            });
            
            if (response.ok) {
              const data = await response.json();
              return data.url;
            } else {
              console.error('Gallery image upload failed:', await response.text());
              return null;
            }
          } catch (error) {
            console.error('Error uploading gallery image:', error);
            return null;
          }
        })
      );

      // Filter out failed uploads
      const validNewGalleryUrls = newGalleryUrls.filter(url => url !== null) as string[];
      
      // Combine existing gallery images (excluding removed ones) with new ones
      const updatedGalleryImages = [
        ...formData.galleryImages.filter(url => !removedGalleryImages.includes(url)),
        ...validNewGalleryUrls
      ];

      // Update property in the database
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          featuredImage: featuredImageUrl,
          galleryImages: updatedGalleryImages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update property: ${response.status}`);
      }

      router.push(`/properties/${id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating property:', error);
      setError('Failed to update property. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <Link 
            href={`/properties/${id}`} 
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to property
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Property</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <div className="mt-1">
                {/* Use ReactQuill with our custom hook */}
                {isEditorReady && (
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                    className="bg-white dark:bg-gray-800 rounded-md"
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        [{ 'table': [] }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean']
                      ],
                      table: true,
                      tableUI: true,
                    }}
                    formats={[
                      'header',
                      'bold', 'italic', 'underline', 'strike',
                      'list', 'bullet', 'indent',
                      'link', 'image', 'table', 'table-cell', 'table-header', 'table-row',
                      'align', 'color', 'background',
                    ]}
                    style={{ height: '200px' }}
                  />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="beds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beds
                </label>
                <input
                  type="number"
                  id="beds"
                  name="beds"
                  value={formData.beds}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="baths" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Baths
                </label>
                <input
                  type="number"
                  id="baths"
                  name="baths"
                  value={formData.baths}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Featured Image
              </label>
              
              {/* Current featured image or new featured image preview */}
              {(formData.featuredImage || newFeaturedImage) && (
                <div className="mb-3 relative">
                  <div className="relative w-full h-48 rounded-md overflow-hidden">
                    <Image 
                      src={newFeaturedImage ? newFeaturedImage.preview : formData.featuredImage}
                      alt="Featured property image"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-md"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeFeaturedImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                    aria-label="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Upload new featured image */}
              <div className="mt-1">
                <label className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 cursor-pointer">
                  <span>{formData.featuredImage || newFeaturedImage ? 'Change Featured Image' : 'Upload Featured Image'}</span>
                  <input
                    type="file"
                    id="featuredImage"
                    onChange={handleFeaturedImageChange}
                    accept="image/*"
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gallery Images
              </label>
              
              {/* Gallery images preview */}
              {(formData.galleryImages.length > 0 || newGalleryImages.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                  {/* Existing gallery images */}
                  {formData.galleryImages.map((imageUrl, index) => (
                    <div key={`existing-${index}`} className="relative h-32 rounded-md overflow-hidden">
                      <Image 
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index, false)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {/* New gallery images */}
                  {newGalleryImages.map((image, index) => (
                    <div key={`new-${index}`} className="relative h-32 rounded-md overflow-hidden">
                      <Image 
                        src={image.preview}
                        alt={`New gallery image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index, true)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                        aria-label="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload new gallery images */}
              <div className="mt-1">
                <label className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 cursor-pointer">
                  <span>Add Gallery Images</span>
                  <input
                    type="file"
                    id="galleryImages"
                    onChange={handleGalleryImagesChange}
                    accept="image/*"
                    multiple
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Link
              href={`/properties/${id}`}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}