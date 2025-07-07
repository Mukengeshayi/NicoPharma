import { router, usePage } from '@inertiajs/react'
import {
  ArrowUpDown, ChevronDown, Eye, FileEdit, Trash2, Download,
  Plus, Filter, RotateCw, Search, Sliders, MoreVertical, Loader2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Check, X
} from 'lucide-react'
import { useState, useMemo } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState
} from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  onRefresh?: () => void
  onRowClick?: (row: TData) => void
  createRoute?: string
  exportRoute?: string
  deleteRoute?: string
  filters?: Record<string, any>
  idField?: string
}

export function DataTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  meta,
  onRefresh,
  onRowClick,
  createRoute,
  exportRoute,
  deleteRoute,
  filters = {},
  idField = 'id'
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const { url } = usePage()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection
    },
    manualPagination: !!meta,
    pageCount: meta?.last_page ?? -1,
    initialState: meta ? {
      pagination: {
        pageIndex: meta.current_page - 1,
        pageSize: meta.per_page
      }
    } : undefined
  })

  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection)
      .map(index => data[parseInt(index)][idField])
      .filter(Boolean)
  }, [rowSelection, data, idField])

  const handleBulkAction = async (action: 'export' | 'delete') => {
    if (selectedIds.length === 0) {
      alert('Veuillez sélectionner au moins un élément')
      return
    }

    setIsProcessing(true)

    try {
      const route = action === 'export' ? exportRoute : deleteRoute
      if (!route) return

      const params = new URLSearchParams()
      params.append('ids', selectedIds.join(','))

      router.visit(`${route}?${params.toString()}`, {
        preserveScroll: true,
        onFinish: () => {
          setIsProcessing(false)
          setRowSelection({})
        }
      })
    } catch (error) {
      setIsProcessing(false)
      console.error(error)
    }
  }


   const handlePageChange = (page: number) => {
    if (!meta) return
    router.get(url, { page }, {
        preserveState: true,
        preserveScroll: true
    })
 }

const handlePerPageChange = (perPage: number) => {
  router.get(url, {
    ...filters,
    per_page: perPage
  }, {
    preserveState: true,
    preserveScroll: true
  })
}

const resetFilters = () => {
  setColumnFilters([])
  setGlobalFilter('')
  router.get(url, {}, {
    preserveState: true,
    preserveScroll: true
  })
}

  return (
    <div className="space-y-4">
      {/* Toolbar avec sélection multiple */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-800">
              {selectedIds.length} élément(s) sélectionné(s)
            </span>
            <button
              onClick={() => setRowSelection({})}
              className="p-1 rounded-full hover:bg-blue-100"
            >
              <X className="h-4 w-4 text-blue-600" />
            </button>
          </div>

          <div className="flex gap-2">
            {exportRoute && (
              <button
                onClick={() => handleBulkAction('export')}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Exporter
              </button>
            )}

            {deleteRoute && (
              <button
                onClick={() => {
                  if (confirm(`Voulez-vous vraiment supprimer ${selectedIds.length} élément(s) ?`)) {
                    handleBulkAction('delete')
                  }
                }}
                disabled={isProcessing}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Supprimer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toolbar principale */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2">
          {createRoute && (
            <button
              onClick={() => router.get(createRoute)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              columnFilters.length > 0 || globalFilter
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtres</span>
          </button>

          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">Colonnes</span>
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-2 border border-gray-200 z-10">
              {table.getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => (
                  <div key={column.id} className="flex items-center py-1 px-2">
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={() => column.toggleVisibility()}
                      className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700">
                      {column.id}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {table.getAllColumns()
              .filter(column => column.getCanFilter())
              .map(column => (
                <div key={column.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id}
                  </label>
                  <input
                    type="text"
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                    placeholder={`Filtrer...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row.original)}
              >
                <td className="w-10 px-4 py-4" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination et sélection de page */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          {meta ? (
            <>
              Affichage de <span className="font-medium">{meta.per_page * (meta.current_page - 1) + 1}</span> à{' '}
              <span className="font-medium">
                {Math.min(meta.per_page * meta.current_page, meta.total)}
              </span>{' '}
              sur <span className="font-medium">{meta.total}</span> éléments
            </>
          ) : (
            <>
              {table.getFilteredRowModel().rows.length} élément(s)
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {meta && (
            <select
              value={meta.per_page}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>
                  {size} / page
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={meta ? meta.current_page === 1 : !table.getCanPreviousPage()}
              className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(meta ? meta.current_page - 1 : table.getState().pagination.pageIndex)}
              disabled={meta ? meta.current_page === 1 : !table.getCanPreviousPage()}
              className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-sm">
              Page {meta ? meta.current_page : table.getState().pagination.pageIndex + 1}{' '}
              sur {meta ? meta.last_page : table.getPageCount()}
            </span>
            <button
              onClick={() => handlePageChange(meta ? meta.current_page + 1 : table.getState().pagination.pageIndex + 2)}
              disabled={meta ? meta.current_page === meta.last_page : !table.getCanNextPage()}
              className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(meta ? meta.last_page : table.getPageCount())}
              disabled={meta ? meta.current_page === meta.last_page : !table.getCanNextPage()}
              className="p-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
