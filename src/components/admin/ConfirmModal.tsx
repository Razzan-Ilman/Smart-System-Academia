import React from 'react';
import { ExclamationOutlined } from '@ant-design/icons';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    cancelText?: string;
    confirmText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Anda Yakin?",
    cancelText = "Batal",
    confirmText = "Ya Logout",
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center">
                    {/* Icon */}
                    <div className="w-24 h-24 rounded-full border-[6px] border-black flex items-center justify-center mb-6">
                        <ExclamationOutlined className="text-6xl text-black font-bold" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold mb-10 text-gray-800">{title}</h2>

                    {/* Buttons */}
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-[#8e99c5] hover:bg-[#7a85af] text-white rounded-xl font-bold text-lg transition shadow-lg active:scale-95"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 bg-[#dc6581] hover:bg-[#c9516d] text-white rounded-xl font-bold text-lg transition shadow-lg active:scale-95"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
