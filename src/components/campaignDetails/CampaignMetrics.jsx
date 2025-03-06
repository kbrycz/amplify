import React from 'react';
import { MetricCard } from '../ui/metric-card';
import { Video, Sparkles, Users, Clock } from 'lucide-react';

export default function CampaignMetrics({ metrics, campaignId, navigate }) {
  return (
    <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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
        title="Target Audience"
        value={metrics.audience}
        icon={Users}
        onClick={() => navigate(`/app/campaigns/${campaignId}/ai-videos`)}
      />
      <MetricCard
        title="Avg Response Time"
        value={metrics.avgResponseTime}
        icon={Clock}
        onClick={() => console.log('Response Time clicked')}
      />
    </div>
  );
}