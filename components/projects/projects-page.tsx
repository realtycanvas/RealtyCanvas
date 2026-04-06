'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import ProjectsListingClient from './projects-listing-client';

interface User {
  email: string;
  role: string;
}

export default function ProjectsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch {
        console.error('Failed to check authentication');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

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
