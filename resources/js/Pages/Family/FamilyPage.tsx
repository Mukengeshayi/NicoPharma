import AppButton from '@/Components/buttons/AppButton';
import CustomBreadcrumb from '@/Components/Utils/CustomBreadcrumb';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Home, Plus } from 'lucide-react';
import React, { useState } from 'react';
import CreateFamilyPage from './CreateFamilyPage';
import { PageProps, PaginatedData, Sort } from '@/types';
import { router } from '@inertiajs/react';
import AdvancedTable from '@/Components/Utils/AdvancedTable';
import DeleteConfirmationModal from '@/Components/modal/DeleteConfirmationModal';
import UpdateFamilyPage from './UpdateFamilyPage';

interface Family {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}
interface FamilyProps extends PageProps {
  families: PaginatedData<Family>;
  filters: {
    search?: string;
    sort?: Sort;
    perPage?: number;
  };
}

export default function FamilyPage({families, filters }: FamilyProps){
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Family | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [preloading, setPreloading] = useState(false);

        const handleDeleteClick = (item: Family) => {
            setItemToDelete(item);
            setShowDeleteModal(true);
        };
        const handleConfirmDelete = () => {
            if (!itemToDelete) return;

            setDeleteLoading(true);
            router.delete(route('families.destroy', itemToDelete.id), {
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
                key: 'description',
                label: 'Description',
                render: (item: Family) => (
                    <div className="max-w-[300px] truncate" title={item.description || undefined}>
                    {item.description || <span className="text-gray-400">Aucune description</span>}
                    </div>
                ),
            },
            {
                key: 'created_at',
                label: 'Date création',
                sortable: true,
                render: (item: Family) => new Date(item.created_at).toLocaleDateString('fr-FR'),
                headerClassName: 'whitespace-nowrap',
            },

    ];
    const breadcrumbItems = [
        { label: "Tableau de bord", href: "/", icon: <Home className="w-5 h-5" /> },
        { label: "Familles" },
    ];
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
                            title="Ajouter"
                            variant="primary"
                            size="md"
                            className = " bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleOpen}
                            loading={preloading}
                        />
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    <AdvancedTable<Family>
                                        data={families.data}
                                        columns={columns}
                                        pagination={{
                                            currentPage: families.current_page,
                                            lastPage: families.last_page,
                                            perPage: families.per_page,
                                            total: families.total,
                                        }}
                                        routeName="families.index"
                                        filters={filters}
                                        idField="id"
                                        title="Familles des medicaments"
                                        perPageOptions={[10, 25, 50, 100]}
                                        onRowClick={(item) => router.visit(route('families.show', item.id))}
                                        showEdit={true}
                                        showDelete={true}
                                        actions={{
                                            view: (item) => router.visit(route('families.show', item.id)),
                                            edit: (item) => {
                                                setSelectedFamily(item);
                                                setShowUpdateModal(true);
                                            },
                                            delete: (item) => handleDeleteClick(item),

                                        }}
                                        emptyState={
                                            <div className="text-center py-2">
                                                <div className="text-gray-500 mb-4">Aucune forme trouvée</div>
                                            </div>
                                        }
                                    />
                                </div>
            </div>
            <CreateFamilyPage open={showModal} onClose={() => setShowModal(false)} />
            {selectedFamily && (
                <UpdateFamilyPage
                    open={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    family={selectedFamily}
                />
            )}
            <DeleteConfirmationModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                message="Êtes-vous sûr de vouloir supprimer cette famille ? Cette action est irréversible."
            />
        </Authenticated>
    )
}











