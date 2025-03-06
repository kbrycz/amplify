import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../ui/page-header';

export default function AIVideosHeader({ id, navigate }) {
  return (
    <>
      <button
        onClick={() => navigate(`/app/campaigns/${id}`)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to campaign
      </button>

      <PageHeader
        title="AI Generated Videos"
        description="View and manage AI-generated videos for this campaign."
        className="mb-6"
      />
    </>
  );
}