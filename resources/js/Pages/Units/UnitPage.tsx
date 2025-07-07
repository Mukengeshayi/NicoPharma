import AppButton from '@/Components/buttons/AppButton';
import CustomBreadcrumb from '@/Components/Utils/CustomBreadcrumb';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Home, Plus, Ruler } from 'lucide-react';
import React, { useState } from 'react';
// import CreateUnitPage from './CreateUnitPage';
import { PageProps, PaginatedData, Sort } from '@/types';
import AdvancedTable from '@/Components/Utils/AdvancedTable';
import { router } from '@inertiajs/react';
import DeleteConfirmationModal from '@/Components/modal/DeleteConfirmationModal';
import CreateUnitPage from './CreateUnitPage';
import UpdateUnitPage from './UpdateUnitPage';

interface Unit {
  id: number;
  name: string;
  abbreviation: string | null;
  type: string;
  description: string | null;
  created_at: string;
}

interface UnitProps extends PageProps {
  units: PaginatedData<Unit>;
  unitTypes: string[];
  filters: {
    search?: string;
    sort?: Sort;
    perPage?: number;
  };
}

export default function UnitPage({ units, unitTypes, filters }: UnitProps) {
    const [showModal, setShowModal] = useState(false);
    const [preloading, setPreloading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Unit | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    const handleDeleteClick = (item: Unit) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        setDeleteLoading(true);
        router.delete(route('units.destroy', itemToDelete.id), {
        onFinish: () => {
            setDeleteLoading(false);
            setShowDeleteModal(false);
            setItemToDelete(null);
        },
        });
    };

    const handleOpen = () => {
        setPreloading(true);
        setTimeout(() => {
            setPreloading(false);
            setShowModal(true);
        }, 1000);
    };

    const columns = [
        {
            key: 'name',
            label: 'Nom',
            sortable: true,
            filterable: true,
        },
        {
            key: 'abbreviation',
            label: 'Abréviation',
            sortable: true,
            render: (item: Unit) => item.abbreviation || <span className="text-gray-400">-</span>,
        },
        {
            key: 'type',
            label: 'Type',
            sortable: true,
            filterable: true,
            filterOptions: unitTypes.map(t => ({ label: t, value: t })),
            render: (item: Unit) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    item.type === 'primary' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'measure' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                }`}>
                    {item.type}
                </span>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            render: (item: Unit) => (
                <div className="max-w-[300px] truncate" title={item.description || undefined}>
                    {item.description || <span className="text-gray-400">Aucune description</span>}
                </div>
            ),
        },
        {
            key: 'created_at',
            label: 'Créé le',
            sortable: true,
            render: (item: Unit) => new Date(item.created_at).toLocaleDateString('fr-FR'),
        },
    ];

    const breadcrumbItems = [
        { label: "Tableau de bord", href: "/", icon: <Home className="w-5 h-5" /> },
        { label: "Unités" },
    ];

    const handleMassDelete = async (selectedIds: number[]) => {
        if (!confirm(`Supprimer ${selectedIds.length} unité(s) sélectionnée(s) ?`)) return;

        try {
            await router.post(route('units.mass-destroy'), { ids: selectedIds });
        } catch (error) {
            console.error('Erreur lors de la suppression', error);
        }
    };

    return (
        <Authenticated>
            <div className="mx-auto px-2 sm:px-6 lg:px-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                    <div>
                        <CustomBreadcrumb items={breadcrumbItems} />
                    </div>
                    <div className="">
                        <AppButton
                            icon={<Plus className="w-4 h-4"/>}
                            title="Nouvelle Unité"
                            variant="primary"
                            size="md"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleOpen}
                            loading={preloading}
                        />
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <AdvancedTable<Unit>
                        data={units.data}
                        columns={columns}
                        pagination={{
                            currentPage: units.current_page,
                            lastPage: units.last_page,
                            perPage: units.per_page,
                            total: units.total,
                        }}
                        routeName="units.index"
                        filters={filters}
                        idField="id"
                        title="Liste des unités"
                        perPageOptions={[10, 25, 50, 100]}
                        showEdit={true}
                        showDelete={true}
                        actions={{
                            // view: (item) => router.visit(route('units.show', item.id)),
                            edit: (item) => {
                                setSelectedUnit(item);
                                setShowUpdateModal(true);
                            },
                            delete: (item) => handleDeleteClick(item),
                        }}
                        bulkActions={{
                            delete: handleMassDelete,
                        }}
                        emptyState={
                            <div className="text-center py-12">
                                <div className="text-gray-500 mb-4">Aucune unité enregistrée</div>
                            </div>
                        }
                    />
                </div>
            </div>
            <DeleteConfirmationModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                message="Êtes-vous sûr de vouloir supprimer cette unité ? Cette action est irréversible."
            />
            <CreateUnitPage
                unitTypes={unitTypes}
                open={showModal}
                onClose={() => setShowModal(false)}
            />
            {selectedUnit && (
                <UpdateUnitPage
                    open={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    unit={selectedUnit}
                    unitTypes={unitTypes}
                />
            )}
        </Authenticated>
    );
}
