import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import AppModal from '@/Components/modal/AppModal';
import AppButton from '@/Components/buttons/AppButton';
import { TextField } from '@/Components/Forms/TextField';

type CreateMedicineProps = {
  open: boolean;
  onClose: () => void;
};

const CreateMedicinePage: React.FC<CreateMedicineProps> = ({ open, onClose }) =>{
     const { data, setData, post, processing, reset, errors } = useForm({
                name: "",
                description: "",
            });
        useEffect(() => {
            if (open) {
            reset();
            }
        }, [open]);
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();

            post(route("medicines.store"), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        };
    return (
            <AppModal open={open} onClose={onClose} title="Ajouter un Medicament" loading={processing}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <TextField
                            label="Nom"
                            type="text"
                            name="name"
                            placeholder="Ex.  Paracetamol 500mg"
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
                            title="Ajouter"
                            type="submit" variant="primary" size="md" disabled={processing}
                            className = " bg-green-600 hover:bg-green-700 text-white"
                        />
                    </div>
                </form>
            </AppModal>

    );
}

export default CreateMedicinePage;
