import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'success' | 'warning';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = '确认',
    cancelText = '取消',
    type = 'warning',
    onConfirm,
    onCancel
}) => {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            icon: <AlertTriangle className="text-red-500" size={48} />,
            button: 'bg-red-500 hover:bg-red-600',
        },
        success: {
            icon: <Check className="text-green-500" size={48} />,
            button: 'bg-green-500 hover:bg-green-600',
        },
        warning: {
            icon: <AlertTriangle className="text-yellow-500" size={48} />,
            button: 'bg-yellow-500 hover:bg-yellow-600',
        }
    };

    const styles = typeStyles[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-200">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    {styles.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-center text-gray-600 mb-6">
                    {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors ${styles.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
