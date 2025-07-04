// import AppButton from '@/Components/boutons/AppButton';
// import AppModal from '@/Components/modals/AppModal';
// import { Input } from '@/Components/ui/input';
// import { Textarea } from '@/Components/ui/textarea';
import AppButton from '@/Components/buttons/AppButton';
import { TextAreaField } from '@/Components/Forms/TextAreaField';
import { TextField } from '@/Components/Forms/TextField';
import AppModal from '@/Components/modal/AppModal';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

type CreateFamilyProps = {
  open: boolean;
  onClose: () => void;
};

const CreateFamilyPage: React.FC<CreateFamilyProps> = ({ open, onClose }) =>{
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

        post(route("families.store"), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };
    return (
        <AppModal open={open} onClose={onClose} title="Ajouter une famille de Medicament" loading={processing}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <TextField
                        label="Nom *"
                        type="text"
                        name="name"
                        placeholder="Ex. Analgesiques, Antibiotiques, Antiviraux"
                        className="focus:ring-green-600 text-sm md:text-base"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        error={errors['name']}
                    />
                </div>
                <div>
                    <TextAreaField
                        label="Description "
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        placeholder="Décrivez brièvement cette famille de médicament"
                        error={errors['description']}

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

export default CreateFamilyPage;
