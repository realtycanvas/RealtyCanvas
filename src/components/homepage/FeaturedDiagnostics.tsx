"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

type FeaturedDiagnosticsData = {
  missingSlugs: string[];
  mismatchedTitles: { slug: string; title: string }[];
};

export default function FeaturedDiagnostics({ diagnostics }: { diagnostics: FeaturedDiagnosticsData }) {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  const { missingSlugs, mismatchedTitles } = diagnostics || { missingSlugs: [], mismatchedTitles: [] };
  const hasIssues = (missingSlugs && missingSlugs.length > 0) || (mismatchedTitles && mismatchedTitles.length > 0);
  if (!hasIssues) return null;

  return (
    <div className="mx-4 md:mx-8 my-4 p-4 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
      <div className="font-semibold mb-2">Admin notice: Featured Projects diagnostics</div>
      {missingSlugs && missingSlugs.length > 0 && (
        <div className="mb-2">
          <div className="text-sm font-medium">Missing curated slugs (not found in DB):</div>
          <ul className="list-disc list-inside text-sm">
            {missingSlugs.map((slug) => (
              <li key={slug}>{slug}</li>
            ))}
          </ul>
        </div>
      )}
      {mismatchedTitles && mismatchedTitles.length > 0 && (
        <div>
          <div className="text-sm font-medium">Title mismatches for curated entries:</div>
          <ul className="list-disc list-inside text-sm">
            {mismatchedTitles.map(({ slug, title }) => (
              <li key={slug}>
                <span className="font-mono">{slug}</span> → <span>{title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}