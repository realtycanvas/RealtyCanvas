'use client';

import Link from 'next/link';
import SmartImage from '@/components/ui/SmartImage';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
// Import the auth context
import { useAuth } from '@/contexts/AuthContext';
import { BrandButton } from './ui/BrandButton';
import AdminLogin from './AdminLogin';
import gsap from 'gsap';

const navigation = [
  // { name: 'Properties', href: '/properties' },
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  
  const callNowButtonRef = useRef<HTMLAnchorElement | null>(null);
  const hotlineButtonRef = useRef<HTMLAnchorElement | null>(null);
  const mobileCallNowButtonRef = useRef<HTMLAnchorElement | null>(null);
  const mobileHotlineButtonRef = useRef<HTMLAnchorElement | null>(null);

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animation for button bounce effect
  useEffect(() => {
    // Define event handlers
    const handleCallNowButtonHover = () => {
      gsap.to(callNowButtonRef.current, {
        y: -5,
        duration: 0.3,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut"
      });
    };

    const handleHotlineButtonHover = () => {
      gsap.to(hotlineButtonRef.current, {
        y: -5,
        duration: 0.3,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut"
      });
    };

    const handleMobileCallNowButtonHover = () => {
      gsap.to(mobileCallNowButtonRef.current, {
        y: -5,
        duration: 0.3,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut"
      });
    };

    const handleMobileHotlineButtonHover = () => {
      gsap.to(mobileHotlineButtonRef.current, {
        y: -5,
        duration: 0.3,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut"
      });
    };
    
    // Setup hover animations for desktop buttons
    if (callNowButtonRef.current) {
      callNowButtonRef.current.addEventListener('mouseenter', handleCallNowButtonHover);
    }
    
    if (hotlineButtonRef.current) {
      hotlineButtonRef.current.addEventListener('mouseenter', handleHotlineButtonHover);
    }
    
    // Setup hover animations for mobile buttons
    if (mobileCallNowButtonRef.current) {
      mobileCallNowButtonRef.current.addEventListener('mouseenter', handleMobileCallNowButtonHover);
    }
    
    if (mobileHotlineButtonRef.current) {
      mobileHotlineButtonRef.current.addEventListener('mouseenter', handleMobileHotlineButtonHover);
    }
    
    // Cleanup event listeners on component unmount
    return () => {
      if (callNowButtonRef.current) {
        callNowButtonRef.current.removeEventListener('mouseenter', handleCallNowButtonHover);
      }
      if (hotlineButtonRef.current) {
        hotlineButtonRef.current.removeEventListener('mouseenter', handleHotlineButtonHover);
      }
      if (mobileCallNowButtonRef.current) {
        mobileCallNowButtonRef.current.removeEventListener('mouseenter', handleMobileCallNowButtonHover);
      }
      if (mobileHotlineButtonRef.current) {
        mobileHotlineButtonRef.current.removeEventListener('mouseenter', handleMobileHotlineButtonHover);
      }
    };
  }, []);
  
  return (
    <nav className={`${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'} backdrop-blur-sm fixed w-full z-50 transition-all duration-300`}>
      <div className={`max-w-6xl mx-auto px-2 sm:px-4  ${isScrolled ? 'bg-transparent' : 'bg-white/10'} rounded-lg mx-4 mt-2`}>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="">
            <Link href="/" className="flex items-center no-underline hover:no-underline focus:no-underline">
              {/* Logo - Light version only */}
              <SmartImage 
                src="/logo1.webp" 
                alt="Reality Canvas" 
                width={1200} 
                height={100} 
                className="w-40 h-10"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center ">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-brand-primary dark:text-gray-300 dark:hover:text-brand-primary px-4 py-2 text-base font-medium transition-colors duration-200 relative group no-underline hover:no-underline focus:no-underline"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Theme toggle removed - using light mode only */}
            <Link 
              href="tel:9910007801"
              ref={callNowButtonRef}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 animate-pulse hover:animate-none whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call Now
            </Link>
            <Link 
              href="tel:9910007801"
              ref={hotlineButtonRef}
              className="flex items-center gap-2 bg-[#112D48] hover:bg-[#091a30] text-white font-medium px-3 py-2 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              9910007801
            </Link>
            {/* Admin-only Add Project Button */}
            {isAdmin && (
              <Link href="/projects/new">
                <BrandButton
                  variant="primary"
                  size="sm"
                  className="rounded-full whitespace-nowrap text-sm px-3 py-1"
                >
                  Add Project
                </BrandButton>
              </Link>
            )}
            
            {/* Admin Authentication - Only show if already logged in as admin */}
            {user && isAdmin && (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    A
                  </div>
                  <span className="text-sm font-medium">Admin</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </Menu.Button>
                
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={signOut}
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Theme toggle removed - using light mode only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-gray-50 dark:hover:bg-secondary-800 rounded-md transition-colors duration-200 no-underline hover:no-underline focus:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                  <Link
                    href="tel:9910007801"
                    ref={mobileCallNowButtonRef}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg text-center w-full mb-2 transition-all duration-300 transform hover:scale-105 animate-pulse hover:animate-none"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Call Now: 9910007801
                  </Link>
                  <Link 
                    href="tel:9910007801"
                    ref={mobileHotlineButtonRef}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-center w-full mb-2 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    9910007801
                  </Link>
                  {/* Admin-only Add Project Button */}
                  {isAdmin && (
                    <Link href="/projects/new" onClick={() => setMobileMenuOpen(false)}>
                      <BrandButton
                        variant="primary"
                        size="sm"
                        className="w-full rounded-full"
                      >
                        Add Project
                      </BrandButton>
                    </Link>
                  )}
                </div>
              {/* Admin Authentication for Mobile - Only show if already logged in as admin */}
              {user && isAdmin && (
                <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                    Sign Out (Admin)
                  </button>
                </div>
              )}
            </div>
          </div>
        </Transition>
      </div>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </nav>
  );
}