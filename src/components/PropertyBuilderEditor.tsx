'use client';

import { useState } from 'react';
import { CodeBracketIcon, EyeIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface BuilderInfo {
  name: string;
  logo: string;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  established?: string;
  projects?: string;
  type?: string;
  size?: string;
  certifications?: string[];
  socialMedia?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface PropertyBuilderEditorProps {
  builderName: string;
  builderLogo: string;
  builderDescription: string;
  onBuilderNameChange: (value: string) => void;
  onBuilderLogoChange: (value: string) => void;
  onBuilderDescriptionChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function PropertyBuilderEditor({ 
  builderName,
  builderLogo,
  builderDescription,
  onBuilderNameChange,
  onBuilderLogoChange,
  onBuilderDescriptionChange,
  label = "Builder Information", 
  placeholder = "Add information about the property builder/developer" 
}: PropertyBuilderEditorProps) {
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [builderInfo, setBuilderInfo] = useState<BuilderInfo>({
    name: builderName || '',
    logo: builderLogo || '',
    description: builderDescription || '',
    website: '',
    phone: '',
    email: '',
    established: '',
    projects: '',
    type: '',
    size: '',
    certifications: [],
    socialMedia: {
      linkedin: '',
      facebook: '',
      instagram: ''
    }
  });

  const updateBuilderInfo = (field: keyof BuilderInfo, value: string) => {
    const newInfo = { ...builderInfo, [field]: value };
    setBuilderInfo(newInfo);
    
    // Update parent component
    if (field === 'name') onBuilderNameChange(value);
    if (field === 'logo') onBuilderLogoChange(value);
    if (field === 'description') onBuilderDescriptionChange(value);
  };

  const handleJsonChange = (jsonValue: string) => {
    try {
      const parsed = JSON.parse(jsonValue);
      if (parsed.name) onBuilderNameChange(parsed.name);
      if (parsed.logo) onBuilderLogoChange(parsed.logo);
      if (parsed.description) onBuilderDescriptionChange(parsed.description);
      setBuilderInfo(parsed);
    } catch (error) {
      // Handle JSON parsing errors silently or show validation
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        updateBuilderInfo('logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setLogoPreview(result);
          updateBuilderInfo('logo', result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    updateBuilderInfo('logo', '');
  };

  const builderTypes = [
    'Real Estate Developer',
    'Construction Company',
    'Architecture Firm',
    'Property Management',
    'Investment Group',
    'Housing Corporation',
    'Private Builder',
    'Government Agency'
  ];

  const companySizes = [
    'Startup (1-10 employees)',
    'Small (11-50 employees)',
    'Medium (51-200 employees)',
    'Large (201-1000 employees)',
    'Enterprise (1000+ employees)'
  ];

  const commonCertifications = [
    'ISO 9001:2015',
    'ISO 14001:2015',
    'OHSAS 18001',
    'LEED Certified',
    'BREEAM',
    'Green Building Council',
    'RERA Registered',
    'BIS Certification'
  ];

  const updateSocialMedia = (platform: keyof NonNullable<BuilderInfo['socialMedia']>, value: string) => {
    const newSocialMedia = { ...builderInfo.socialMedia ?? {}, [platform]: value };
    setBuilderInfo(prev => ({ ...prev, socialMedia: newSocialMedia }));
  };

  const toggleCertification = (cert: string) => {
    const currentCerts = builderInfo.certifications || [];
    const newCerts = currentCerts.includes(cert)
      ? currentCerts.filter(c => c !== cert)
      : [...currentCerts, cert];
    setBuilderInfo(prev => ({ ...prev, certifications: newCerts }));
  };

  const getJsonValue = () => {
    return JSON.stringify(builderInfo, null, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {placeholder}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsJsonMode(!isJsonMode)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isJsonMode
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'bg-primary-100 dark:bg-secondary-900 text-brand-primary dark:text-brand-primary'
            }`}
          >
            {isJsonMode ? (
              <>
                <EyeIcon className="w-4 h-4 mr-1" />
                Visual Editor
              </>
            ) : (
              <>
                <CodeBracketIcon className="w-4 h-4 mr-1" />
                JSON Mode
              </>
            )}
          </button>
        </div>
      </div>

      {isJsonMode ? (
        <div className="space-y-4">
          <textarea
            value={getJsonValue()}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white font-mono text-sm"
            placeholder={`{
  "name": "Prestige Group",
  "logo": "https://example.com/logo.jpg",
  "description": "Leading real estate developer...",
  "website": "https://prestigegroup.com",
  "phone": "+1-234-567-8900",
  "email": "info@prestigegroup.com",
  "established": "1986",
  "projects": "200+ completed projects"
}`}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter builder information in JSON format.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Builder Details
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                {/* Builder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Builder/Developer Name
                  </label>
                  <input
                    type="text"
                    value={builderInfo.name}
                    onChange={(e) => updateBuilderInfo('name', e.target.value)}
                    placeholder="e.g., Prestige Group"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Company Type and Size */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Type
                    </label>
                    <select
                      value={builderInfo.type}
                      onChange={(e) => updateBuilderInfo('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select Type</option>
                      {builderTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Size
                    </label>
                    <select
                      value={builderInfo.size}
                      onChange={(e) => updateBuilderInfo('size', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">Select Size</option>
                      {companySizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={builderInfo.website}
                      onChange={(e) => updateBuilderInfo('website', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={builderInfo.phone}
                      onChange={(e) => updateBuilderInfo('phone', e.target.value)}
                      placeholder="+1-234-567-8900"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={builderInfo.email}
                      onChange={(e) => updateBuilderInfo('email', e.target.value)}
                      placeholder="info@example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Established
                    </label>
                    <input
                      type="text"
                      value={builderInfo.established}
                      onChange={(e) => updateBuilderInfo('established', e.target.value)}
                      placeholder="e.g., 1986"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Media (Optional)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="url"
                        value={builderInfo.socialMedia?.linkedin || ''}
                        onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                        placeholder="LinkedIn URL"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        value={builderInfo.socialMedia?.facebook || ''}
                        onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                        placeholder="Facebook URL"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        value={builderInfo.socialMedia?.instagram || ''}
                        onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                        placeholder="Instagram URL"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notable Projects/Experience
                  </label>
                  <input
                    type="text"
                    value={builderInfo.projects}
                    onChange={(e) => updateBuilderInfo('projects', e.target.value)}
                    placeholder="e.g., 200+ completed projects"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company Description
                  </label>
                  <textarea
                    value={builderInfo.description}
                    onChange={(e) => updateBuilderInfo('description', e.target.value)}
                    placeholder="Brief description about the builder/developer, their expertise, vision, and key achievements..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {builderInfo.description?.length || 0}/500 characters
                  </p>
                </div>

                {/* Certifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Certifications & Accreditations
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {commonCertifications.map((cert) => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => toggleCertification(cert)}
                        className={`text-xs px-3 py-2 rounded-md border transition-colors ${
                          (builderInfo.certifications || []).includes(cert)
                            ? 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Logo */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Builder Logo
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('url')}
                      className={`px-2 py-1 text-xs rounded ${
                        uploadMethod === 'url'
                          ? 'bg-primary-100 dark:bg-secondary-900 text-brand-primary dark:text-brand-primary'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      className={`px-2 py-1 text-xs rounded ${
                        uploadMethod === 'file'
                          ? 'bg-primary-100 dark:bg-secondary-900 text-brand-primary dark:text-brand-primary'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {uploadMethod === 'url' ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={builderInfo.logo}
                      onChange={(e) => updateBuilderInfo('logo', e.target.value)}
                      placeholder="https://example.com/logo.jpg"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logoPreview ? (
                      <div className="relative">
                        <div className="w-full h-32 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex items-center justify-center">
                          <Image
                            src={logoPreview}
                            alt="Logo Preview"
                            width={200}
                            height={100}
                            className="object-contain max-h-full max-w-full"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                )}

                {(builderInfo.logo && uploadMethod === 'url') && (
                  <div className="mt-2">
                    <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex items-center justify-center">
                      <Image
                        src={builderInfo.logo}
                        alt={builderInfo.name || 'Builder Logo'}
                        width={200}
                        height={100}
                        className="object-contain max-h-full max-w-full"
                        onError={() => {
                          // Handle image error
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {builderInfo.name && !isJsonMode && (
        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-3">
            Builder Profile Preview
          </h4>
          <div className="flex items-start space-x-4">
            {(builderInfo.logo || logoPreview) && (
              <div className="flex-shrink-0">
                <Image
                  src={logoPreview || builderInfo.logo}
                  alt={builderInfo.name}
                  width={80}
                  height={60}
                  className="object-contain rounded border border-orange-200 dark:border-orange-700 p-2 bg-white dark:bg-gray-800"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="text-lg font-bold text-orange-900 dark:text-orange-100">
                {builderInfo.name}
                {builderInfo.type && (
                  <span className="ml-2 text-xs bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                    {builderInfo.type}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-orange-700 dark:text-orange-300 mt-1">
                {builderInfo.established && <span>Est. {builderInfo.established}</span>}
                {builderInfo.size && <span>• {builderInfo.size}</span>}
                {builderInfo.projects && <span>• {builderInfo.projects}</span>}
              </div>

              {builderInfo.description && (
                <div className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                  {builderInfo.description.substring(0, 150)}
                  {builderInfo.description.length > 150 ? '...' : ''}
                </div>
              )}

              {(builderInfo.certifications && builderInfo.certifications.length > 0) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {builderInfo.certifications.slice(0, 3).map((cert, index) => (
                    <span
                      key={index}
                      className="inline-block bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded"
                    >
                      {cert}
                    </span>
                  ))}
                  {builderInfo.certifications.length > 3 && (
                    <span className="text-xs text-orange-600 dark:text-orange-400">
                      +{builderInfo.certifications.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2 mt-2">
                {builderInfo.website && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    Website
                  </span>
                )}
                {builderInfo.email && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    Email
                  </span>
                )}
                {builderInfo.phone && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                    Phone
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}