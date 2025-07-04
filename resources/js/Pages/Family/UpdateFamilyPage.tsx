import React from "react";
import { useForm } from "@inertiajs/react";
import { Plus, Save } from "lucide-react";
import AppModal from "@/Components/modal/AppModal";
import AppButton from "@/Components/buttons/AppButton";

interface Family {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

interface UpdateFamilyPageProps {
  open: boolean;
  onClose: () => void;
  family: Family;
}

const UpdateFamilyPage: React.FC<UpdateFamilyPageProps> = ({ open, onClose, family }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: family.name,
    description: family.description || "",
  });
  const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          put(route("families.update",family.id), {
          onSuccess: () => {
              onClose();
          },
          });
 };
  return (
    <AppModal open={open} onClose={onClose} title="Modifier la forme du medicament">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
            </label>
            <textarea
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-4">
            <AppButton
                title="Annuler"
                type="button"
                variant="secondary"
                size="md"
                onClick={onClose}
            />
            <AppButton
                type="submit"
                icon={<Save className="w-4 h-4" />}
                title="Enregistrer"
                variant="secondary"
                size="md"
                loading={processing}
                className = " bg-green-600 hover:bg-green-700 text-white"
                disabled={processing}
            />
        </div>
      </form>
    </AppModal>
  );
};

export default UpdateFamilyPage;
