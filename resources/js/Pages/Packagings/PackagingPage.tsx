import AppButton from '@/Components/buttons/AppButton';
import CustomBreadcrumb from '@/Components/Utils/CustomBreadcrumb';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Box, Home, Plus } from 'lucide-react';
import React, { useState } from 'react';
import { PageProps, PaginatedData, Sort } from '@/types';
import AdvancedTable from '@/Components/Utils/AdvancedTable';
import { router } from '@inertiajs/react';
import DeleteConfirmationModal from '@/Components/modal/DeleteConfirmationModal';

interface MedicineForm {
  id: number;
  medicine: {
    id: number;
    name: string;
    code: string;
  };
  form: {
    id: number;
    name: string;
  };
  packaging_unit: {
    id: number;
    name: string;
  };
  content_unit: {
    id: number;
    name: string;
    abbreviation: string;
  };
  content_quantity: number;
  price: number;
  created_at: string;
}

interface PackagingProps extends PageProps {
  medicineForms: PaginatedData<MedicineForm>;
  filters: {
    search?: string;
    sort?: Sort;
    perPage?: number;
  };
}

export default function PackagingPage({ medicineForms, filters }: PackagingProps) {
    const [showModal, setShowModal] = useState(false);
    const [preloading, setPreloading] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<MedicineForm | null>(null);

    const handleDeleteClick = (item: MedicineForm) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        setDeleteLoading(true);
        router.delete(route('medicine-forms.destroy', itemToDelete.id), {
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

    const handleMassDelete = async (selectedIds: number[]) => {
        if (!confirm(`Supprimer ${selectedIds.length} conditionnement(s) sélectionné(s) ?`)) return;

        try {
            await router.post(route('medicine-forms.mass-destroy'), { ids: selectedIds });
        } catch (error) {
            console.error('Erreur lors de la suppression', error);
        }
    };

    const columns = [
        {
            key: 'medicine.code',
            label: 'Code médicament',
            sortable: true,
            width: 120,
            className: 'font-mono',
            render: (item: MedicineForm) => item.medicine.code,
        },
        {
            key: 'packaging',
            label: 'Conditionnement',
            render: (item: MedicineForm) => (
                <span>
                    {`${item.medicine.name} ${item.form.name}, ${item.packaging_unit.name} de ${item.content_quantity} ${item.content_unit.abbreviation}`}
                </span>
            ),
        },
        {
            key: 'price',
            label: 'Prix',
            sortable: true,
            render: (item: MedicineForm) => (
                <span className="font-semibold">
                    {Number(item.price).toFixed(2)} FC
                </span>
            ),
        },
        {
            key: 'created_at',
            label: 'Créé le',
            sortable: true,
            render: (item: MedicineForm) => new Date(item.created_at).toLocaleDateString('fr-FR'),
        },
    ];

    const breadcrumbItems = [
        { label: "Tableau de bord", href: "/", icon: <Home className="w-5 h-5" /> },
        { label: "Conditionnements" },
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
                            icon={<Plus className="w-4 h-4"/>}
                            title="Nouveau conditionnement"
                            variant="primary"
                            size="md"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            href={route('packagings.create')}
                            // onClick={handleOpen}
                            // loading={preloading}
                        />
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <AdvancedTable<MedicineForm>
                        data={medicineForms.data}
                        columns={columns}
                        pagination={{
                            currentPage: medicineForms.current_page,
                            lastPage: medicineForms.last_page,
                            perPage: medicineForms.per_page,
                            total: medicineForms.total,
                        }}
                        routeName="packagings.index"
                        filters={filters}
                        idField="id"
                        title="Liste des conditionnements"
                        perPageOptions={[10, 25, 50, 100]}
                        showEdit={true}
                        showDelete={true}
                        actions={{
                            view: (item) => router.visit(route('packagings.show', item.id)),
                            edit: (item) => router.visit(route('packagings.edit', item.id)),
                            delete: (item) => handleDeleteClick(item),
                        }}
                        bulkActions={{
                            delete: handleMassDelete,
                        }}
                        emptyState={
                            <div className="text-center py-12">
                                <div className="text-gray-500 mb-4">Aucun conditionnement enregistré</div>
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
                message="Êtes-vous sûr de vouloir supprimer ce conditionnement ? Cette action est irréversible."
            />

            {/* Vous devrez aussi créer un composant CreatePackagingModal similaire à CreateMedicinePage */}
            {/* <CreatePackagingModal open={showModal} onClose={() => setShowModal(false)} /> */}
        </Authenticated>
    );
}

