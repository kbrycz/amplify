import React from 'react';
import { MetricCard } from '../ui/metric-card';
import { MessageSquareText, Video, Sparkles, Clock } from 'lucide-react';

export default function CampaignMetrics({ metrics, campaignId, navigate, campaign }) {
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

  // Fake data for unread responses (approximately 20-40% of total responses)
  const unreadResponses = Math.floor((metrics.responses || 0) * (Math.random() * 0.2 + 0.2));

  return (
    <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Unread Responses"
        value={unreadResponses}
        icon={MessageSquareText}
        onClick={() => navigate(`/app/campaigns/${campaignId}/responses`)}
      />
      <MetricCard
        title="Total Responses"
        value={metrics.responses}
        icon={Video}
        onClick={() => navigate(`/app/campaigns/${campaignId}/responses`)}
      />
      <MetricCard
        title="AI Generated Videos"
        value={metrics.videos}
        icon={Sparkles}
        onClick={() => navigate(`/app/campaigns/${campaignId}/ai-videos`)}
      />
      <MetricCard
        title="Campaign Age"
        value={calculateCampaignAge()}
        icon={Clock}
        onClick={() => console.log('Campaign Age clicked')}
      />
    </div>
  );
}