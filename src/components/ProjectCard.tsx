"use client";

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, MapPinIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { BrandButton } from './ui/BrandButton';
import { useAuth } from '@/contexts/AuthContext';

type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category: 'COMMERCIAL' | 'RETAIL_ONLY' | 'MIXED_USE' | 'RESIDENTIAL';
  status: 'PLANNED' | 'UNDER_CONSTRUCTION' | 'READY';
  address: string;
  city?: string | null;
  state?: string | null;
  featuredImage: string;
  createdAt: string;
  basePrice?: string | null;
  minRatePsf?: string | null;
  maxRatePsf?: string | null;
};

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
  viewMode?: "grid" | "list";
};

function ProjectCardComponent({ project, priority = false }: ProjectCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { isAdmin } = useAuth();

  const handleProjectClick = async () => {
    try {
      // Track the click
      await fetch(`/api/projects/${project.id}/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error tracking project click:', error);
      // Don't prevent navigation if tracking fails
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/projects/new?edit=${project.slug}`;
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/projects/${project.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Refresh the page to update the project list
          window.location.reload();
        } else {
          alert('Failed to delete project. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'COMMERCIAL':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'RESIDENTIAL':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'MIXED_USE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'RETAIL_ONLY':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'UNDER_CONSTRUCTION':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'READY':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatPriceRange = () => {
    if (project.minRatePsf && project.maxRatePsf) {
      return `₹${project.minRatePsf} - ₹${project.maxRatePsf}/sq ft`;
    } else if (project.minRatePsf) {
      return `From ₹${project.minRatePsf}/sq ft`;
    } else if (project.maxRatePsf) {
      return `Up to ₹${project.maxRatePsf}/sq ft`;
    }
    return 'Price on Request';
  };

  return (
    <Link href={`/projects/${project.slug}`} prefetch className="block h-full no-underline hover:no-underline focus:no-underline" onClick={handleProjectClick}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full group cursor-pointer flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <Image
            src={project.featuredImage || '/placeholder-property.svg'}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Status and Category Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(project.category)}`}>
              {project.category.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 bg-white/80 p-1 rounded-md shadow-lg">
              <button
                onClick={handleEditClick}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
                title="Edit Project"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                title="Delete Project"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Favorite Button */}
          

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-primary dark:group-hover:text-brand-primary transition-colors ">
            {project.title}
          </h3>
          
          {/* Subtitle */}
          {project.subtitle && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-1">
              {project.subtitle}
            </p>
          )}
          
          {/* Address */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
            <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {project.address}{project.city && `, ${project.city}`}{project.state && `, ${project.state}`}
            </span>
          </div>

        {/* Price Range */}
          {project.basePrice && (
            <div className="mb-2 mt-auto">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                Base Price: {project.basePrice}
              </span>
            </div>
          )}
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatPriceRange()}
            </span>
          </div>

          {/* View Details Button */}
          <BrandButton
            variant="primary"
            size="sm"
            className="w-full rounded-xl text-sm"
          >
            View Details
          </BrandButton>
        </div>
      </div>
    </Link>
  );
}

const ProjectCard = memo<ProjectCardProps>(ProjectCardComponent);
export default ProjectCard;