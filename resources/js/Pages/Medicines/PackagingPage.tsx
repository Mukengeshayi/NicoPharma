import React from 'react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Check, Plus, X, Trash2, Loader2, Pill } from 'lucide-react';
import { SelectField } from '@/Components/Forms/SelectField';
import CustomBreadcrumb from '@/Components/Utils/CustomBreadcrumb';

interface Form {
  id: number;
  name: string;
}

interface Unit {
  id: number;
  name: string;
  abbreviation: string;
}

export default function PackagingPage() {
    const { medicine, forms, packagingUnits, contentUnits } = usePage<{
        medicine: any;
        forms: Form[];
        packagingUnits: Unit[];
        contentUnits: Unit[];
    }>().props;

    const { data, setData, post, processing } = useForm<{
        forms: Array<{
            form_id: number | '';
            packaging_unit_id: number | '';
            content_unit_id: number | '';
            content_quantity: number | '';
            price: number | '';
        }>;
    }>({
        forms: [{
            form_id: '',
            packaging_unit_id: '',
            content_unit_id: '',
            content_quantity: '',
            price: ''
        }]
    });

    const formOptions = forms.map(f => ({
        value: f.id,
        label: f.name
    }));

    const packagingOptions = packagingUnits.map(u => ({
        value: u.id,
        label: `${u.name} (${u.abbreviation})`
    }));

    const contentOptions = contentUnits.map(u => ({
        value: u.id,
        label: `${u.name} (${u.abbreviation})`
    }));

    const addForm = () => {
        setData('forms', [
            ...data.forms,
            {
                form_id: '',
                packaging_unit_id: '',
                content_unit_id: '',
                content_quantity: '',
                price: ''
            }
        ]);
    };

    const removeForm = (index: number) => {
        if (data.forms.length > 1) {
            const updated = [...data.forms];
            updated.splice(index, 1);
            setData('forms', updated);
        }
    };

    const updateForm = (index: number, field: string, value: any) => {
        const updated = [...data.forms];
        updated[index] = { ...updated[index], [field]: value };
        setData('forms', updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('medicines.packaging.store-bulk', medicine.id));
    };
    const breadcrumbItems = [
        { label: "Medicaments", href: "/medicines", icon: <Pill className="w-5 h-5" /> },
        { label: "Ajout conditionnement" },
    ];

    return (
        <Authenticated>
            <Head title={`Ajouter des conditionnements - ${medicine.name}`} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
                <div>
                        <CustomBreadcrumb items={breadcrumbItems} />
                    </div>
                <div className="flex items-center justify-center mb-6">
                    <div>
                        {/* <h1 className="text-2xl font-bold text-gray-900">Ajout de conditionnements</h1> */}
                        <p className="text-md text-gray-700 ">
                            <span className="font-medium">{medicine.name}</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <form onSubmit={submit}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forme</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emballage</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix de vente (FC)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.forms.map((form, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <SelectField
                                                    name="form_id"
                                                    value={form.form_id}
                                                    options={formOptions}
                                                    onChange={(e) => updateForm(index, 'form_id', Number(e.target.value) || '')}
                                                    className="w-full"
                                                    // menuPlacement="auto"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <SelectField
                                                    name="packaging_unit_id"
                                                    value={form.packaging_unit_id}
                                                    options={packagingOptions}
                                                    onChange={(e) => updateForm(index, 'packaging_unit_id', Number(e.target.value) || '')}
                                                    className="w-full"
                                                    withSearch={packagingUnits.length > 10}
                                                    // menuPlacement="auto"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <SelectField
                                                    name="content_unit_id"
                                                    value={form.content_unit_id}
                                                    options={contentOptions}
                                                    onChange={(e) => updateForm(index, 'content_unit_id', Number(e.target.value) || '')}
                                                    className="w-full"

                                                    // menuPlacement="auto"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={form.content_quantity}
                                                    onChange={(e) => updateForm(index, 'content_quantity', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 text-sm"
                                                    required
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={form.price}
                                                    onChange={(e) => updateForm(index, 'price', e.target.value)}
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600 text-sm"
                                                    required
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    type="button"
                                                    onClick={() => removeForm(index)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={addForm}
                                className="inline-flex items-center px-3 py-1.5 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Ajouter un conditionnement
                            </button>

                            <button
                                disabled={processing}
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"

                            >
                                {processing ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="mr-2 h-4 w-4" />
                                )}
                                {processing ? 'Enregistrement...' : `Valider (${data.forms.length})`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Authenticated>
    );
}
