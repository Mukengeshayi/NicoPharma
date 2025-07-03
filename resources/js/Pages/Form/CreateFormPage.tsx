import AppButton from '@/Components/buttons/AppButton';
import { TextField } from '@/Components/Forms/TextField';
import AppModal from '@/Components/modal/AppModal';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import React, { useEffect } from 'react';

type CreateFormProps = {
  open: boolean;
  onClose: () => void;
};

const CreateFormPage: React.FC<CreateFormProps> = ({ open, onClose }) =>{
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
    });
    useEffect(() => {
        if (open) {
        reset();
        }
    }, [open]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("forms.store"), {
        onSuccess: () => {
            reset();
            onClose();
        },
        });
    };
    return (
        <AppModal open={open} onClose={onClose} title="Ajouter une forme de Medicament" loading={processing}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <TextField
                        label="Nom"
                        type="text"
                        name="name"
                        placeholder="Ex. Comprimé, Gélule, Sirop"
                        className="focus:ring-green-600 text-sm md:text-base"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors['name']}
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <AppButton type="button" title="Annuler" variant="secondary" size="md"
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                    />
                    <AppButton
                        icon={<Plus className="w-4 h-4" />}
                        title="Ajouter"
                        type="submit" variant="primary" size="sm" disabled={processing}
                        className = " bg-green-600 hover:bg-green-700 text-white"
                    />
                </div>
            </form>
        </AppModal>
    );
}
export default CreateFormPage;
