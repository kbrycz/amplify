import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { FileText, Calendar, MapPin, User, Briefcase } from 'lucide-react';

export default function VideoInfoCard({ video, handleInputChange }) {
  // Format the date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle Firestore timestamp
      let date;
      if (typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } else if (typeof timestamp === 'object' && (('seconds' in timestamp) || ('_seconds' in timestamp))) {
        const seconds = timestamp.seconds ?? timestamp._seconds;
        date = new Date(seconds * 1000);
      } else {
        date = new Date(timestamp);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error, timestamp);
      return 'N/A';
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Video Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <Label htmlFor="name">Video Name</Label>
          <Input
            id="name"
            name="name"
            value={video?.name || ''}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Enter a name for this video"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="location">Location</Label>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4" />
              {video?.location || 'Not specified'}
            </div>
          </div>
          
          <div>
            <Label htmlFor="created">Recorded</Label>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              {formatDate(video?.createdAt)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="respondent">Respondent</Label>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              {video?.respondentName || 'Anonymous'}
            </div>
          </div>
          
          <div>
            <Label htmlFor="campaign">Campaign</Label>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Briefcase className="h-4 w-4" />
              {video?.campaignName || 'Not specified'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 