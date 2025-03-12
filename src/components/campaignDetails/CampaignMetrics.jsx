import React, { useState } from 'react';
import { MetricCard } from '../ui/metric-card';
import { Video, Clock, Sparkles } from 'lucide-react';
import CampaignAgeModal from './CampaignAgeModal';

export default function CampaignMetrics({ metrics, campaignId, navigate, campaign, currentNamespaceId }) {
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);

  // Calculate campaign age based on createdAt timestamp
  const calculateCampaignAge = () => {
    if (!campaign || !campaign.createdAt) {
      return "N/A";
    }
    
    // Convert Firebase timestamp to JavaScript Date
    const createdAtSeconds = campaign.createdAt._seconds || campaign.createdAt.seconds;
    const createdAt = new Date(createdAtSeconds * 1000);
    const now = new Date();
    
    // Calculate difference in milliseconds
    const diffMs = now - createdAt;
    
    // Convert to years, months, days
    const msInYear = 1000 * 60 * 60 * 24 * 365.25;
    const msInMonth = msInYear / 12;
    const msInDay = 1000 * 60 * 60 * 24;
    
    const years = Math.floor(diffMs / msInYear);
    const months = Math.floor((diffMs % msInYear) / msInMonth);
    const days = Math.floor((diffMs % msInMonth) / msInDay);
    
    // Format the string
    let ageString = "";
    if (years > 0) {
      ageString += `${years} ${years === 1 ? 'year' : 'years'}`;
      if (months > 0) {
        ageString += `, ${months} ${months === 1 ? 'month' : 'months'}`;
      }
    } else if (months > 0) {
      ageString += `${months} ${months === 1 ? 'month' : 'months'}`;
      if (days > 0) {
        ageString += `, ${days} ${days === 1 ? 'day' : 'days'}`;
      }
    } else {
      ageString = `${days} ${days === 1 ? 'day' : 'days'}`;
    }
    
    return ageString;
  };

  // Helper function to add namespace ID to navigation URLs
  const navigateWithNamespace = (path) => {
    // Append namespace ID as a query parameter if available
    const queryParam = currentNamespaceId ? `?namespaceId=${currentNamespaceId}` : '';
    navigate(`${path}${queryParam}`);
  };

  return (
    <>
      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <MetricCard
          title="Campaign Responses"
          value={metrics.responses}
          icon={Video}
          onClick={() => navigateWithNamespace(`/app/campaigns/${campaignId}/responses`)}
        />
        <MetricCard
          title="AI Videos"
          value={campaign.aiVideoCount || 0}
          icon={Sparkles}
          onClick={() => navigateWithNamespace(`/app/campaigns/${campaignId}/responses${currentNamespaceId ? '?' : '&'}ai=true`)}
        />
        <MetricCard
          title="Campaign Age"
          value={calculateCampaignAge()}
          icon={Clock}
          onClick={() => setIsAgeModalOpen(true)}
        />
      </div>
      
      {isAgeModalOpen && (
        <CampaignAgeModal 
          campaign={campaign} 
          onClose={() => setIsAgeModalOpen(false)} 
          currentNamespaceId={currentNamespaceId}
        />
      )}
    </>
  );
}