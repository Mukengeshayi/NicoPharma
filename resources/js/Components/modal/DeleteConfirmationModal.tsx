// DeleteConfirmationModal.tsx
import React from "react";
import AppButton from "@/Components/buttons/AppButton";
import { Trash2, X } from "lucide-react";
import AppModal from "./AppModal";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmer la suppression",
  message = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
  loading = false,
}) => {
  return (
    <AppModal open={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-700">{message}</p>

        <div className="flex justify-end gap-3 pt-4">
          <AppButton
            title="Annuler"
            variant="secondary"
            onClick={onClose}
            type="button"
            icon={<X className="w-4 h-4" />}
          />
          <AppButton
            title="Confirmer"
            onClick={onConfirm}
            icon={<Trash2 className="w-4 h-4" />}
            loading={loading}
            variant="danger"
          />
        </div>
      </div>
    </AppModal>
  );
};

export default DeleteConfirmationModal;
