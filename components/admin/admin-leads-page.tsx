'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status?: string;
  createdAt: string;
};

type LeadsResponse = {
  data: LeadRow[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
    hasPrevious: boolean;
  };
};

export default function AdminLeadsPage() {
  const pageSize = 10;
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [archivedOnly, setArchivedOnly] = useState(false);
  const [confirmLead, setConfirmLead] = useState<LeadRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState<LeadsResponse['pagination']>({
    page: 1,
    limit: pageSize,
    totalCount: 0,
    totalPages: 1,
    hasMore: false,
    hasPrevious: false,
  });

  const loadLeads = useCallback(
    async (targetPage: number, targetSort: 'desc' | 'asc', isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      if (!isRefresh) setLoading(true);
      try {
        setError('');
        const params = new URLSearchParams({
          page: String(targetPage),
          limit: String(pageSize),
          sort: targetSort,
        });
        if (search.trim()) params.set('search', search.trim());
        if (archivedOnly) params.set('archivedOnly', '1');
        const response = await fetch(`/api/leads?${params.toString()}`, { cache: 'no-store' });
        const data = (await response.json()) as Partial<LeadsResponse> & { error?: string };
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load leads');
        }
        setLeads(Array.isArray(data.data) ? data.data : []);
        setPagination({
          page: Number(data.pagination?.page || targetPage),
          limit: Number(data.pagination?.limit || pageSize),
          totalCount: Number(data.pagination?.totalCount || 0),
          totalPages: Math.max(1, Number(data.pagination?.totalPages || 1)),
          hasMore: Boolean(data.pagination?.hasMore),
          hasPrevious: Boolean(data.pagination?.hasPrevious),
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load leads');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [archivedOnly, pageSize, search]
  );

  useEffect(() => {
    loadLeads(page, sortOrder);
  }, [loadLeads, page, sortOrder]);

  const sortLabel = useMemo(() => (sortOrder === 'desc' ? 'Newest First' : 'Oldest First'), [sortOrder]);
  const nextDisabled = loading || !pagination.hasMore;

  const runDelete = async (lead: LeadRow, permanent: boolean) => {
    try {
      setDeleting(true);
      const res = await fetch('/api/leads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, permanent }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || 'Failed to delete lead');
      setConfirmLead(null);
      loadLeads(page, sortOrder, true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete lead');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Leads</h2>
        <div className="flex flex-wrap items-center gap-2">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearch(searchInput);
            }}
          >
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name / email / phone..."
              className="h-10 w-64 max-w-full rounded border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Search
            </button>
          </form>
          <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
            <input
              type="checkbox"
              checked={archivedOnly}
              onChange={(e) => {
                setArchivedOnly(e.target.checked);
                setPage(1);
              }}
              className="h-4 w-4"
            />
            Show archived
          </label>
          <button
            type="button"
            onClick={() => loadLeads(page, sortOrder, true)}
            disabled={refreshing}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPage(1);
              setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
            }}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
          >
            Sort: {sortLabel}
          </button>
        </div>
      </div>

      {error && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing page {pagination.page} of {pagination.totalPages} · {pagination.totalCount} total lead(s)
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={loading || !pagination.hasPrevious}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={nextDisabled}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-auto rounded border border-gray-200 flex-1 min-h-80 mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  S.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Purchase Timeline
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Date Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {leads.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-gray-500" colSpan={7}>
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{lead.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{lead.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{lead.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{lead.message || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(lead.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        type="button"
                        onClick={() => setConfirmLead(lead)}
                        className="rounded bg-red-50 text-red-700 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {confirmLead ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded bg-white shadow-xl border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
              <div className="font-bold text-gray-900">Delete Lead</div>
              <button
                type="button"
                onClick={() => (deleting ? null : setConfirmLead(null))}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
            </div>
            <div className="p-4 space-y-2">
              <div className="text-sm text-gray-700">
                {confirmLead.name} · {confirmLead.phone}
              </div>
              <div className="text-xs text-gray-500">
                Temporary delete will archive the lead. Permanent delete will remove it.
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => runDelete(confirmLead, false)}
                className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition"
              >
                {deleting ? 'Deleting...' : 'Delete Temporarily'}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => runDelete(confirmLead, true)}
                className="flex-1 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition"
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing page {pagination.page} of {pagination.totalPages} · {pagination.totalCount} total lead(s)
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={loading || !pagination.hasPrevious}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={nextDisabled}
            className="rounded border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
