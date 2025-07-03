import CustomBreadcrumb from '@/Components/Utils/CustomBreadcrumb';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Home } from 'lucide-react';
import React from 'react';

const ShowFormPage = () => {

     const breadcrumbItems = [
            { label: "Accueil", href: "/", icon: <Home className="w-5 h-5" /> },
            { label: "Details Forme" },
    ];
    return (
        <Authenticated
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Details de la Forme</h2>
                </div>
            }
        >
            <Head title="Voir la forme" />
            <div className="mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4 mb-2">
                    <div>
                        <CustomBreadcrumb items={breadcrumbItems} />
                    </div>

                </div>
            </div>
        </Authenticated>

    );
}

export default ShowFormPage;

