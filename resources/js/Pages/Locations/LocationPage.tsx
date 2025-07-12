import CustomBreadcrumb from "@/Components/Utils/CustomBreadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Home, Plus } from "lucide-react";
import React, { useState } from "react";
import AppButton from "@/Components/buttons/AppButton";
// import CreateLocationPage from "./CreateLocationPage";
import { PageProps, PaginatedData, Sort } from '@/types';
import AdvancedTable from "@/Components/Utils/AdvancedTable";
// import UpdateLocationPage from "./UpdateLocationPage";
import DeleteConfirmationModal from "@/Components/modal/DeleteConfirmationModal";
import CreateLocationPage from "./CreateLocationPage";
import UpdateLocationPage from "./UpdateLocationPage";
// import { Badge } from "@/Components/ui/badge";

interface Location {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

interface LocationProps extends PageProps {
  locations: PaginatedData<Location>;
  filters: {
    search?: string;
    sort?: Sort;
    perPage?: number;
    is_active?: boolean;
  };
}

export default function LocationPage({ locations, filters }: LocationProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<Location | null>(null);
    const [preloading, setPreloading] = useState(false);

    const handleDeleteClick = (item: Location) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (!itemToDelete) return;

        setDeleteLoading(true);
        router.delete(route('locations.destroy', itemToDelete.id), {
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
        { label: "Locations" },
    ];

    const columns = [
        {
            key: 'name',
            label: 'Nom',
            sortable: true,
            filterable: true,
        },
        {
            key: 'code',
            label: 'Code',
            sortable: true,
        },
        {
            key: 'is_active',
            label: 'Statut',
            sortable: true,
            render: (item: Location) => (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {item.is_active ? 'Actif' : 'Inactif'}
                </span>
            ),
        },
        {
            key: 'created_at',
            label: 'Date de création',
            sortable: true,
            render: (item: Location) => new Date(item.created_at).toLocaleDateString('fr-FR'),
            headerClassName: 'whitespace-nowrap',
        },
    ];

    return (
        <Authenticated
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion des Locations</h2>
                </div>
            }
        >
            <Head title="Locations" />
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
                    <AdvancedTable<Location>
                        data={locations.data}
                        columns={columns}
                        pagination={{
                            currentPage: locations.current_page,
                            lastPage: locations.last_page,
                            perPage: locations.per_page,
                            total: locations.total,
                        }}
                        routeName="locations.index"
                        filters={filters}
                        idField="id"
                        title="Locations"
                        perPageOptions={[10, 25, 50, 100]}
                        onRowClick={(item) => router.visit(route('locations.show', item.id))}
                        showEdit={true}
                        showDelete={true}
                        actions={{
                            edit: (item) => {
                                setSelectedLocation(item);
                                setShowUpdateModal(true);
                            },
                            delete: (item) => handleDeleteClick(item),
                        }}
                        emptyState={
                            <div className="text-center py-2">
                                <div className="text-gray-500 mb-4">Aucune location trouvée</div>
                            </div>
                        }
                    />
                </div>
            </div>

            <CreateLocationPage open={showCreateModal} onClose={() => setShowCreateModal(false)} />

            {selectedLocation && (
                <UpdateLocationPage
                    key={selectedLocation.id} // Ajoutez cette ligne
                    open={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    location={selectedLocation}
                />
            )}

            <DeleteConfirmationModal
                open={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                message="Êtes-vous sûr de vouloir supprimer cette location ? Cette action est irréversible."
            />
        </Authenticated>
    );
}
