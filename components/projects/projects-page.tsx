'use client';

import { useAuth } from '@/hooks/use-auth';
import ProjectsListingClient from './projects-listing-client';

export default function ProjectsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <>
      <ProjectsListingClient user={user} />
    </>
  );
}
