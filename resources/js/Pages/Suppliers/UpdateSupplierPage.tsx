import React from "react";
import { useForm } from "@inertiajs/react";
import { Save } from "lucide-react";
import AppModal from "@/Components/modal/AppModal";
import AppButton from "@/Components/buttons/AppButton";
import { TextField } from "@/Components/Forms/TextField";

interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  tax_number: string | null;
  created_at: string;
}

interface UpdateSupplierPageProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier;
}

const UpdateSupplierPage: React.FC<UpdateSupplierPageProps> = ({ open, onClose, supplier }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: supplier.name,
    contact_person: supplier.contact_person || "",
    phone: supplier.phone || "",
    email: supplier.email || "",
    address: supplier.address || "",
    tax_number: supplier.tax_number || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("suppliers.update", supplier.id), {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title="Modifier le fournisseur"
    //   size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Nom du fournisseur"
            type="text"
            name="name"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            error={errors.name}
            // required
          />

          <TextField
            label="Personne de contact"
            type="text"
            name="contact_person"
            value={data.contact_person}
            onChange={(e) => setData('contact_person', e.target.value)}
            error={errors.contact_person}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Téléphone"
            // type="tel"
            name="phone"
            value={data.phone}
            onChange={(e) => setData('phone', e.target.value)}
            error={errors.phone}
          />

          <TextField
            label="Email"
            // type="email"
            name="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={errors.email}
          />
        </div>

        <TextField
          label="Adresse"
          type="text"
          name="address"
          value={data.address}
          onChange={(e) => setData('address', e.target.value)}
          error={errors.address}
        //   multiline
        //   rows={3}
        />

        <TextField
          label="Numéro de TVA"
          type="text"
          name="tax_number"
          value={data.tax_number}
          onChange={(e) => setData('tax_number', e.target.value)}
          error={errors.tax_number}
        />

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

export default UpdateSupplierPage;
