'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';

type AdminShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  contentScrollable?: boolean;
};

export default function AdminShell({ title, description, children, contentScrollable = true }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [loading, user, router]);

  const links = useMemo(
    () => [
      { href: '/admin/dashboard', label: 'Dashboard', active: pathname.startsWith('/admin/dashboard') },
      { href: '/admin/projects', label: 'Projects', active: pathname.startsWith('/admin/projects') },
      { href: '/admin/lead', label: 'Lead', active: pathname.startsWith('/admin/lead') },
    ],
    [pathname]
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:h-[calc(100vh-6rem)] lg:overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-5 lg:h-full">
          <aside className="w-full lg:basis-1/5 lg:max-w-[20%] rounded border border-gray-200 bg-white p-4 lg:h-full lg:overflow-y-auto shrink-0">
            <nav className="flex flex-col gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded px-4 py-2 text-sm font-semibold transition ${
                    link.active
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                      : 'text-gray-700 hover:bg-gray-100 border border-transparent'
                  }`}
                  aria-current={link.active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main
            className={`w-full lg:basis-4/5 lg:max-w-[80%] rounded border border-gray-200 bg-white p-4 sm:p-6 overflow-x-auto lg:h-full ${
              contentScrollable ? 'lg:overflow-y-auto' : 'lg:overflow-y-hidden'
            }`}
          >
            <div className="mb-5">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="mt-1 text-sm text-gray-600">{description}</p>
              {user && <p className="mt-2 text-xs text-gray-500">Signed in as {user.email}</p>}
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
