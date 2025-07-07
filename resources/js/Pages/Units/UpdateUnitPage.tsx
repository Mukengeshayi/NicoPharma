import React from "react";
import { useForm } from "@inertiajs/react";
import { Save } from "lucide-react";
import AppModal from "@/Components/modal/AppModal";
import AppButton from "@/Components/buttons/AppButton";

interface Unit {
  id: number;
  name: string;
  abbreviation: string | null;
  type: string;
  description: string | null;
  created_at: string;
}

interface UpdateUnitPageProps {
  open: boolean;
  onClose: () => void;
  unit: Unit;
  unitTypes: string[];
}

const UpdateUnitPage: React.FC<UpdateUnitPageProps> = ({ open, onClose, unit, unitTypes }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: unit.name,
    abbreviation: unit.abbreviation || '',
    type: unit.type,
    description: unit.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("units.update", unit.id), {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AppModal open={open} onClose={onClose} title="Modifier l'unité">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Abréviation
          </label>
          <input
            type="text"
            value={data.abbreviation}
            onChange={(e) => setData('abbreviation', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            maxLength={10}
          />
          {errors.abbreviation && <p className="text-red-500 text-sm mt-1">{errors.abbreviation}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            value={data.type}
            onChange={(e) => setData('type', e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          >
            {unitTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
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
            variant="primary"
            size="md"
            loading={processing}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={processing}
          />
        </div>
      </form>
    </AppModal>
  );
};

export default UpdateUnitPage;
