'use client';

import { useState, ReactNode } from 'react';

interface CRUDTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => ReactNode;
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
  }[];
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  onDelete?: (item: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  processingItemId?: string | null;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function CRUDTable({
  data,
  columns,
  onEdit,
  onView,
  onDelete,
  isLoading = false,
  emptyMessage = 'No data available',
  processingItemId = null,
  selectedIds: externalSelectedIds,
  onSelectionChange,
}: CRUDTableProps) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  
  // Use external selectedIds if provided, otherwise use internal state
  const selectedIds = externalSelectedIds !== undefined ? externalSelectedIds : internalSelectedIds;
  const setSelectedIds = onSelectionChange || setInternalSelectedIds;

  const toggleSelection = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((i: string) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => item._id || item.id));
    }
  };

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex gap-4 p-4 border-b border-gray-200">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state with icon
  if (data.length === 0) {
    const isFiltered = emptyMessage.includes('match your filters');
    return (
      <div className="text-center py-12 px-4">
        <div className="flex justify-center mb-4">
          {isFiltered ? (
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) : (
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>
        <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
        {isFiltered && (
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria</p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-2 sm:px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedIds.length === data.length && data.length > 0}
                onChange={toggleSelectAll}
                className="rounded"
                aria-label="Select all items"
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-2 sm:px-4 py-3 text-left font-semibold text-gray-700 ${
                  col.hideOnMobile ? 'hidden md:table-cell' : ''
                } ${col.hideOnTablet ? 'hidden lg:table-cell' : ''}`}
              >
                {col.label}
              </th>
            ))}
            {(onEdit || onView || onDelete) && (
              <th className="px-2 sm:px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            const isProcessing = processingItemId === (item._id || item.id);
            return (
              <tr
                key={item._id || item.id || idx}
                className={`border-b border-gray-200 transition-colors ${
                  isProcessing
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-2 sm:px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id || item.id)}
                    onChange={() => toggleSelection(item._id || item.id)}
                    className="rounded"
                    aria-label={`Select item ${idx + 1}`}
                    disabled={isProcessing}
                  />
                </td>
                {columns.map((col) => (
                  <td
                    key={`${item._id || item.id}-${col.key}`}
                    className={`px-2 sm:px-4 py-3 text-gray-700 ${
                      col.hideOnMobile ? 'hidden md:table-cell' : ''
                    } ${col.hideOnTablet ? 'hidden lg:table-cell' : ''}`}
                  >
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                {(onEdit || onView || onDelete) && (
                  <td className="px-2 sm:px-4 py-3">
                    <div className="flex justify-center gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(item)}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium transition"
                          aria-label={`View item ${idx + 1}`}
                        >
                          View
                        </button>
                      )}
                      {onEdit && item.status === 'draft' && (
                        <button
                          onClick={() => onEdit(item)}
                          className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm font-medium transition"
                          aria-label={`Edit item ${idx + 1}`}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && item.status === 'draft' && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition"
                          aria-label={`Delete item ${idx + 1}`}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
