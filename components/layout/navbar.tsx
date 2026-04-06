'use client';

import Link from 'next/link';
import Image from 'next/image';

import { defaultNavItems } from '@/data/navbar.data';
import { useEffect, useMemo, useState } from 'react';
import { formatPhoneLink, formatWhatsappLink } from '@/helpers/navbar.helper';
import { BarsIcon, CloseIcon, PhoneIcon, ShareIcon, WhatsappIcon } from '../ui/icon';
import { usePathname } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { LogoutModal } from '../common/logout-modal';

interface User {
  email: string;
  role: string;
}

const Navbar = ({
  brandName = 'Realty Canvas',
  logoLightSrc = '/logo/logo-white.webp',
  logoDarkSrc = '/logo/logo-original.webp',
  phoneNumber = '9555562626',
  whatsappNumber = '9555562626',
  navItems = defaultNavItems,
  currentPath = '/',
}: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isHomePage = pathname === '/';
  const showSolidNav = isScrolled || !isHomePage || mobileMenuOpen;

  const telHref = useMemo(() => formatPhoneLink(phoneNumber), [phoneNumber]);
  const waHref = useMemo(() => formatWhatsappLink(whatsappNumber), [whatsappNumber]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const next = window.scrollY > 50;
      setIsScrolled((prev) => (prev === next ? prev : next));
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleShare = async () => {
    const data = {
      title: brandName,
      text: `Check out ${brandName}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
      if (navigator.clipboard && data.url) {
        await navigator.clipboard.writeText(data.url);
      }
    } catch {}
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        setShowLogoutModal(false);
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <nav
      className={`${showSolidNav ? 'bg-white shadow-lg' : 'bg-transparent'} fixed top-0 w-full z-50 transition-all duration-300`}
    >
      <div
        className={`mx-auto max-w-7xl ${showSolidNav ? 'bg-transparent' : 'bg-transparent hover:bg-black/20 lg:mt-2'} rounded transition-colors duration-300`}
      >
        <div className="h-20 px-2 sm:px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center no-underline hover:no-underline focus:no-underline">
            <Image
              src={showSolidNav ? logoDarkSrc : logoLightSrc}
              alt="Reality Canvas"
              width={1200}
              height={100}
              className={`w-auto -ml-4 sm:-ml-2 max-w-32 sm:max-w-40 h-16 object-contain ${showSolidNav ? '' : ''}`}
              priority
            />
          </Link>

          <div className="hidden lg:flex lg:items-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${showSolidNav ? 'text-gray-700' : 'text-white'} hover:text-[#FBB70F] px-4 py-2 text-base font-medium transition-colors duration-200 relative group no-underline`}
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#FBB70F] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link
              href={telHref}
              className="flex items-center gap-2 bg-[#FBB70F] hover:bg-[#e5a60d] text-[#112D48] font-medium px-3 py-2 rounded-full transition-colors duration-300 call-now-pulse whitespace-nowrap shadow-lg"
            >
              <PhoneIcon className="h-4 w-4" />
              Call Now
            </Link>
            <Link
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              <WhatsappIcon className="h-4 w-4" />
              {whatsappNumber}
            </Link>
            <button
              onClick={handleShare}
              className={`w-full cursor-pointer ${showSolidNav ? 'text-gray-600 bg-gray-300 hover:bg-gray-400' : 'text-white bg-white/20 hover:bg-white/30'} px-3 py-2 flex items-center justify-center rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap`}
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </button>
            {user && (
              <button
                onClick={() => setShowLogoutModal(true)}
                className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="text-[#FBB70F] hover:text-[#e5a60d] transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <CloseIcon className="h-9 w-9" /> : <BarsIcon className="h-9 w-9" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#FBB70F] hover:bg-gray-50 rounded transition-colors duration-200 no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Link
                  href={telHref}
                  className="flex items-center justify-center gap-2 bg-[#FBB70F] hover:bg-[#e5a60d] text-[#112D48] font-medium py-3 rounded text-center w-full mb-2 transition-all duration-300 transform hover:scale-105 call-now-pulse hover:animate-none shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PhoneIcon className="h-5 w-5" />
                  Call Now: {phoneNumber}
                </Link>
                <Link
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded text-center w-full mb-2 transition-all duration-300 transform hover:scale-105"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <WhatsappIcon className="h-5 w-5" />
                  {whatsappNumber}
                </Link>
                <button
                  onClick={handleShare}
                  className="w-full bg-gray-300 text-gray-700 p-3 flex items-center justify-center rounded transition-colors hover:bg-gray-400 mb-2"
                >
                  <ShareIcon className="w-5 h-5 mr-2" />
                  Share
                </button>
                {user && (
                  <button
                    onClick={() => {
                      setShowLogoutModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </nav>
  );
};

export default Navbar;
