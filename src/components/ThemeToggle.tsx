'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, label: 'Light', icon: SunIcon },
    { value: 'dark' as const, label: 'Dark', icon: MoonIcon },
    { value: 'system' as const, label: 'System', icon: ComputerDesktopIcon },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[2];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-3 py-2 bg-white dark:bg-secondary-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary dark:focus:ring-offset-secondary-800">
          <currentTheme.icon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Toggle theme</span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-secondary-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {themes.map((themeOption) => (
              <Menu.Item key={themeOption.value}>
                {({ active }) => (
                  <button
                    onClick={() => setTheme(themeOption.value)}
                    className={`${
                      active
                        ? 'bg-gray-100 dark:bg-secondary-700 text-gray-900 dark:text-gray-100'
                        : 'text-gray-700 dark:text-gray-200'
                    } ${
                      theme === themeOption.value
                        ? 'bg-primary-50 dark:bg-secondary-800 text-brand-primary dark:text-brand-primary'
                        : ''
                    } group flex items-center px-4 py-2 text-sm w-full text-left`}
                  >
                    <themeOption.icon
                      className={`mr-3 h-5 w-5 ${
                        theme === themeOption.value
                          ? 'text-brand-primary dark:text-brand-primary'
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {themeOption.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}