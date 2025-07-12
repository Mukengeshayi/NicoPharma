import React from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, Edit, Trash2, Eye, Package } from "lucide-react";
import AppButton from "@/Components/buttons/AppButton";
import DeleteConfirmationModal from "@/Components/modal/DeleteConfirmationModal";

// interface Batch {
//   id: number;
//   batch_number: string;
//   expiry_date: string;
//   quantity: number;
//   drug: {
//     id: number;
//     name: string;
//   };
// }

interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  tax_number: string | null;
//   batches: Batch[];
  created_at: string;
  updated_at: string;
}

interface ShowSupplierPageProps {
  supplier: Supplier;
}

const ShowSupplierPage: React.FC<ShowSupplierPageProps> = ({ supplier }) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const handleDelete = () => {
    setDeleteLoading(true);
    router.delete(route("suppliers.destroy", supplier.id), {
      onFinish: () => {
        setDeleteLoading(false);
        setShowDeleteModal(false);
      },
    });
  };

  return (
    <Authenticated
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Détails du Fournisseur
          </h2>
        </div>
      }
    >
      <Head title={`Fournisseur - ${supplier.name}`} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href={route("suppliers.index")}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour à la liste
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Supplier info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Supplier card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Informations du Fournisseur
                  </h3>
                  {/* <div className="flex space-x-2">
                    <Link href={route("suppliers.edit", supplier.id)}>
                      <AppButton
                        icon={<Edit className="w-4 h-4" />}
                        // variant="outline"
                        size="sm"
                        className="bg-green-500 text-white hover:bg-green-400"
                      />
                    </Link>
                    <AppButton
                      icon={<Trash2 className="w-4 h-4" />}
                    //   variant="destructive"
                      size="sm"
                      onClick={() => setShowDeleteModal(true)}
                    />
                  </div> */}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium">{supplier.name}</h4>
                    {supplier.tax_number && (
                      <p className="text-sm text-gray-500">
                        N° TVA: {supplier.tax_number}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {supplier.contact_person && (
                      <p>
                        <span className="font-medium">Contact:</span>{" "}
                        {supplier.contact_person}
                      </p>
                    )}
                    {supplier.phone && (
                      <p>
                        <span className="font-medium">Téléphone:</span>{" "}
                        {supplier.phone}
                      </p>
                    )}
                    {supplier.email && (
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        <a
                          href={`mailto:${supplier.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {supplier.email}
                        </a>
                      </p>
                    )}
                  </div>

                  {supplier.address && (
                    <div>
                      <h4 className="font-medium mb-1">Adresse</h4>
                      <p className="text-sm whitespace-pre-line">
                        {supplier.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats card */}
              {/* <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Statistiques
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">
                      {supplier.batches.length}
                    </p>
                    <p className="text-sm text-gray-500">Lots fournis</p>
                  </div>
                  <div className="border rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">
                      {new Date(supplier.created_at).toLocaleDateString("fr-FR")}
                    </p>
                    <p className="text-sm text-gray-500">Date d'ajout</p>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Right column - Batches list */}
            {/* <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Lots fournis
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {supplier.batches.length} lot(s)
                    </span>
                  </div>
                </div>

                {supplier.batches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            N° de lot
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Médicament
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Quantité
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date d'expiration
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {supplier.batches.map((batch) => (
                          <tr key={batch.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {batch.batch_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <Link
                                href={route("drugs.show", batch.drug.id)}
                                className="text-blue-600 hover:underline"
                              >
                                {batch.drug.name}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {batch.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(batch.expiry_date).toLocaleDateString("fr-FR")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={route("batches.show", batch.id)}
                                className="inline-flex items-center text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Voir
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Aucun lot trouvé
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ce fournisseur n'a pas encore fourni de lots.
                    </p>
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Supprimer le fournisseur"
        message="Êtes-vous sûr de vouloir supprimer ce fournisseur ? Tous les lots associés seront conservés mais ne seront plus liés à ce fournisseur."
      />
    </Authenticated>
  );
};

export default ShowSupplierPage;
