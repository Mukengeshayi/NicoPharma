import { useForm } from "@inertiajs/react";
import AppButton from "@/Components/buttons/AppButton";
import AppModal from "@/Components/modal/AppModal";
import { Save } from "lucide-react";

interface Location {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
}

interface UpdateLocationPageProps {
    open: boolean;
    onClose: () => void;
    location: Location;
}

export default function UpdateLocationPage({ open, onClose, location }: UpdateLocationPageProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: location.name,
        code: location.code,
        description: location.description || "",
        is_active: location.is_active,
    });
    console.log("UpdateLocationPage data:", data);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("locations.update", location.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <AppModal open={open} onClose={onClose} title="Modifier un Emplacement" loading={processing} >
            <div className="p-4">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Code</label>
                            <input
                                type="text"
                                value={data.code}
                                onChange={(e) => setData("code", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                required
                            />
                            {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData("is_active", e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                Actif
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                         <AppButton
                            type="button"
                            title="Annuler"
                            variant="secondary"
                            size="md"
                            onClick={onClose}
                            disabled={processing}
                        />
                        <AppButton
                            icon={<Save className="w-4 h-4" />}
                            title="Enregistrer"
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={processing}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        />
                    </div>
                </form>
            </div>
        </AppModal>
    );
}
