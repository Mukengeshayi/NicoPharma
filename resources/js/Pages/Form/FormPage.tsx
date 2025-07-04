
import CustomBreadcrumb from "@/Components/Utils/CustomBreadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Eye, FileUp, Home, Plus, Save, Trash, Trash2 } from "lucide-react";
import React, { useState } from "react";
import AppButton from "@/Components/buttons/AppButton";
import CreateFormPage from "./CreateFormPage";
import { PageProps, PaginatedData, Sort } from '@/types';
import AdvancedTable from "@/Components/Utils/AdvancedTable";
import UpdateFormPage from "./UpdateFormPage";
import DeleteConfirmationModal from "@/Components/modal/DeleteConfirmationModal";

interface Form {
  id: number;
  name: string;
  created_at: string;
}
interface FormProps extends PageProps {
  forms: PaginatedData<Form>;
  filters: {
    search?: string;
    sort?: Sort;
    perPage?: number;
  };
}
export default function FormPage({forms, filters }: FormProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Form | null>(null);
    const [preloading, setPreloading] = useState(false);

    const handleDeleteClick = (item: Form) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        setDeleteLoading(true);
        router.delete(route('forms.destroy', itemToDelete.id), {
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
            setShowCreateModal(true);
            }, 1000);
        };
        const breadcrumbItems = [
            { label: "Accueil", href: "/", icon: <Home className="w-5 h-5" /> },
            { label: "Formes" },
        ];
        const columns = [

            {
                key: 'name',
                label: 'Nom',
                sortable: true,
                filterable: true,

            },
            {
                key: 'created_at',
                label: 'Date de création',
                sortable: true,
                render: (item: Form) => new Date(item.created_at).toLocaleDateString('fr-FR'),
                headerClassName: 'whitespace-nowrap',
            },

        ];
    return (
        <Authenticated
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Forms</h2>
                </div>
            }
        >
            <Head title="Formes" />
            <div className="mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                    <div>
                        <CustomBreadcrumb items={breadcrumbItems} />
                    </div>
                    <div className="">
                        <AppButton
                            icon={<Plus  className="w-4 h-4"/>}
                            title="Nouveau"
                            variant="primary"
                            size="md"
                            className = " bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleOpen}
                            loading={preloading}
                        />
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <AdvancedTable<Form>
                        data={forms.data}
                        columns={columns}
                        pagination={{
                            currentPage: forms.current_page,
                            lastPage: forms.last_page,
                            perPage: forms.per_page,
                            total: forms.total,
                        }}
                        routeName="forms.index"
                        filters={filters}
                        idField="id"
                        title="Formes des medicaments"
                        perPageOptions={[10, 25, 50, 100]}
                        onRowClick={(item) => router.visit(route('forms.show', item.id))}
                        showEdit={true}
                        showDelete={true}
                        actions={{
                            edit: (item) => {
                                setSelectedForm(item);
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
            <CreateFormPage open={showCreateModal} onClose={() => setShowCreateModal(false)} />
            {selectedForm && (
                <UpdateFormPage
                    open={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    form={selectedForm}
                />
            )}
            <DeleteConfirmationModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                message="Êtes-vous sûr de vouloir supprimer cette forme ? Cette action est irréversible."
            />
        </Authenticated>
    );

}
