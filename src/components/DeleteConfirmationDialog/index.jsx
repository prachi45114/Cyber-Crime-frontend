import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, resourceName }) {
    const [inputValue, setInputValue] = useState("");

    const handleConfirm = () => {
        if (inputValue?.trim() === resourceName?.trim()) {
            onConfirm();
            setInputValue("");
        }
    };

    const disabled = inputValue?.trim() !== resourceName?.trim();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div
                        className="relative w-full max-w-md bg-white dark:bg-[#252526] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#3e3e42] overflow-hidden"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Confirm Deletion</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-6 space-y-5 text-center">
                            <div className="flex justify-center mb-2">
                                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                                    <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <h3 className="text-base font-medium text-gray-800 dark:text-gray-100">
                                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-200">{resourceName}</span>?
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This action <span className="text-red-500 font-semibold">cannot be undone</span>. To confirm, type the resource name below.
                            </p>

                            <div className="mt-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                    placeholder={`Enter "${resourceName}"`}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="grid grid-cols-2 gap-3 px-6 pb-6">
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={disabled}
                                className={`w-full transition-all ${
                                    disabled ? "bg-red-300 text-white cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md"
                                }`}
                            >
                                Delete
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
