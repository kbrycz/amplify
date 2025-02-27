import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/page-header';
import { ArrowLeft, LayoutList, LayoutGrid } from 'lucide-react';
import { SERVER_URL, auth } from '../lib/firebase';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { ErrorMessage } from '../components/ui/error-message';
import { ListViewResponse } from '../components/responses/ListViewResponse';
import { CarouselViewResponse } from '../components/responses/CarouselViewResponse';
import { VideoModal } from '../components/responses/VideoModal';

export default function Responses() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'carousel'

  useEffect(() => {
    fetchResponses();
  }, [id]);

  const fetchResponses = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await fetch(`${SERVER_URL}/survey/videos/${id}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }

      const data = await response.json();
      setResponses(data);
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

      {isLoading ? (
        <LoadingSpinner message="Loading responses..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : responses.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No responses yet.</p>
        </div>
      ) : (
        viewMode === 'list' ? (
          /* List View */
          <div className="mt-8 space-y-4">
            {responses.map(response => (
              <ListViewResponse
                key={response.id}
                response={response}
                onClick={() => setSelectedTestimonial(response)}
              />
            ))}
          </div>
        ) : (
          /* Carousel View */
          <div className="mt-8">
            <CarouselViewResponse testimonials={responses} />
          </div>
        )
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