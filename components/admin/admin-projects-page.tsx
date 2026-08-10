'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  city: string | null;
  createdAt: string;
  isActive: boolean;
};

type ApiResponse = {
  data: ProjectRow[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
    hasPrevious: boolean;
  };
};

type ModalState = {
  isOpen: boolean;
  project: ProjectRow | null;
};

type StatusModalState = {
  isOpen: boolean;
  project: ProjectRow | null;
  nextIsActive: boolean;
};

export default function AdminProjectsPage() {
  const pageSize = 10;
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ApiResponse['pagination']>({
    page: 1,
    limit: pageSize,
    totalCount: 0,
    totalPages: 1,
    hasMore: false,
    hasPrevious: false,
  });
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [deletingId, setDeletingId] = useState('');
  const [updatingStatusId, setUpdatingStatusId] = useState('');
  const [permanentDelete, setPermanentDelete] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, project: null });
  const [statusModalState, setStatusModalState] = useState<StatusModalState>({
    isOpen: false,
    project: null,
    nextIsActive: false,
  });
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);
  const statusCancelButtonRef = useRef<HTMLButtonElement | null>(null);

  const loadProjects = useCallback(
    async (targetPage: number, targetQuery: string, isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      if (!isRefresh) setLoading(true);
      try {
        setError('');
        const params = new URLSearchParams({
          page: String(targetPage),
          limit: String(pageSize),
          includeInactive: '1',
        });
        if (targetQuery.trim()) {
          params.set('search', targetQuery.trim());
        }

        const response = await fetch(`/api/projects?${params.toString()}`, { cache: 'no-store' });
        const data = (await response.json()) as Partial<ApiResponse> & { error?: string };
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load projects');
        }

        setProjects(Array.isArray(data.data) ? data.data : []);
        setPagination({
          page: Number(data.pagination?.page || targetPage),
          limit: Number(data.pagination?.limit || pageSize),
          totalCount: Number(data.pagination?.totalCount || 0),
          totalPages: Math.max(1, Number(data.pagination?.totalPages || 1)),
          hasMore: Boolean(data.pagination?.hasMore),
          hasPrevious: Boolean(data.pagination?.hasPrevious),
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    loadProjects(page, searchQuery);
  }, [loadProjects, page, searchQuery]);

  useEffect(() => {
    if (modalState.isOpen) {
      cancelButtonRef.current?.focus();
      const onEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setModalState({ isOpen: false, project: null });
          setPermanentDelete(false);
          setDeleteError('');
        }
      };
      window.addEventListener('keydown', onEscape);
      return () => {
        window.removeEventListener('keydown', onEscape);
      };
    }
  }, [modalState.isOpen]);

  useEffect(() => {
    if (statusModalState.isOpen) {
      statusCancelButtonRef.current?.focus();
      const onEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setStatusModalState({ isOpen: false, project: null, nextIsActive: false });
          setStatusError('');
        }
      };
      window.addEventListener('keydown', onEscape);
      return () => {
        window.removeEventListener('keydown', onEscape);
      };
    }
  }, [statusModalState.isOpen]);

  const openDeleteModal = (project: ProjectRow) => {
    setPermanentDelete(false);
    setDeleteError('');
    setModalState({ isOpen: true, project });
  };

  const closeDeleteModal = () => {
    if (deletingId) return;
    setModalState({ isOpen: false, project: null });
    setPermanentDelete(false);
    setDeleteError('');
  };

  const confirmDelete = async () => {
    if (!modalState.project) return;
    try {
      setDeleteError('');
      setDeletingId(modalState.project.id);
      const response = await fetch(`/api/projects/${encodeURIComponent(modalState.project.slug)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permanent: permanentDelete }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to delete project');
      }

      if (permanentDelete) {
        setProjects((prev) => prev.filter((item) => item.id !== modalState.project?.id));
        setPagination((prev) => ({
          ...prev,
          totalCount: Math.max(0, prev.totalCount - 1),
        }));
        if (projects.length === 1 && page > 1) {
          setPage((prev) => Math.max(1, prev - 1));
        }
      } else {
        setProjects((prev) =>
          prev.map((item) => (item.id === modalState.project?.id ? { ...item, isActive: false } : item))
        );
      }

      setModalState({ isOpen: false, project: null });
      setPermanentDelete(false);
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setDeletingId('');
    }
  };

  const openStatusModal = (project: ProjectRow) => {
    setStatusError('');
    setStatusModalState({
      isOpen: true,
      project,
      nextIsActive: !project.isActive,
    });
  };

  const closeStatusModal = () => {
    if (updatingStatusId) return;
    setStatusModalState({ isOpen: false, project: null, nextIsActive: false });
    setStatusError('');
  };

  const confirmStatusUpdate = async () => {
    if (!statusModalState.project) return;
    try {
      setStatusError('');
      setUpdatingStatusId(statusModalState.project.id);
      const response = await fetch(`/api/projects/${encodeURIComponent(statusModalState.project.slug)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: statusModalState.nextIsActive }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to update project status');
      }

      setProjects((prev) =>
        prev.map((item) =>
          item.id === statusModalState.project?.id ? { ...item, isActive: statusModalState.nextIsActive } : item
        )
      );
      setStatusModalState({ isOpen: false, project: null, nextIsActive: false });
    } catch (err: unknown) {
      setStatusError(err instanceof Error ? err.message : 'Failed to update project status');
    } finally {
      setUpdatingStatusId('');
    }
  };

  const onSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextQuery = searchInput.trim();
    setPage(1);
    setSearchQuery(nextQuery);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setPage(1);
  };
  const nextDisabled = loading || !pagination.hasMore;

  return (
    <div className="space-y-4 h-full flex flex-col min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Projects</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadProjects(page, searchQuery, true)}
            disabled={refreshing}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            href="/admin/projects/create"
            className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 transition"
          >
            Create Project
          </Link>
        </div>
      </div>

      <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search projects by name, city, address or developer"
          className="w-full sm:max-w-md rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition"
          >
            Search
          </button>
          {(searchQuery || searchInput) && (
            <button
              type="button"
              onClick={clearSearch}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing page {pagination.page} of {pagination.totalPages} · {pagination.totalCount} total project(s)
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
        <div className="overflow-auto rounded border border-gray-200 flex-1 min-h-80">
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
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Visibility
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {projects.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-sm text-gray-500" colSpan={7}>
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">{project.title}</p>
                      <p className="text-xs text-gray-500">{project.category.replaceAll('_', ' ')}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(project.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{project.status.replaceAll('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{project.city || '-'}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openStatusModal(project)}
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold transition ${
                          project.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {project.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/projects/create?slug=${encodeURIComponent(project.slug)}`}
                          className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(project)}
                          className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing page {pagination.page} of {pagination.totalPages} · {pagination.totalCount} total project(s)
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

      {modalState.isOpen && modalState.project && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeDeleteModal}
            aria-label="Close"
          />
          <div className="relative w-full max-w-md rounded bg-white shadow-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900">Delete Project</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold">{modalState.project.title}</span>?
            </p>
            <label className="mt-4 flex items-center gap-3 rounded border border-gray-200 p-3 bg-gray-50">
              <input
                type="checkbox"
                checked={permanentDelete}
                onChange={(event) => setPermanentDelete(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Permanently delete this project</span>
            </label>
            {!permanentDelete && (
              <p className="mt-2 text-xs text-gray-500">
                If unchecked, this performs a soft delete by setting isActive to false.
              </p>
            )}
            {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={closeDeleteModal}
                disabled={Boolean(deletingId)}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition"
              >
                {deletingId ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {statusModalState.isOpen && statusModalState.project && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeStatusModal}
            aria-label="Close"
          />
          <div className="relative w-full max-w-md rounded bg-white shadow-xl border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900">Update Project Visibility</h3>
            <p className="mt-2 text-sm text-gray-600">
              Do you want to{' '}
              <span className="font-semibold">{statusModalState.nextIsActive ? 'activate' : 'inactivate'}</span>{' '}
              <span className="font-semibold">{statusModalState.project.title}</span>?
            </p>
            {statusError && <p className="mt-3 text-sm text-red-600">{statusError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                ref={statusCancelButtonRef}
                type="button"
                onClick={closeStatusModal}
                disabled={Boolean(updatingStatusId)}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusUpdate}
                disabled={Boolean(updatingStatusId)}
                className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60 transition"
              >
                {updatingStatusId ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
