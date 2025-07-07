import React from 'react';
import { Dialog } from '@headlessui/react';
import AppButton from '@/Components/buttons/AppButton';
import { useForm } from '@inertiajs/react';
import AppModal from '@/Components/modal/AppModal';

interface CreateUnitPageProps {
    unitTypes: string[];
    open: boolean;
    onClose: () => void;
}

export default function CreateUnitPage({ unitTypes, open, onClose }: CreateUnitPageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        abbreviation: '',
        type: 'measure',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('units.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <AppModal open={open} onClose={onClose} title="Ajouter un Medicament" loading={processing}>
             <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nom *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="abbreviation" className="block text-sm font-medium text-gray-700">
                                    Abréviation
                                </label>
                                <input
                                    id="abbreviation"
                                    type="text"
                                    value={data.abbreviation}
                                    onChange={(e) => setData('abbreviation', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    maxLength={10}
                                />
                                {errors.abbreviation && <p className="mt-1 text-sm text-red-600">{errors.abbreviation}</p>}
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Type *
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    {unitTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <AppButton
                                title='Annuler'
                                type="button"
                                variant="secondary"
                                onClick={onClose}
                                disabled={processing}
                            />
                            <AppButton
                                title='Enregistrer'
                                type="submit"
                                variant="primary"
                                loading={processing}
                                className="bg-green-600 hover:bg-green-700"
                            />
                        </div>
                    </form>


        </AppModal>
    );
}
