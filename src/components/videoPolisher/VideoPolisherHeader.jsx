import React from 'react';
import { PageHeader } from '../ui/page-header';

export default function VideoPolisherHeader({ title, description, children }) {
  return (
    <PageHeader
      title={title || "Video Polisher"}
      description={description || "Enhance your video with professional effects using our AI video processor."}
      className="mb-6"
    >
      {children}
    </PageHeader>
  );
} 