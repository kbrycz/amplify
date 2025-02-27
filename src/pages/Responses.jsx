import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { Play, X, Clock, Circle, ArrowLeft, LayoutList, LayoutGrid, ArrowRight } from 'lucide-react';

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    zipCode: "94105",
    date: "March 19, 2025",
    duration: "2:15",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787",
    videoUrl: "/videos/demo.mp4",
    watched: false
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@example.com",
    zipCode: "90210",
    date: "March 18, 2025",
    duration: "1:45",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787",
    videoUrl: "/videos/demo.mp4",
    watched: false
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    zipCode: "60601",
    date: "March 17, 2025",
    duration: "3:00",
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2787",
    videoUrl: "/videos/demo.mp4",
    watched: false
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.k@example.com",
    zipCode: "10001",
    date: "March 16, 2025",
    duration: "2:30",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2787",
    videoUrl: "/videos/demo.mp4",
    watched: true
  },
  {
    id: 5,
    name: "Rachel Thompson",
    email: "rachel.t@example.com",
    zipCode: "98101",
    date: "March 15, 2025",
    duration: "1:55",
    thumbnail: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?q=80&w=2787",
    videoUrl: "/videos/demo.mp4",
    watched: true
  }
];

function VideoModal({ testimonial, onClose }) {
  if (!testimonial) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}>
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-6 top-6 p-2.5 text-white hover:text-white/80 bg-gray-900/90 hover:bg-gray-800/90 rounded-full backdrop-blur-sm transition-colors shadow-lg ring-1 ring-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4">
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
          <video
            src={testimonial.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

function ResponseCard({ response, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-48 flex-shrink-0 overflow-hidden rounded-lg">
        {!response.watched && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
            <Circle className="h-2 w-2 fill-current" />
            <span>New</span>
          </div>
        )}
        <img
          src={response.thumbnail}
          alt={response.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          <span>{response.duration}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
            <Play className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {response.name}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {response.email}
        </p>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span>Zip code: {response.zipCode}</span>
          <span>{response.date}</span>
        </div>
      </div>
    </div>
  );
}

function CarouselView({ testimonials }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {      
      if (e.key === 'ArrowRight') {
        if (currentIndex < testimonials.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, testimonials.length]);

  const handleScroll = (e) => {
    // Prevent default scrolling
    e.preventDefault();
    
    // Use deltaX for horizontal scrolling
    if (e.deltaX > 0 && currentIndex < testimonials.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (e.deltaX < 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < testimonials.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div 
      className="relative h-[calc(100vh-12rem)] overflow-hidden rounded-2xl bg-black"
      onWheel={handleScroll} 
    >
      <div 
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {testimonials.map((testimonial, index) => (
          <div 
            key={testimonial.id}
            className="relative h-full w-full flex-shrink-0 flex items-center justify-center"
          >
            {/* Video container */}
            <div className="relative w-full max-w-[800px] mx-auto aspect-video bg-black group">
              {!testimonial.watched && (
                <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                  <Circle className="h-2 w-2 fill-current" />
                  <span>New</span>
                </div>
              )}
            <video
              src={testimonial.videoUrl}
              className="absolute inset-0 h-full w-full object-contain"
              loop
              muted
              autoPlay={currentIndex === index}
              playsInline
            />
            
            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <h3 className="text-xl font-semibold">{testimonial.name}</h3>
              <p className="mt-1 text-sm text-gray-200">{testimonial.email}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-300">
                <span>Zip code: {testimonial.zipCode}</span>
                <span>{testimonial.date}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {testimonial.duration}
                </span>
              </div>
            </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white transition-opacity ${
          currentIndex === 0 ? 'opacity-30' : 'hover:opacity-75'
        }`}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex === testimonials.length - 1}
        className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white transition-opacity ${
          currentIndex === testimonials.length - 1 ? 'opacity-30' : 'hover:opacity-75'
        }`}
      >
        <ArrowRight className="h-6 w-6" />
      </button>

      {/* Progress indicator */}
      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex gap-2">
        {testimonials.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 w-6 rounded-full transition-all duration-200 ${
              i === currentIndex 
                ? 'bg-white scale-x-100' 
                : 'bg-white/40 scale-x-75'
            } cursor-pointer hover:bg-white/60`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Responses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'carousel'

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(`/app/campaigns/${id}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaign
      </button>

      <PageHeader
        title="Campaign Responses"
        description="View and manage video testimonials for this campaign"
      >
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
          <button
            onClick={() => setViewMode('list')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <LayoutList className="h-4 w-4" />
            List
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              viewMode === 'carousel'
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Carousel
          </button>
        </div>
      </PageHeader>

      {viewMode === 'list' ? (
        /* List View */
        <div className="mt-8 space-y-4">
          {testimonials.map((testimonial) => (
            <ResponseCard
              key={testimonial.id}
              response={testimonial}
              onClick={() => setSelectedTestimonial(testimonial)}
            />
          ))}
        </div>
      ) : (
        /* Carousel View */
        <div className="mt-8">
          <CarouselView testimonials={testimonials} />
        </div>
      )}
      
      {/* Video modal (only shown in list view) */}
      {viewMode === 'list' && selectedTestimonial && (
        <VideoModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}
      
      <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Shout. All rights reserved.
      </div>
    </div>
  );
}