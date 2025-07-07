import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';
import AppModal from '@/Components/modal/AppModal';
import AppButton from '@/Components/buttons/AppButton';
import { TextField } from '@/Components/Forms/TextField';
import { TextAreaField } from '@/Components/Forms/TextAreaField';
import { Plus } from 'lucide-react';
import { SelectField } from '@/Components/Forms/SelectField';



type CreateMedicineProps = {
  open: boolean;
  onClose: () => void;
  families: { id: number; name: string }[];

};

const CreateMedicinePage: React.FC<CreateMedicineProps> = ({ open, onClose, families }) =>{
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        family_id: "",
        indications: "",
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
                    <div className="">
                        <SelectField
                            label="Famille"
                            name="family_id"
                            value={data.family_id}
                            onChange={(e) => setData("family_id", e.target.value)}
                            options={families.map(f => ({ value: f.id, label: f.name }))}
                            error={errors.family_id}
                            withSearch={families.length > 10} // Active la recherche si + de 10 familles
                            placeholder="Sélectionnez une famille"
                        />

                    </div>
                    <div>
                        <TextAreaField
                            label="Indications"
                            name="indications"
                            placeholder="Ex. Pour le traitement de la douleur et de la fièvre"
                            className="focus:ring-green-600 text-sm md:text-base"
                            value={data.indications}
                            onChange={(e) => setData("indications", e.target.value)}
                            error={errors['indications']}

                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <AppButton
                            title="Annuler"
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={onClose}
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

export default CreateMedicinePage;
