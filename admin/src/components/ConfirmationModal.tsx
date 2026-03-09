import React from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: (id: string) => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100">

        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="text-warning" size={22} />
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-base-content/70 mb-6">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={onCancel}
            className="btn btn-ghost"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="btn btn-primary"
          >
            Confirm
          </button>
        </div>

      </div>

      {/* Overlay close */}
      <div className="modal-backdrop" onClick={onCancel}></div>
    </div>
  );
};

export default ConfirmationModal;