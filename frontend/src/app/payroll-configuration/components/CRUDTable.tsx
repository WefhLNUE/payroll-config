'use client';

import { useState, ReactNode } from 'react';

interface CRUDTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => ReactNode;
  }[];
  onEdit?: (item: any) => void;
  onView?: (item: any) => void;
  onDelete?: (item: any) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function CRUDTable({
  data,
  columns,
  onEdit,
  onView,
  onDelete,
  isLoading = false,
  emptyMessage = 'No data available',
}: CRUDTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev: string[]) =>
      prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((item) => item._id || item.id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedIds.length === data.length && data.length > 0}
                onChange={toggleSelectAll}
                className="rounded"
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold text-gray-700">
                {col.label}
              </th>
            ))}
            {(onEdit || onView || onDelete) && (
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item._id || item.id || idx} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id || item.id)}
                  onChange={() => toggleSelection(item._id || item.id)}
                  className="rounded"
                />
              </td>
              {columns.map((col) => (
                <td key={`${item._id || item.id}-${col.key}`} className="px-4 py-3 text-gray-700">
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
              {(onEdit || onView || onDelete) && (
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium transition"
                      >
                        View
                      </button>
                    )}
                    {onEdit && item.status === 'draft' && (
                      <button
                        onClick={() => onEdit(item)}
                        className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm font-medium transition"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && item.status === 'draft' && (
                      <button
                        onClick={() => onDelete(item)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
