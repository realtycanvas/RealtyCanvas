'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Play, Mic, Headphones, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const podcastEpisodes = [
  {
    id: 1,
    episode: 25,
    title: "Luxury Home Tours",
    videoId: "M60HGX3MNWk",
    duration: "45s",
    date: "Oct 12, 2023"
  },
  {
    id: 2,
    episode: 26,
    title: "Real Estate Investment Tips",
    videoId: "RAqJZrdHv6Y",
    duration: "38s",
    date: "Oct 05, 2023"
  },
  {
    id: 3,
    episode: 27,
    title: "Modern Interior Design",
    videoId: "PBxmubUc7-I",
    duration: "42s",
    date: "Sep 28, 2023"
  },
  {
    id: 4,
    episode: 28,
    title: "Home Buying Guide",
    videoId: "vgmTIQJXL0o",
    duration: "35s",
    date: "Sep 21, 2023"
  },
  {
    id: 5,
    episode: 29,
    title: "Sustainable Living",
    videoId: "xk7Uf-58pak",
    duration: "50s",
    date: "Sep 14, 2023"
  },
  {
    id: 6,
    episode: 30,
    title: "Market Analysis 2024",
    videoId: "B9KnIMMpWLA",
    duration: "40s",
    date: "Sep 07, 2023"
  },
  {
    id: 7,
    episode: 31,
    title: "Smart Home Tech",
    videoId: "VCHCn5PUsk4",
    duration: "55s",
    date: "Aug 31, 2023"
  },
  {
    id: 8,
    episode: 32,
    title: "Property Valuation",
    videoId: "NKIrX2szcG0",
    duration: "48s",
    date: "Aug 24, 2023"
  }
];

export default function PodcastSection() {
  const [cards, setCards] = useState(podcastEpisodes);
  
  const removeCard = (id: number) => {
    setCards((prev) => {
      const newCards = [...prev];
      const movedCard = newCards.shift();
      if (movedCard) newCards.push(movedCard);
      return newCards;
    });
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                <Mic className="w-5 h-5" />
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Now Streaming
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-[#0B1A3D] dark:text-white mb-6 leading-tight">
              Realty Canvas  <br />
              <span className="text-[#FDB022]">Insights Podcast</span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join us as we dive deep into the world of real estate, design trends, and market analysis. Expert interviews, tips for buyers and sellers, and the latest industry news.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="rounded-full gap-2"
                onClick={() => window.open(`https://youtube.com/shorts/${podcastEpisodes[0].videoId}`, '_blank')}
              >
                <Play className="w-5 h-5 fill-current" />
                Listen Latest Episode
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full gap-2"
                onClick={() => window.open('https://www.youtube.com/@RealInRealtyWithSunilBhambhani/featured', '_blank')}
              >
                <Headphones className="w-5 h-5" />
                View All Episodes
              </Button>
            </div>
          </motion.div>

          {/* Card Deck - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 flex justify-center items-center h-[600px] relative"
          >
             <div className="relative w-full max-w-[320px] aspect-[9/16]">
                {cards.slice(0, 3).reverse().map((card, index) => {
                  // Index logic: 
                  // If we slice 3 items: [0, 1, 2]. Reversed: [2, 1, 0].
                  // So the last item in the map (index 2 in slice) is the top card (cards[0]).
                  // Let's recalculate the visual index.
                  // cards[0] should be front.
                  // slice(0,3).reverse() -> [cards[2], cards[1], cards[0]]
                  // map index i: 0->cards[2], 1->cards[1], 2->cards[0]
                  
                  // So, visual_index (0=front, 1=middle, 2=back)
                  // If i=2 (cards[0]), visual_index=0
                  // If i=1 (cards[1]), visual_index=1
                  // If i=0 (cards[2]), visual_index=2
                  const visualIndex = 2 - index; 
                  
                  return (
                    <Card
                      key={card.id}
                      data={card}
                      index={visualIndex}
                      onRemove={() => removeCard(card.id)}
                    />
                  );
                })}
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Card({ data, index, onRemove }: { data: any, index: number, onRemove: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Visual stacking logic - Fanned deck effect
  const scale = 1 - index * 0.05;
  // Fanned rotation: Front card 0deg, 2nd card 4deg, 3rd card 8deg
  // We apply this only if it's NOT the front card being dragged (which has its own dynamic rotation)
  const staticRotate = index * 5; 
  // Horizontal offset to show cards behind (fan to the right)
  const xOffset = index * 20;
  
  const zIndex = 3 - index;
  
  // Only the top card (index 0) is draggable
  const isFront = index === 0;

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onRemove();
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : xOffset,
        rotate: isFront ? rotate : staticRotate,
        opacity: isFront ? opacity : 1 - index * 0.1, // Less fade for better visibility
        scale,
        zIndex,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onClick={() => isFront && window.open(`https://youtube.com/shorts/${data.videoId}`, '_blank')}
      animate={{ 
        scale, 
        rotate: isFront ? 0 : staticRotate, // Ensure static rotation is applied in animation state
        x: isFront ? 0 : xOffset, // Ensure static x offset is applied
        zIndex 
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl overflow-hidden bg-gray-900 origin-bottom-left ${isFront ? 'cursor-pointer' : 'cursor-default'}`}
    >
        {/* YouTube Short Iframe */}
        <div className="absolute inset-0 bg-gray-900 pointer-events-none">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${data.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${data.videoId}&showinfo=0&modestbranding=1`}
              title={data.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[140%] object-cover pointer-events-none"
            />
        </div>
        
        {/* Gradient Overlay - Increased opacity for better text readability over video */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end select-none pointer-events-none">
            {/* Play Button (Centered) */}
            <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-lg">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
            </div>

            {/* Text Details */}
            <div className="relative z-10">
            <div className="flex items-center gap-3 text-white/80 text-xs font-medium mb-3">
                <span className="bg-[#FDB022] text-[#0B1A3D] px-2 py-1 rounded text-[10px] uppercase tracking-wide font-bold">
                Ep {data.episode}
                </span>
                <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {data.duration}
                </span>
                <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {data.date}
                </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white leading-tight">
                {data.title}
            </h3>
            </div>
        </div>
    </motion.div>
  );
}
