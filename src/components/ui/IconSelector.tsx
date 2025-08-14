'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Comprehensive icon library with categories
const iconLibrary = {
  'Real Estate': [
    { icon: '🏢', name: 'Building' },
    { icon: '🏠', name: 'House' },
    { icon: '🏭', name: 'Factory' },
    { icon: '🏬', name: 'Store' },
    { icon: '🏛️', name: 'Government' },
    { icon: '🏨', name: 'Hotel' },
    { icon: '🏦', name: 'Bank' },
    { icon: '🏪', name: 'Shop' },
    { icon: '🏫', name: 'School' },
    { icon: '🏥', name: 'Hospital' },
    { icon: '🏘️', name: 'Houses' },
    { icon: '🏚️', name: 'Derelict House' },
    { icon: '🏗️', name: 'Construction' },
    { icon: '🏟️', name: 'Stadium' },
    { icon: '🏙️', name: 'Cityscape' },
    { icon: '🏞️', name: 'Landscape' },
    { icon: '🌆', name: 'Sunset City' },
    { icon: '🌇', name: 'City Sunset' },
  ],
  'Location': [
    { icon: '📍', name: 'Pin' },
    { icon: '🗺️', name: 'Map' },
    { icon: '🌏', name: 'Globe' },
    { icon: '🎯', name: 'Target' },
    { icon: '📌', name: 'Pushpin' },
    { icon: '🧭', name: 'Compass' },
    { icon: '🛣️', name: 'Highway' },
    { icon: '🌆', name: 'Cityscape' },
    { icon: '🌇', name: 'Sunset City' },
    { icon: '🏞️', name: 'Nature' },
  ],
  'Transportation': [
    { icon: '🚇', name: 'Metro' },
    { icon: '🚌', name: 'Bus' },
    { icon: '🚗', name: 'Car' },
    { icon: '✈️', name: 'Airplane' },
    { icon: '🚀', name: 'Rocket' },
    { icon: '🚄', name: 'Train' },
    { icon: '🚲', name: 'Bicycle' },
    { icon: '🛵', name: 'Scooter' },
    { icon: '🚕', name: 'Taxi' },
    { icon: '🚁', name: 'Helicopter' },
    { icon: '🚆', name: 'Railway' },
    { icon: '🚊', name: 'Tram' },
    { icon: '🚃', name: 'Railway Car' },
    { icon: '🚝', name: 'Monorail' },
    { icon: '🚞', name: 'Mountain Railway' },
    { icon: '🚉', name: 'Station' },
    { icon: '🛤️', name: 'Railway Track' },
    { icon: '🛫', name: 'Departure' },
    { icon: '🛬', name: 'Arrival' },
    { icon: '🚤', name: 'Speedboat' },
    { icon: '⛵', name: 'Sailboat' },
    { icon: '🚢', name: 'Ship' },
  ],
  'Food & Dining': [
    { icon: '🍽️', name: 'Dining' },
    { icon: '🍴', name: 'Cutlery' },
    { icon: '🥄', name: 'Spoon' },
    { icon: '🍕', name: 'Pizza' },
    { icon: '🍔', name: 'Burger' },
    { icon: '🍟', name: 'Fries' },
    { icon: '☕', name: 'Coffee' },
    { icon: '🥤', name: 'Drink' },
    { icon: '🍰', name: 'Cake' },
    { icon: '🍳', name: 'Cooking' },
    { icon: '🥘', name: 'Food' },
    { icon: '🍱', name: 'Bento' },
    { icon: '🍜', name: 'Noodles' },
    { icon: '🍲', name: 'Pot' },
    { icon: '🥗', name: 'Salad' },
    { icon: '🍖', name: 'Meat' },
    { icon: '🥩', name: 'Steak' },
    { icon: '🍗', name: 'Chicken' },
    { icon: '🐟', name: 'Fish' },
    { icon: '🦐', name: 'Shrimp' },
  ],
  'Parking & Vehicles': [
    { icon: '🅿️', name: 'Parking' },
    { icon: '🚙', name: 'SUV' },
    { icon: '🚐', name: 'Van' },
    { icon: '🚚', name: 'Truck' },
    { icon: '🏎️', name: 'Race Car' },
    { icon: '🛻', name: 'Pickup Truck' },
    { icon: '🚛', name: 'Lorry' },
    { icon: '🚜', name: 'Tractor' },
    { icon: '🏍️', name: 'Motorcycle' },
    { icon: '🛺', name: 'Auto Rickshaw' },
    { icon: '⛽', name: 'Fuel' },
    { icon: '🔋', name: 'Battery' },
    { icon: '🚨', name: 'Police Car' },
    { icon: '🚒', name: 'Fire Engine' },
    { icon: '🚑', name: 'Ambulance' },
    { icon: '🚓', name: 'Police' },
  ],
  'Amenities': [
    { icon: '🏊', name: 'Swimming' },
    { icon: '🏋️', name: 'Gym' },
    { icon: '🎾', name: 'Tennis' },
    { icon: '⚽', name: 'Football' },
    { icon: '🏀', name: 'Basketball' },
    { icon: '🧘', name: 'Yoga' },
    { icon: '🎭', name: 'Theater' },
    { icon: '🎪', name: 'Entertainment' },
    { icon: '🎨', name: 'Art' },
    { icon: '🎵', name: 'Music' },
    { icon: '🏃', name: 'Running' },
    { icon: '🚴', name: 'Cycling' },
    { icon: '🏓', name: 'Table Tennis' },
    { icon: '🏸', name: 'Badminton' },
    { icon: '🎱', name: 'Pool' },
    { icon: '🎮', name: 'Gaming' },
    { icon: '📚', name: 'Library' },
    { icon: '🧩', name: 'Kids Zone' },
    { icon: '🎈', name: 'Party Hall' },
    { icon: '🎪', name: 'Event Space' },
  ],
  'Infrastructure': [
    { icon: '💡', name: 'Power' },
    { icon: '💧', name: 'Water' },
    { icon: '🌐', name: 'Internet' },
    { icon: '📡', name: 'Network' },
    { icon: '🔌', name: 'Electricity' },
    { icon: '🚰', name: 'Drinking Water' },
    { icon: '🚿', name: 'Shower' },
    { icon: '🚽', name: 'Toilet' },
    { icon: '🛗', name: 'Elevator' },
    { icon: '🪜', name: 'Stairs' },
    { icon: '🚪', name: 'Entry' },
    { icon: '🪟', name: 'Window' },
    { icon: '❄️', name: 'AC' },
    { icon: '🔥', name: 'Heating' },
    { icon: '💨', name: 'Ventilation' },
    { icon: '🧯', name: 'Fire Safety' },
  ],
  'Security': [
    { icon: '🔒', name: 'Lock' },
    { icon: '🛡️', name: 'Shield' },
    { icon: '👮', name: 'Security' },
    { icon: '📹', name: 'Camera' },
    { icon: '🚨', name: 'Alarm' },
    { icon: '🔐', name: 'Secure' },
    { icon: '🔑', name: 'Key' },
    { icon: '⚡', name: 'Power' },
    { icon: '🚪', name: 'Door' },
    { icon: '🖥️', name: 'Monitor' },
  ],
  'Lifestyle': [
    { icon: '☕', name: 'Coffee' },
    { icon: '🍽️', name: 'Dining' },
    { icon: '🛍️', name: 'Shopping' },
    { icon: '💼', name: 'Business' },
    { icon: '💎', name: 'Luxury' },
    { icon: '🌟', name: 'Premium' },
    { icon: '⭐', name: 'Star' },
    { icon: '✨', name: 'Sparkle' },
    { icon: '🎉', name: 'Celebration' },
    { icon: '🏆', name: 'Trophy' },
  ],
  'Nature': [
    { icon: '🌱', name: 'Growth' },
    { icon: '🌳', name: 'Tree' },
    { icon: '🌺', name: 'Flower' },
    { icon: '🍃', name: 'Leaf' },
    { icon: '🌿', name: 'Herb' },
    { icon: '🌸', name: 'Blossom' },
    { icon: '🌻', name: 'Sunflower' },
    { icon: '🌹', name: 'Rose' },
    { icon: '🌴', name: 'Palm' },
    { icon: '🌲', name: 'Evergreen' },
  ],
  'Technology': [
    { icon: '💻', name: 'Laptop' },
    { icon: '📱', name: 'Phone' },
    { icon: '🖥️', name: 'Computer' },
    { icon: '📡', name: 'Satellite' },
    { icon: '🔧', name: 'Tools' },
    { icon: '⚙️', name: 'Settings' },
    { icon: '🔌', name: 'Plug' },
    { icon: '💡', name: 'Bulb' },
    { icon: '🔋', name: 'Battery' },
    { icon: '📊', name: 'Chart' },
  ],
  'Finance': [
    { icon: '💰', name: 'Money' },
    { icon: '💸', name: 'Payment' },
    { icon: '💳', name: 'Card' },
    { icon: '🏧', name: 'ATM' },
    { icon: '📈', name: 'Growth' },
    { icon: '📉', name: 'Decline' },
    { icon: '💹', name: 'Stock' },
    { icon: '🪙', name: 'Coin' },
    { icon: '💵', name: 'Dollar' },
    { icon: '💶', name: 'Euro' },
  ],
};

