'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ImageUpload from '@/components/ui/image-upload';

type BannerRow = {
  id: string;
  desktopImage: string;
  mobileImage: string | null;
  link: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type BannersResponse = {
  data: BannerRow[];
};

const emptyForm = {
  desktopImage: '',
  mobileImage: '',
  link: '',
  sortOrder: 0,
  isActive: true,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BannerRow | null>(null);
  const [editTarget, setEditTarget] = useState<BannerRow | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [savingEdit, setSavingEdit] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    if (!isRefresh) setLoading(true);
    try {
      setError('');
      const response = await fetch('/api/banners?includeInactive=1', { cache: 'no-store' });
      const data = (await response.json()) as Partial<BannersResponse> & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load banners');
      }
      setBanners(Array.isArray(data.data) ? data.data : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load banners');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sortedBanners = useMemo(() => {
    const list = [...banners];
    list.sort((a, b) => a.sortOrder - b.sortOrder || b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [banners]);

  const liveBanners = useMemo(() => sortedBanners.filter((banner) => banner.isActive), [sortedBanners]);
  const canDeleteBanners = banners.length > 1;

  const createBanner = async () => {
    const desktopImage = form.desktopImage.trim();
    if (!desktopImage) {
      setError('Desktop image is required');
      return;
    }

    setSubmitting(true);
    try {
      setError('');
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desktopImage,
          mobileImage: form.mobileImage.trim() || null,
          link: form.link.trim() || null,
          sortOrder: Number(form.sortOrder) || 0,
          isActive: form.isActive,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create banner');
      }
      setForm(emptyForm);
      await load(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create banner');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (banner: BannerRow) => {
    try {
      setError('');
      const response = await fetch(`/api/banners/${encodeURIComponent(banner.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Failed to update banner');
      await load(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update banner');
    }
  };

  const openEdit = (banner: BannerRow) => {
    setEditTarget(banner);
    setEditForm({
      desktopImage: banner.desktopImage,
      mobileImage: banner.mobileImage || '',
      link: banner.link || '',
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    });
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    const desktopImage = editForm.desktopImage.trim();
    if (!desktopImage) {
      setError('Desktop image is required');
      return;
    }

    setSavingEdit(true);
    try {
      setError('');
      const response = await fetch(`/api/banners/${encodeURIComponent(editTarget.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desktopImage,
          mobileImage: editForm.mobileImage.trim() || null,
          link: editForm.link.trim() || null,
          sortOrder: Number(editForm.sortOrder) || 0,
          isActive: editForm.isActive,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Failed to update banner');
      setEditTarget(null);
      await load(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update banner');
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    if (!canDeleteBanners) {
      setError('You cannot delete the last remaining banner.');
      setDeleteTarget(null);
      return;
    }
    try {
      setError('');
      const response = await fetch(`/api/banners/${encodeURIComponent(deleteTarget.id)}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || 'Failed to delete banner');
      setDeleteTarget(null);
      await load(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete banner');
    }
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">Home Banners</h2>
        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-60 transition"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pt-4">
        {error && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Currently Live on Home</h3>
              <p className="mt-1 text-xs text-gray-600">
                {liveBanners.length
                  ? `Showing ${liveBanners.length} active banner(s). First slide is the lowest Sort Order.`
                  : 'No active banners. Home will fall back to the default banner.'}
              </p>
            </div>
          </div>

          {liveBanners.length ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveBanners.map((banner) => (
                <div key={banner.id} className="rounded border border-gray-200 overflow-hidden bg-white">
                  <div className="aspect-video bg-gray-100">
                    <img src={banner.desktopImage} alt="Banner" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-700 truncate">Sort: {banner.sortOrder}</p>
                      <p className="text-xs text-gray-500 truncate">{banner.link || '-'}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleActive(banner)}
                        className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                      >
                        Inactivate
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(banner)}
                        disabled={!canDeleteBanners}
                        className="rounded border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ImageUpload
              label="Desktop Banner"
              value={form.desktopImage}
              onChange={(url) =>
                setForm((prev) => ({ ...prev, desktopImage: Array.isArray(url) ? url[0] || '' : url }))
              }
              maxSize={2}
            />
            <ImageUpload
              label="Mobile Banner (optional)"
              value={form.mobileImage}
              onChange={(url) => setForm((prev) => ({ ...prev, mobileImage: Array.isArray(url) ? url[0] || '' : url }))}
              maxSize={2}
            />
            <label className="space-y-1">
              <span className="text-xs font-semibold text-gray-600">Link (optional)</span>
              <input
                value={form.link}
                onChange={(e) => setForm((prev) => ({ ...prev, link: e.target.value }))}
                placeholder="/projects"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-gray-600">Sort Order</span>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4"
                />
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={createBanner}
              disabled={submitting}
              className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-60 transition"
            >
              {submitting ? 'Adding...' : 'Add Banner'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto rounded border border-gray-200 min-h-80 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    S.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Desktop
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Sort
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Link
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedBanners.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-gray-500" colSpan={7}>
                      No banners found
                    </td>
                  </tr>
                ) : (
                  sortedBanners.map((banner, index) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3">
                        <img
                          src={banner.desktopImage}
                          alt="Desktop banner"
                          className="h-14 w-28 rounded object-cover border border-gray-200 bg-gray-100"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {banner.mobileImage ? (
                          <img
                            src={banner.mobileImage}
                            alt="Mobile banner"
                            className="h-14 w-10 rounded object-cover border border-gray-200 bg-gray-100"
                          />
                        ) : (
                          <span className="text-xs text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{banner.sortOrder}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{banner.link || '-'}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleActive(banner)}
                          className={`rounded px-3 py-1 text-xs font-semibold border ${
                            banner.isActive
                              ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(banner)}
                            className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(banner)}
                            disabled={!canDeleteBanners}
                            className="rounded border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">Delete Banner</h3>
            <p className="mt-2 text-sm text-gray-600">This will remove the banner from the home page rotation.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {editTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded bg-white p-6 shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Edit Banner</h3>
                <p className="mt-1 text-sm text-gray-600">Update images, link, ordering, and visibility.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <ImageUpload
                label="Desktop Banner"
                value={editForm.desktopImage}
                onChange={(url) =>
                  setEditForm((prev) => ({ ...prev, desktopImage: Array.isArray(url) ? url[0] || '' : url }))
                }
                maxSize={2}
              />
              <ImageUpload
                label="Mobile Banner (optional)"
                value={editForm.mobileImage}
                onChange={(url) =>
                  setEditForm((prev) => ({ ...prev, mobileImage: Array.isArray(url) ? url[0] || '' : url }))
                }
                maxSize={2}
              />
              <label className="space-y-1">
                <span className="text-xs font-semibold text-gray-600">Link</span>
                <input
                  value={editForm.link}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, link: e.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-gray-600">Sort Order</span>
                  <input
                    type="number"
                    value={editForm.sortOrder}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-semibold text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={savingEdit}
                className="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-60 transition"
              >
                {savingEdit ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
