"use client";

import { useMemo, useState } from "react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  emptyLabel?: string;
  searchPlaceholder?: string;
}

export default function DataTable({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  emptyLabel = "Nothing here yet.",
  searchPlaceholder = "Search",
}: DataTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return data;
    return data.filter((row) =>
      columns.some((column) =>
        String(row[column.key] ?? "")
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [columns, data, query]);

  return (
    <div className="admin-panel overflow-hidden">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          className="admin-input max-w-xs"
        />
      </div>
      {loading ? (
        <div className="space-y-3 p-4">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="h-10 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-6 py-16 text-center text-sm text-zinc-500">
          {query ? "No matches." : emptyLabel}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 font-medium">
                    {column.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filtered.map((row, rowIndex) => (
                <tr key={row.id || rowIndex} className="text-zinc-800 dark:text-zinc-100">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-middle">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            aria-label="Edit"
                            title="Edit"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          >
                            <PencilIcon />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
                            aria-label="Delete"
                            title="Delete"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          >
                            <TrashIcon />
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
      )}
    </div>
  );
}

function PencilIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z" strokeLinejoin="round" />
      <path d="M13.5 6.5l3 3" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M9 7V5h6v2" strokeLinejoin="round" />
      <path d="M7 7l1 13h8l1-13" strokeLinejoin="round" />
    </svg>
  );
}
