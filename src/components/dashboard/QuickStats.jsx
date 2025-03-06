import React from 'react';
import { MetricCard } from '../ui/metric-card';
import { CreditCard, FolderOpen, Film, Users, FileText } from 'lucide-react';
import { MetricCardSkeleton } from '../ui/skeleton';

export default function QuickStats({ isLoading, metrics, user, navigate }) {
  if (isLoading) {
    return (
      <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }
  return (
    <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Your Credits"
        value={user?.credits || 0}
        icon={CreditCard}
        onClick={() => console.log('Credits clicked')}
      />
      <MetricCard
        title="Total Campaigns"
        value={metrics.campaigns}
        icon={FolderOpen}
        onClick={() => navigate('/app/campaigns')}
      />
      <MetricCard
        title="Videos Generated"
        value={metrics.videos}
        icon={Film}
        onClick={() => console.log('Videos clicked')}
      />
      <MetricCard
        title="Active Users"
        value={metrics.users}
        icon={Users}
        onClick={() => console.log('Users clicked')}
      />
      {metrics.drafts > 0 && (
        <MetricCard
          title="Campaign Drafts"
          value={metrics.drafts}
          icon={FileText}
          onClick={() => navigate('/app/campaigns/new')}
        />
      )}
    </div>
  );
}