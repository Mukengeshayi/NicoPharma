import AppButton from '@/Components/buttons/AppButton';
import CustomBreadcrumb from '@/Components/Utils/CustomBreadcrumb';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Box, Home, Plus } from 'lucide-react';
import React, { useState } from 'react';
import CreateMedicinePage from './CreateMedicinePage';
import { PageProps, PaginatedData, Sort } from '@/types';
import AdvancedTable from '@/Components/Utils/AdvancedTable';
import { router } from '@inertiajs/react';
import DeleteConfirmationModal from '@/Components/modal/DeleteConfirmationModal';

interface Medicine {
  id: number;
  code: string;
  name: string;
  family_id: number | null;
  family_name: string | null;
  indications: string | null;
  created_at: string;
}

interface MedecineProps extends PageProps {
  medicines: PaginatedData<Medicine>;
  families: { id: number; name: string }[];
  filters: {
    search?: string;
    sort?: Sort;
    perPage?: number;
  };
}

export default function MedicinePage({ medicines, families, filters }: MedecineProps) {
    const [showModal, setShowModal] = useState(false);
    const [preloading, setPreloading] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedForm, setSelectedForm] = useState<Medicine | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Medicine | null>(null);


    const handleDeleteClick = (item: Medicine) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        setDeleteLoading(true);
        router.delete(route('medicines.destroy', itemToDelete.id), {
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
            key: 'code',
            label: 'Code',
            sortable: true,
            width: 120,
            className: 'font-mono',
        },
        {
            key: 'name',
            label: 'Nom',
            sortable: true,
            filterable: true,
        },
        {
            key: 'family_name',
            label: 'Famille',
            sortable: true,
            filterable: true,
            filterOptions: families.map(f => ({ label: f.name, value: f.id })),
            render: (item: Medicine) => item.family_name || <span className="text-gray-400">Non classé</span>,
        },
        {
            key: 'indications',
            label: 'Indications',
            render: (item: Medicine) => (
                <div className="max-w-[300px] truncate" title={item.indications || undefined}>
                {item.indications || <span className="text-gray-400">Aucune indication</span>}
                </div>
            ),
        },
        {
            key: 'created_at',
            label: 'Créé le',
            sortable: true,
            render: (item: Medicine) => new Date(item.created_at).toLocaleDateString('fr-FR'),
        },
    ];

    const breadcrumbItems = [
        { label: "Tableau de bord", href: "/", icon: <Home className="w-5 h-5" /> },
        { label: "Medicaments" },
    ];
    const handleMassDelete = async (selectedIds: number[]) => {
        if (!confirm(`Supprimer ${selectedIds.length} médicament(s) sélectionné(s) ?`)) return;

        try {
        await router.post(route('medicines.mass-destroy'), { ids: selectedIds });
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
                            icon={<Plus  className="w-4 h-4"/>}
                            title="Nouveau Medicament"
                            variant="primary"
                            size="md"
                            className = " bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleOpen}
                            loading={preloading}
                        />
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                     <AdvancedTable<Medicine>
                        data={medicines.data}
                        columns={columns}
                        pagination={{
                            currentPage: medicines.current_page,
                            lastPage: medicines.last_page,
                            perPage: medicines.per_page,
                            total: medicines.total,
                        }}
                        routeName="medicines.index"
                        filters={filters}
                        idField="id"
                        title="Liste des médicaments"
                        perPageOptions={[10, 25, 50, 100]}
                        showEdit={true}
                        showDelete={true}
                        actions={{
                            view: (item) => router.visit(route('medicines.show', item.id)),
                            edit: (item) => router.visit(route('medicines.edit', item.id)),
                            delete:  (item) => handleDeleteClick(item),
                            custom: [
                                {
                                    icon: <Box className="h-4 w-4" />,
                                    tooltip: 'Gerer le conditionnement',
                                    onClick: (item) => router.visit(route('medicines.packaging.create-bulk', item.id)),
                                    color: 'green',
                                },
                            ],
                        }}
                        bulkActions={{
                            delete: handleMassDelete,
                        }}
                        emptyState={
                            <div className="text-center py-12">
                                <div className="text-gray-500 mb-4">Aucun médicament enregistré</div>
                            </div>
                        }
                    />

                </div>
                {/* Content for MedicinePage goes here */}
            </div>
            <DeleteConfirmationModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                message="Êtes-vous sûr de vouloir supprimer ce medicament ? Cette action est irréversible."
            />
            <CreateMedicinePage families={families} open={showModal} onClose={() => setShowModal(false)} />
        </Authenticated>
    );
}

