// src/components/RecentActivity.jsx
import React, { useState, useEffect } from 'react';
import { get } from '../../lib/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Star, ChevronDown, ChevronUp } from 'lucide-react'; 
import { RecentActivitySkeleton } from '../ui/skeleton';
import { useNamespace } from '../../context/NamespaceContext';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ITEMS = 5;
  const { namespaces, currentNamespace } = useNamespace();

  // Find the current namespace ID
  const currentNamespaceObj = namespaces.find(ns => ns.name === currentNamespace);
  const currentNamespaceId = currentNamespaceObj?.id;

  useEffect(() => {
    async function fetchActivities() {
      if (!currentNamespaceId) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await get(`/activity?namespaceId=${currentNamespaceId}`);
        setActivities(data || []);
      } catch (err) {
        console.error('Error fetching recent activity:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, [currentNamespaceId]);

  if (isLoading) {
    return <RecentActivitySkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Recent Activity</CardTitle>
        <CardDescription className="mt-2">
          Latest updates from your campaigns and video enhancements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Star className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              Unable to load activity
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              We're having trouble loading your recent activity. Please try again later.
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <Star className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              No activity yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Create your first campaign or enhance a video to get started. Your recent activities will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4 relative">
            {(isExpanded ? activities : activities.slice(0, INITIAL_ITEMS)).map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                  <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {activity.createdAt && activity.createdAt._seconds
                      ? new Date(activity.createdAt._seconds * 1000).toLocaleString()
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            ))}
            
            {activities.length > INITIAL_ITEMS && (
              <div className={`${!isExpanded ? 'mt-4' : ''}`}>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {isExpanded ? (
                    <>
                      Show less
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View {activities.length - INITIAL_ITEMS} more
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}