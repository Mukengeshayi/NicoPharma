import AppButton from '@/Components/buttons/AppButton';
import CustomBreadcrumb from '@/Components/Utils/CustomBreadcrumb';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Home, Plus } from 'lucide-react';
import React, { useState } from 'react';
import CreateMedicinePage from './CreateMedicinePage';
// import CreateMedicinePage from './CreateMedicinePage';
import { ColumnDef } from '@tanstack/react-table';

type Family = {
  id: number;
  name: string;
  type: string;
  created_at: string;
};

const columns: ColumnDef<Family>[] = [
  {
    accessorKey: 'name',
    header: 'Nom',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'created_at',
    header: 'Créé le',
    cell: info => new Date(info.getValue() as string).toLocaleDateString(),
  },
];

const fakeData: Family[] = [
  { id: 1, name: 'Antibiotiques', type: 'Médicament', created_at: '2023-01-01' },
  { id: 2, name: 'Antalgiques', type: 'Médicament', created_at: '2023-02-10' },
  { id: 3, name: 'Vitamines', type: 'Complément', created_at: '2023-03-15' },
];








const MedicinePage = () => {
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
        { label: "Tableau de bord", href: "/", icon: <Home className="w-5 h-5" /> },
        { label: "Medicaments" },
    ];
    return (
        <Authenticated>
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
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


                {/* Content for MedicinePage goes here */}
            </div>
            <CreateMedicinePage open={showModal} onClose={() => setShowModal(false)} />
        </Authenticated>
    );
}

export default MedicinePage;
