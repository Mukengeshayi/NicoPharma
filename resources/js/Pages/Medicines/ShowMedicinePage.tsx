import CustomBreadcrumb from '@/Components/Utils/CustomBreadcrumb';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Pill, Plus, Package } from 'lucide-react';
import React from 'react';

const ShowMedicinePage = ({ medicine }: { medicine: any }) => {
    const breadcrumbItems = [
        { label: "Médicaments", href: "/medicines", icon: <Pill className="w-5 h-5" /> },
        { label: medicine.name },
    ];

    // Fonction pour formater le conditionnement
    const formatPackaging = (config: any) => {
        return `${config.form.name} - ${config.packaging_unit.name} de ${config.content_quantity} ${config.content_unit.abbreviation}`;
    };

    return (
        <Authenticated>
            <Head title={`Détails - ${medicine.name}`} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                <div>
                    <CustomBreadcrumb items={breadcrumbItems} />
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
                    <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {medicine.name}
                            {medicine.family && (
                                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {medicine.family.name}
                                </span>
                            )}
                        </h2>
                        <Link
                            href={route('medicines.packaging.create-bulk', medicine.id)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter des conditionnements
                        </Link>
                    </div>
                    <div className="px-6 py-4">
                        {medicine.indications && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Indications</h3>
                                <p className="text-gray-700">{medicine.indications}</p>
                            </div>
                        )}
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Conditionnements</h3>
                        {medicine.forms && medicine.forms.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conditionnement</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix (FC)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {medicine.forms.map((config: any, index: number) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Package className="flex-shrink-0 h-5 w-5 text-gray-400 mr-3" />
                                                        <span>{formatPackaging(config)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                    {Number(config.price).toLocaleString('fr-FR')} FC
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-6 text-center">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun conditionnement</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Ce médicament n'a pas encore de conditionnement enregistré.
                                </p>
                                <div className="mt-4">
                                    <Link
                                        href={route('medicines.packaging.create-bulk', medicine.id)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Ajouter un conditionnement
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

export default ShowMedicinePage;
