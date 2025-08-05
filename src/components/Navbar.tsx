'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ThemeToggle from './ThemeToggle';

const navigation = [
  { name: 'Properties', href: '/properties' },
  { name: 'Search', href: '/properties/search' },
  { name: 'Residential', href: '/properties?type=residential' },
  { name: 'Commercial', href: '/properties?type=commercial' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg dark:bg-gray-900/95 fixed w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="">
            <Link href="/" className="flex items-center">
              {/* <Image src="/logo.webp" alt="Reality Canvas" fill  /> */}
              <Image src="/logo.webp" alt="Reality Canvas" width={1200} height={100} className="w-48 h-14" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <ThemeToggle />
            <Link
              href="/properties/new"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              List your property
            </Link>
            
            {/* Profile Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
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
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
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
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
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
                          } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
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
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Link
                  href="/properties/new"
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  List your property
                </Link>
              </div>
              <div className="px-3 py-2 border-t border-gray-200 dark:border-secondary-700">
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-gray-50 dark:hover:bg-secondary-800 rounded-md transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-gray-50 dark:hover:bg-secondary-800 rounded-md transition-colors duration-200"
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