import React from 'react';
import { cn } from "../../lib/utils";
import { Iphone15Pro } from "./iphone";

export function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-800 ${className}`}
      {...props}
    />
  );
}

export function RecentCampaignSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-8 w-32 mt-4 sm:mt-0" />
        </div>
        <div className="mt-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="space-y-1">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <div 
      className="w-full rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/50"
      style={{ height: `${height}px` }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center p-6">
        <Skeleton className="h-full w-full rounded-md opacity-50" />
      </div>
    </div>
  );
}

export function CampaignDetailsSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <Skeleton className="h-8 w-3/4 mb-3" />
            <Skeleton className="h-5 w-full max-w-2xl mb-2" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <Skeleton className="h-7 w-48 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhoneFrameSkeleton() {
  return (
    <div className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] w-[500px] xl:block">
      <div className="flex flex-col items-center">
        <div className="scale-[0.8] origin-top xl:scale-[0.85] -mt-12">
          <div className="relative w-[375px] h-[812px] rounded-[55px] bg-gray-200 dark:bg-gray-700 animate-pulse overflow-hidden shadow-xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[35px] bg-gray-300 dark:bg-gray-800 rounded-b-[20px]"></div>
            
            {/* Screen */}
            <div className="absolute top-[12px] left-[12px] right-[12px] bottom-[12px] rounded-[45px] bg-gray-300 dark:bg-gray-800">
              {/* Content skeleton */}
              <div className="absolute top-[60px] left-[20px] right-[20px] bottom-[60px] flex flex-col items-center justify-center">
                <div className="w-40 h-40 bg-gray-400 dark:bg-gray-600 rounded-md mb-4"></div>
                <div className="w-32 h-4 bg-gray-400 dark:bg-gray-600 rounded-md mb-2"></div>
                <div className="w-48 h-4 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
              </div>
            </div>
            
            {/* Button */}
            <div className="absolute right-[-5px] top-[120px] w-[5px] h-[40px] bg-gray-300 dark:bg-gray-600 rounded-l-sm"></div>
            
            {/* Volume buttons */}
            <div className="absolute left-[-5px] top-[100px] w-[5px] h-[30px] bg-gray-300 dark:bg-gray-600 rounded-r-sm"></div>
            <div className="absolute left-[-5px] top-[140px] w-[5px] h-[60px] bg-gray-300 dark:bg-gray-600 rounded-r-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhonePreviewSkeleton() {
  return (
    <div className="hidden lg:block sticky top-24 h-[calc(100vh-6rem)] w-[500px] xl:block">
      <div className="flex flex-col items-center">
        <div className="scale-[0.8] origin-top xl:scale-[0.85] -mt-12">
          <Iphone15Pro>
            <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-800">
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <Skeleton className="h-40 w-40 rounded-md mb-4" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </Iphone15Pro>
        </div>
      </div>
    </div>
  );
}