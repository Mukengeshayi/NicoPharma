import CustomBreadcrumb from "@/Components/Utils/CustomBreadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Eye, FileUp, Home, Plus, Save, Trash, Trash2 } from "lucide-react";
import React, { useState } from "react";
import AppButton from "@/Components/buttons/AppButton";
import { PageProps, PaginatedData, Sort } from '@/types';
import AdvancedTable from "@/Components/Utils/AdvancedTable";
import DeleteConfirmationModal from "@/Components/modal/DeleteConfirmationModal";
import CreateSupplierPage from "./CreateSupplierPage";
import UpdateSupplierPage from "./UpdateSupplierPage";

interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  tax_number: string | null;
  created_at: string;
}

interface SupplierProps extends PageProps {
  suppliers: PaginatedData<Supplier>;
  filters: {
    search?: string;
    sort?: Sort;
    perPage?: number;
  };
}

export default function SupplierPage({ suppliers, filters }: SupplierProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Supplier | null>(null);
    const [preloading, setPreloading] = useState(false);

    const handleDeleteClick = (item: Supplier) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        setDeleteLoading(true);
        router.delete(route('suppliers.destroy', itemToDelete.id), {
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
        { label: "Fournisseurs" },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Nom',
            sortable: true,
            filterable: true,
        },
        {
            key: 'contact_person',
            label: 'Contact',
            sortable: true,
        },
        {
            key: 'phone',
            label: 'Téléphone',
            sortable: false,
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
        },
        {
            key: 'created_at',
            label: 'Date de création',
            sortable: true,
            render: (item: Supplier) => new Date(item.created_at).toLocaleDateString('fr-FR'),
            headerClassName: 'whitespace-nowrap',
        },
    ];

    return (
        <Authenticated
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Fournisseurs</h2>
                </div>
            }
        >
            <Head title="Fournisseurs" />
            <div className="mx-auto px-3 sm:px-6 lg:px-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                    <div>
                        <CustomBreadcrumb items={breadcrumbItems} />
                    </div>
                    <div className="">
                        <AppButton
                            icon={<Plus className="w-4 h-4"/>}
                            title="Nouveau"
                            variant="primary"
                            size="md"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleOpen}
                            loading={preloading}
                        />
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <AdvancedTable<Supplier>
                        data={suppliers.data}
                        columns={columns}
                        pagination={{
                            currentPage: suppliers.current_page,
                            lastPage: suppliers.last_page,
                            perPage: suppliers.per_page,
                            total: suppliers.total,
                        }}
                        routeName="suppliers.index"
                        filters={filters}
                        idField="id"
                        title="Fournisseurs"
                        perPageOptions={[10, 25, 50, 100]}
                        // onRowClick={(item) => router.visit(route('suppliers.show', item.id))}
                        showEdit={true}
                        showDelete={true}
                        actions={{
                            view: (item) => router.visit(route('suppliers.show', item.id)),
                            edit: (item) => {
                                setSelectedSupplier(item);
                                setShowUpdateModal(true);
                            },
                            delete: (item) => handleDeleteClick(item),
                        }}
                        emptyState={
                            <div className="text-center py-2">
                                <div className="text-gray-500 mb-4">Aucun fournisseur trouvé</div>
                            </div>
                        }
                    />
                </div>
            </div>

            {/* You'll need to create these components similar to your Form pages */}
            <CreateSupplierPage open={showCreateModal} onClose={() => setShowCreateModal(false)} />

            {selectedSupplier && (
                <UpdateSupplierPage
                    open={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    supplier={selectedSupplier}
                />
            )}

            <DeleteConfirmationModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                message="Êtes-vous sûr de vouloir supprimer ce fournisseur ? Cette action est irréversible."
            />
        </Authenticated>
    );
}
