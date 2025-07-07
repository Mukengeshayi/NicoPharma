import React, { useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { router } from '@inertiajs/react';
import {
  ArrowUpDown, ChevronDown, Eye, EyeOff, FileEdit, Trash2, Download,
  FileUp, Plus, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Filter, RotateCw, Search, Sliders, MoreVertical, Loader2
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (item: T) => ReactNode;
  hidden?: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  width?: number | string;
  filterOptions?: { label: string; value: any }[];
}

interface CustomAction<T> {
  icon: React.ReactNode;
  tooltip: string;
  onClick: (row: T) => void;
  color?: string;
  isDisabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  routeName: string;
  searchable?: boolean;
  exportable?: boolean;
  exportEndpoint?: string; // Nouvelle prop pour l'export backend
  selectable?: boolean;
  showDelete?: boolean;
  showEdit?: boolean;
  showButton?: boolean;
  loading?: boolean;
  actions?: {
    view?: boolean | ((item: T) => void);
    edit?: boolean | ((item: T) => void);
    delete?: boolean | ((item: T) => void);
    custom?: CustomAction<T>[];
  };
  bulkActions?: {
    delete?: (selectedIds: any[]) => Promise<void>;
    export?: (selectedIds: any[]) => Promise<void>;
  };
  onRowClick?: (item: T) => void;
  filters?: {
    search?: string;
    sort?: {
      field: string;
      direction: 'asc' | 'desc';
    };
    perPage?: number;
    [key: string]: any;
  };
  idField?: string;
  title?: string;
  perPageOptions?: number[];
  createRoute?: string | (() => void);
  createLabel?: string;
  rowActionsDropdown?: boolean;
  onRefresh?: () => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  stickyHeader?: boolean;
  rowClassName?: (item: T) => string;
  emptyState?: ReactNode;
}

export default function AdvancedTable<T>({
  data,
  columns: initialColumns,
  pagination,
  routeName,
  searchable = true,
  exportable = true,
  exportEndpoint, // Nouvelle prop
  selectable = true,
  showDelete = false,
  showEdit = false,
  showButton = true,
  loading = false,
  actions = { view: true, edit: true, delete: true },
  bulkActions,
  onRowClick,
  filters,
  idField = 'id',
  title = 'Tableau de données',
  perPageOptions = [10, 25, 50, 100],
  createRoute,
  createLabel = 'Ajouter',
  rowActionsDropdown = false,
  onRefresh,
  onFilterChange,
  stickyHeader = true,
  rowClassName,
  emptyState
}: TableProps<T>) {
  // Initialiser les filtres
  const defaultFilters = {
    search: '',
    sort: {
      field: initialColumns.find(col => col.sortable)?.key || initialColumns[0]?.key || 'id',
      direction: 'asc' as 'asc' | 'desc'
    },
    perPage: pagination?.perPage || 10,
    ...(filters || {})
  };

  const [search, setSearch] = useState(defaultFilters.search);
  const [sort, setSort] = useState(defaultFilters.sort);
  const [perPage, setPerPage] = useState(defaultFilters.perPage);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [columns, setColumns] = useState(initialColumns);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Réinitialiser la sélection lorsque les données changent
  useEffect(() => {
    setSelectedItems([]);
    setSelectAll(false);
  }, [data]);

  // Appliquer la recherche avec un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== defaultFilters.search) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = useCallback((field: string) => {
    if (!field) return;

    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    const newSort = { field, direction };
    setSort(newSort);

    router.get(route(routeName), {
      search,
      sort: newSort,
      perPage,
      ...localFilters
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [search, perPage, localFilters, routeName, sort]);

  const handleSearch = useCallback(() => {
    router.get(route(routeName), {
      search,
      sort,
      perPage,
      ...localFilters
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [search, sort, perPage, localFilters, routeName]);

  const handlePageChange = useCallback((page: number) => {
    router.get(route(routeName, { page }), {
      search,
      sort,
      perPage,
      ...localFilters
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [search, sort, perPage, localFilters, routeName]);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    router.get(route(routeName), {
      search,
      sort,
      perPage: newPerPage,
      ...localFilters
    }, {
      preserveState: true,
      preserveScroll: false,
    });
  }, [search, sort, localFilters, routeName]);

  const getSortIcon = useCallback((field: string) => {
    if (sort.field !== field) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />;
    return sort.direction === 'asc' ? <ChevronDown className="ml-2 h-3 w-3" /> : <ChevronDown className="ml-2 h-3 w-3 rotate-180" />;
  }, [sort]);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item: any) => item[idField]));
    }
    setSelectAll(!selectAll);
  }, [selectAll, data, idField]);

  const handleSelectItem = useCallback((id: any) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, id]);
      if (selectedItems.length + 1 === data.length) {
        setSelectAll(true);
      }
    }
  }, [selectedItems, data.length]);

  const handleBulkAction = useCallback(async (action: string) => {
    if (selectedItems.length === 0) {
      toast.warning('Veuillez sélectionner au moins un élément');
      return;
    }

    setIsBulkProcessing(true);

    try {
      switch (action) {
        case 'delete':
          if (bulkActions?.delete) {
            await bulkActions.delete(selectedItems);
            setSelectedItems([]);
            setSelectAll(false);
            toast.success('Suppression en masse effectuée avec succès');
          }
          break;
        case 'export':
          await handleExport(selectedItems);
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de l\'opération');
      console.error(error);
    } finally {
      setIsBulkProcessing(false);
    }
  }, [selectedItems, bulkActions]);

  // Nouvelle fonction pour gérer l'export côté backend
  const handleExport = useCallback(async (ids?: any[]) => {
    if (!exportEndpoint) {
      toast.error('Endpoint d\'export non configuré');
      return;
    }

    setIsExporting(true);
    try {
      const params = {
        ...filters,
        ids: ids?.length ? ids : undefined,
        format: 'xlsx'
      };

      // Créer une URL avec les paramètres de requête
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryString.append(`${key}[]`, v));
          } else {
            queryString.append(key, value);
          }
        }
      });

      // Créer un lien temporaire et déclencher le téléchargement
      const link = document.createElement('a');
      link.href = `${exportEndpoint}?${queryString.toString()}`;
      link.download = 'export.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Export en cours...');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [exportEndpoint, filters]);

  const toggleColumnVisibility = useCallback((key: string) => {
    setColumns(prevColumns =>
      prevColumns.map(col =>
        col.key === key ? { ...col, hidden: !col.hidden } : col
      )
    );
  }, []);

  const handleAction = useCallback((actionType: string, item: T) => {
    const action = actions[actionType as keyof typeof actions];

    if (typeof action === 'function') {
      action(item);
    } else {
      switch (actionType) {
        case 'view':
          toast.info(`Voir l'élément ${(item as any)[idField]}`);
          break;
        case 'edit':
          toast.info(`Éditer l'élément ${(item as any)[idField]}`);
          break;
        case 'delete':
          toast.info(`Supprimer l'élément ${(item as any)[idField]}`);
          break;
      }
    }
  }, [actions, idField]);

  const handleCreate = useCallback(() => {
    if (typeof createRoute === 'function') {
      createRoute();
    } else if (createRoute) {
      router.get(route(createRoute));
    }
  }, [createRoute]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      router.get(route(routeName), {
        search,
        sort,
        perPage,
        ...newFilters
      }, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  }, [localFilters, onFilterChange, routeName, search, sort, perPage]);

  const resetFilters = useCallback(() => {
    setLocalFilters({});
    setSearch('');
    if (onFilterChange) {
      onFilterChange({});
    } else {
      router.get(route(routeName), {
        sort,
        perPage: defaultFilters.perPage
      }, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  }, [onFilterChange, routeName, sort, defaultFilters.perPage]);

  const visibleColumns = useMemo(() => columns.filter(col => !col.hidden), [columns]);

  const renderActions = useCallback((row: T) => {
    const actionButtons = [
      actions?.view && showButton && {
        icon: <Eye className="h-4 w-4" />,
        tooltip: 'Voir',
        onClick: () => handleAction('view', row),
        color: 'blue'
      },
      actions?.edit && showEdit && {
        icon: <FileEdit className="h-4 w-4" />,
        tooltip: 'Éditer',
        onClick: () => handleAction('edit', row),
        color: 'green'
      },
      actions?.delete && showDelete && {
        icon: <Trash2 className="h-4 w-4" />,
        tooltip: 'Supprimer',
        onClick: () => handleAction('delete', row),
        color: 'red'
      },
      ...(actions?.custom || [])
    ].filter(Boolean) as CustomAction<T>[];

    if (rowActionsDropdown && actionButtons.length > 0) {
      return (
        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
          <div className="absolute right-0 z-20 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
            {actionButtons.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick(row);
                }}
                disabled={action.isDisabled?.(row)}
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                  action.isDisabled?.(row) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                } text-${action.color}-600`}
                title={action.tooltip}
              >
                {action.icon}
                {action.tooltip}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {actionButtons.map((action, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick(row);
            }}
            disabled={action.isDisabled?.(row) || action.hidden?.(row)}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
              action.isDisabled?.(row) || action.hidden?.(row) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={action.tooltip}
          >
            <span className={`text-${action.color}-600`}>
              {action.icon}
            </span>
          </button>
        ))}
      </div>
    );
  }, [actions, handleAction, rowActionsDropdown, showButton, showDelete, showEdit]);

  const renderPagination = useMemo(() => {
    if (!pagination || pagination.total <= 0) return null;

    const totalPages = pagination.lastPage;
    const currentPage = pagination.currentPage;
    const maxVisiblePages = 5;

    let startPage: number, endPage: number;
    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Affichage de <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> à{' '}
          <span className="font-medium">{Math.min(currentPage * perPage, pagination.total)}</span> sur{' '}
          <span className="font-medium">{pagination.total}</span> éléments
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className={`px-3 py-1 rounded border ${1 === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'}`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}

          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded border ${page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'}`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-3 py-1 rounded border ${totalPages === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'}`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }, [pagination, perPage, handlePageChange]);

  return (
    <div className="w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="p-4 md:p-6">
        {/* En-tête du tableau */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Actualiser"
              >
                <RotateCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            {createRoute && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" /> {createLabel}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {searchable && (
              <div className="relative flex-grow sm:flex-grow-0 w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  Object.keys(localFilters).length > 0
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Filter className="h-4 w-4" /> Filtres
              </button>

              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors"
              >
                <Sliders className="h-4 w-4" /> Colonnes
              </button>

              {exportable && exportEndpoint && (
                <button
                  onClick={() => handleExport()}
                  disabled={isExporting}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Exporter
                </button>
              )}
            </div>

            {/* Sélection du nombre d'éléments par page */}
            <div className="flex items-center gap-2">
              <select
                value={perPage}
                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                className="px-3 py-2 border rounded-lg text-sm min-w-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {perPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns.filter(col => col.filterable).map(column => (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.label}
                  </label>
                  {column.filterOptions ? (
                    <select
                      value={localFilters[column.key] || ''}
                      onChange={(e) => handleFilterChange(column.key, e.target.value || undefined)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Tous</option>
                      {column.filterOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={localFilters[column.key] || ''}
                      onChange={(e) => handleFilterChange(column.key, e.target.value || undefined)}
                      placeholder={`Filtrer par ${column.label}`}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}

        {/* Sélection multiple */}
        {selectable && selectedItems.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                {selectedItems.length} élément(s) sélectionné(s)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exportable && exportEndpoint && (
                <button
                  onClick={() => handleBulkAction('export')}
                  disabled={isBulkProcessing}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded flex items-center gap-2 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Exporter
                </button>
              )}
              {bulkActions?.delete && (
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={isBulkProcessing}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded flex items-center gap-2 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkProcessing ? (
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

        {/* Sélecteur de colonnes */}
        {showColumnSelector && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-25 z-[9998]" onClick={() => setShowColumnSelector(false)} />
            <div className="absolute z-[9999] mt-2 w-56 bg-white rounded-md shadow-lg p-2 border right-4">
              <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2 pb-2 border-b">
                <span>Colonnes visibles</span>
                <button
                  onClick={() => setShowColumnSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {columns.map(column => (
                <div key={column.key} className="flex items-center py-1">
                  <input
                    type="checkbox"
                    id={`col-${column.key}`}
                    checked={!column.hidden}
                    onChange={() => toggleColumnVisibility(column.key)}
                    className="mr-2 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`col-${column.key}`} className="text-sm text-gray-600">
                    {column.label}
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Conteneur du tableau */}
        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <div className="min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
                <tr>
                  {selectable && (
                    <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                    </th>
                  )}

                  {visibleColumns.map((column, index) => (
                    <th
                      key={column.key}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                      } ${column.headerClassName || ''} ${
                        index === 0 && selectable ? 'sticky left-[49px] z-20 bg-gray-50' : ''
                      }`}
                      onClick={() => column.sortable !== false ? handleSort(column.key) : null}
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{column.label}</span>
                        {column.sortable !== false && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}

                  {(actions.view || actions.edit || actions.delete || actions.custom) && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 z-20 bg-gray-50">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={
                        visibleColumns.length +
                        (selectable ? 1 : 0) +
                        ((actions.view || actions.edit || actions.delete || actions.custom) ? 1 : 0)
                      }
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex justify-center items-center gap-2 text-gray-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Chargement des données...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        visibleColumns.length +
                        (selectable ? 1 : 0) +
                        ((actions.view || actions.edit || actions.delete || actions.custom) ? 1 : 0)
                      }
                      className="px-6 py-12 text-center"
                    >
                      {emptyState || (
                        <div className="text-gray-500 py-8">
                          <div className="flex flex-col items-center justify-center">
                            <FileUp className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune donnée disponible</h3>
                            <p className="text-sm text-gray-500">Aucun résultat trouvé pour votre recherche</p>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  data.map((item: any) => (
                    <tr
                      key={item[idField]}
                      className={`hover:bg-gray-50 ${rowClassName ? rowClassName(item) : ''} ${
                        onRowClick ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => onRowClick && onRowClick(item)}
                    >
                      {selectable && (
                        <td
                          className="sticky left-0 z-10 bg-white px-4 py-4 whitespace-nowrap hover:bg-gray-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item[idField])}
                            onChange={() => handleSelectItem(item[idField])}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                        </td>
                      )}

                      {visibleColumns.map((column, index) => (
                        <td
                          key={column.key}
                          className={`px-4 py-4 whitespace-nowrap ${column.cellClassName || ''} ${
                            index === 0 && selectable ? 'sticky left-[49px] z-10 bg-white hover:bg-gray-50' : ''
                          }`}
                        >
                          {column.render ? column.render(item) : (
                            <span className="truncate max-w-xs inline-block">
                              {item[column.key] !== null && item[column.key] !== undefined
                                ? String(item[column.key])
                                : '-'}
                            </span>
                          )}
                        </td>
                      ))}

                      {(actions.view || actions.edit || actions.delete || actions.custom) && (
                        <td className="px-4 py-4 whitespace-nowrap sticky right-0 z-10 bg-white hover:bg-gray-50 group">
                          {renderActions(item)}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {renderPagination}
      </div>
    </div>
  );
}
