
import CustomBreadcrumb from "@/Components/Utils/CustomBreadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Home, Plus, Save, Trash } from "lucide-react";
import React, { useState } from "react";
import AppButton from "@/Components/buttons/AppButton";
import CreateFormPage from "./CreateFormPage";
import { PageProps, PaginatedData, Sort } from '@/types';
import AdvancedTable from "@/Components/Utils/AdvancedTable";

interface Form {
  id: number;
  nom: string;
  created_at: string;
  updated_at: string;
}
interface FormProps extends PageProps {
  forms: PaginatedData<Form>;
  filters: {
    search?: string;
    sort?: Sort;
    perPage?: number;
  };
}
export default function FormPage({auth,forms, filters }: FormProps) {
        console.log(forms);
        console.log(filters);
        const [showModal, setShowModal] = useState(false);
        const [preloading, setPreloading] = useState(false);

        const handleOpen = () => {
            setPreloading(true);
            setTimeout(() => {
            setPreloading(false);
            setShowModal(true);
            }, 1000);
        };
        const breadcrumbItems = [
            { label: "Accueil", href: "/", icon: <Home className="w-5 h-5" /> },
            { label: "Formes" },
        ];
        const columns = [
            {
                key: 'id',
                label: 'ID',
                sortable: true,
                width: 80,
                className: 'text-center',
            },
            {
                key: 'name',
                label: 'Nom',
                sortable: true,
                filterable: true,

            },
            {
                key: 'created_at',
                label: 'Date création',
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
                        title="Liste des formes"
                        perPageOptions={[10, 25, 50, 100]}
                        // createRoute="forms.create"
                        // createLabel="Ajouter une forme"
                        onRowClick={(item) => router.visit(route('forms.show', item.id))}


                    />

                </div>

            </div>

            <CreateFormPage open={showModal} onClose={() => setShowModal(false)} />
        </Authenticated>
    );

}
