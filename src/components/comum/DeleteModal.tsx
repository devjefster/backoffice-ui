import React, { useState } from "react";
import { Button, Modal, Tooltip, Spinner } from "flowbite-react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";

interface DeleteModalProps {
    isOpen: boolean; // Whether the modal is open
    entityName: string | null; // Name of the entity being deleted
    onClose: () => void; // Callback to close the modal
    onConfirm: () => Promise<void>; // Callback to confirm deletion (async for spinner)
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, entityName, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !entityName) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <Modal
            show={isOpen}
            onClose={onClose}
            className="z-50"
            size="md"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
        >
            <Modal.Header>
                <div className="flex items-center gap-2" id="delete-modal-title">
                    <HiOutlineExclamationCircle className="text-red-500 w-6 h-6" />
                    <span>Excluir Registro</span>
                </div>
            </Modal.Header>
            <Modal.Body id="delete-modal-description">
                <p className="text-gray-600">
                    Tem certeza de que deseja excluir{" "}
                    <span className="font-bold text-primary">{entityName}</span>?{" "}
                    Esta ação não pode ser desfeita.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-end gap-4 w-full">
                    <Tooltip content="Cancelar a exclusão" placement="top">
                        <Button
                            color="gray"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex items-center gap-2"
                        >
                            Cancelar
                        </Button>
                    </Tooltip>
                    <Tooltip content="Excluir permanentemente" placement="top">
                        <Button
                            color="failure"
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="flex items-center gap-2"
                        >
                            {isDeleting ? (
                                <>
                                    <Spinner size="sm" light className="mr-2" />
                                    Excluindo...
                                </>
                            ) : (
                                <>
                                    <HiTrash className="w-5 h-5" />
                                    Excluir
                                </>
                            )}
                        </Button>
                    </Tooltip>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
