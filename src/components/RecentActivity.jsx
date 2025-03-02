// src/components/RecentActivity.jsx
import React, { useState, useEffect } from 'react';
import { SERVER_URL, auth } from '../lib/firebase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { ScaleIn } from './ui/scale-in';
import { Star } from 'lucide-react'; 
import { RecentActivitySkeleton } from './ui/skeleton';

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const idToken = await auth.currentUser.getIdToken();
        const response = await fetch(`${SERVER_URL}/activity`, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch recent activity');
        }
        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error('Error fetching recent activity:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, []);

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
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <ScaleIn key={activity.id} delay={index * 100}>
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
              </ScaleIn>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}