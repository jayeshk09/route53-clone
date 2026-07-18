import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  itemName,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            Delete
          </Button>
        </>
      }
    >
      <div className="text-center py-2">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <p className="text-gray-800">
          Are you sure you want to delete <span className="font-bold">"{itemName}"</span>?
        </p>
        <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
      </div>
    </Modal>
  );
}