interface IconSelectorProps {
  onSelect: (icon: string) => void;
  selectedIcon?: string;
  className?: string;
}

export default function IconSelector({ onSelect, selectedIcon, className = '' }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get all icons with category info
  const allIcons = Object.entries(iconLibrary).flatMap(([category, icons]) =>
    icons.map(icon => ({ ...icon, category }))
  );

  // Filter icons based on search and category
  const filteredIcons = allIcons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         icon.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || icon.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Object.keys(iconLibrary)];

  const handleIconSelect = (icon: string) => {
    onSelect(icon);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-xl mr-2">{selectedIcon || '🔍'}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {selectedIcon ? 'Change Icon' : 'Select Icon'}
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select Icon
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Icons Grid */}
            <div className="p-6 overflow-y-auto max-h-96">
              {filteredIcons.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No icons found for &quot;{searchTerm}&quot;
                </div>
              ) : (
                <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                  {filteredIcons.map((iconItem, index) => (
                    <button
                      key={index}
                      onClick={() => handleIconSelect(iconItem.icon)}
                      className={`aspect-square flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                        selectedIcon === iconItem.icon
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      title={iconItem.name}
                    >
                      <span className="text-2xl mb-1">{iconItem.icon}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {iconItem.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredIcons.length} icons found
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
