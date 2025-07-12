import AppButton from '@/Components/buttons/AppButton';
import { TextField } from '@/Components/Forms/TextField';
import AppModal from '@/Components/modal/AppModal';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React, { useEffect } from 'react';

type CreateSupplierProps = {
  open: boolean;
  onClose: () => void;
};

const CreateSupplierPage: React.FC<CreateSupplierProps> = ({ open, onClose }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        tax_number: "",
    });

    useEffect(() => {
        if (open) {
            reset();
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("suppliers.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <AppModal
            open={open}
            onClose={onClose}
            title="Ajouter un nouveau fournisseur"
            loading={processing}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Nom du fournisseur"
                        type="text"
                        name="name"
                        placeholder="Ex. PharmaPlus"
                        className="focus:ring-green-600 text-sm md:text-base"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors.name}
                    />

                    <TextField
                        label="Personne de contact"
                        type="text"
                        name="contact_person"
                        placeholder="Ex. Jean Dupont"
                        className="focus:ring-green-600 text-sm md:text-base"
                        value={data.contact_person}
                        onChange={(e) => setData("contact_person", e.target.value)}
                        error={errors.contact_person}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Téléphone"
                        name="phone"
                        placeholder="Ex. +33 6 12 34 56 78"
                        className="focus:ring-green-600 text-sm md:text-base"
                        value={data.phone}
                        onChange={(e) => setData("phone", e.target.value)}
                        error={errors.phone}
                    />

                    <TextField
                        label="Email"
                        name="email"
                        placeholder="Ex. contact@pharmaplus.com"
                        className="focus:ring-green-600 text-sm md:text-base"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        error={errors.email}
                    />
                </div>

                {/* <TextField
                    label="Adresse"
                    type="text"
                    name="address"
                    placeholder="Ex. 123 Rue de la Pharmacie, Paris"
                    className="focus:ring-green-600 text-sm md:text-base"
                    value={data.address}
                    onChange={(e) => setData("address", e.target.value)}
                    error={errors.address}
                    multiline
                    rows={3}
                /> */}

                <TextField
                    label="Numéro de TVA"
                    type="text"
                    name="tax_number"
                    placeholder="Ex. FR12345678901"
                    className="focus:ring-green-600 text-sm md:text-base"
                    value={data.tax_number}
                    onChange={(e) => setData("tax_number", e.target.value)}
                    error={errors.tax_number}
                />

                <div className="flex justify-end space-x-2 pt-4">
                    <AppButton
                        type="button"
                        title="Annuler"
                        variant="secondary"
                        size="md"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                    />
                    <AppButton
                        icon={<Plus className="w-4 h-4" />}
                        title="Ajouter"
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={processing}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    />
                </div>
            </form>
        </AppModal>
    );
};

export default CreateSupplierPage;
