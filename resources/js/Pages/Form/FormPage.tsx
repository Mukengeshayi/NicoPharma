// import AppModal from "@/Components/modals/AppModal";
// import DataTable from "@/Components/tables/DataTable";
import CustomBreadcrumb from "@/Components/Utils/CustomBreadcrumb";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";
import { Home, Plus, Save, Trash } from "lucide-react";
import React, { useState } from "react";
import AppButton from "@/Components/buttons/AppButton";
import CreateFormPage from "./CreateFormPage";

const FormPage = () => {
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

    return (
        <Authenticated>
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
            </div>
            <CreateFormPage open={showModal} onClose={() => setShowModal(false)} />
        </Authenticated>
    );
};

export default FormPage;
