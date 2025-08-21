'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { BrandButton } from './ui/BrandButton';
import gsap from 'gsap';

const navigation = [
  // { name: 'Properties', href: '/properties' },
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { actualTheme } = useTheme();
  
  const callNowButtonRef = useRef<HTMLAnchorElement | null>(null);
  const hotlineButtonRef = useRef<HTMLAnchorElement | null>(null);
  const mobileCallNowButtonRef = useRef<HTMLAnchorElement | null>(null);
  const mobileHotlineButtonRef = useRef<HTMLAnchorElement | null>(null);

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
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg dark:bg-gray-900/95 fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="">
            <Link href="/" className="flex items-center no-underline hover:no-underline focus:no-underline">
              {/* Conditional Logo based on theme */}
              <Image 
                src={actualTheme === 'light' ? "/logo1.webp" : "/logo.webp"} 
                alt="Reality Canvas" 
                width={1200} 
                height={100} 
                className="w-48 h-12" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-brand-primary dark:text-gray-300 dark:hover:text-brand-primary px-3 py-2 text-sm font-medium transition-colors duration-200 relative group no-underline hover:no-underline focus:no-underline"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand-primary to-brand-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <ThemeToggle />
            <Link 
              href="tel:9910007801"
              ref={callNowButtonRef}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 animate-pulse hover:animate-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Call Now
            </Link>
            <Link 
              href="tel:9910007801"
              ref={hotlineButtonRef}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              9910007801
            </Link>
            <Link href="/projects/new">
              <BrandButton
                variant="primary"
                size="sm"
                className="rounded-full"
              >
                Add Project
              </BrandButton>
            </Link>
            
            {/* Profile Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary transition-colors duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-primary rounded-full flex items-center justify-center text-brand-secondary text-sm font-medium">
                  U
                </div>
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
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? 'bg-gray-100 dark:bg-secondary-700' : ''
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 no-underline hover:no-underline focus:no-underline`}
                        >
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/dashboard"
                          className={`${
                            active ? 'bg-gray-100 dark:bg-secondary-700' : ''
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 no-underline hover:no-underline focus:no-underline`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/settings"
                          className={`${
                            active ? 'bg-gray-100 dark:bg-secondary-700' : ''
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 no-underline hover:no-underline focus:no-underline`}
                        >
                          Settings
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-100 dark:bg-secondary-700' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />
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
                  <Link href="/projects/new" onClick={() => setMobileMenuOpen(false)}>
                    <BrandButton
                      variant="primary"
                      size="sm"
                      className="w-full rounded-full"
                    >
                      Add Project
                    </BrandButton>
                  </Link>
                </div>
              <div className="px-3 py-2 border-t border-gray-200 dark:border-secondary-700">
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-gray-50 dark:hover:bg-secondary-800 rounded-md transition-colors duration-200 no-underline hover:no-underline focus:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-gray-50 dark:hover:bg-secondary-800 rounded-md transition-colors duration-200 no-underline hover:no-underline focus:no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </nav>
  );
}