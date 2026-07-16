import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteContent } from '../services/api';
export const ContentCard = ({ content, onDelete, onSuccess }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                onDelete(content._id);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [success, content._id, onDelete]);
    const handleDelete = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await deleteContent(content._id);
            setSuccess('Content deleted successfully');
            onSuccess?.('Content deleted successfully');
            setShowConfirm(false);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete content');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow", children: [_jsx("button", { onClick: () => setShowConfirm(true), className: "absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors", "aria-label": "Delete content", type: "button", children: _jsx(Trash2, { size: 18 }) }), _jsxs("div", { className: "pr-8", children: [_jsx("h3", { className: "font-semibold text-gray-900 text-lg mb-1 line-clamp-1", children: content.title }), _jsx("a", { href: content.link, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 text-sm mb-2 block truncate hover:underline", children: content.link }), _jsx("span", { className: "inline-block text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded", children: content.type })] }), showConfirm && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: _jsxs("div", { className: "bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Are you sure you want to delete this content?" }), _jsx("p", { className: "text-sm text-gray-500 mb-6", children: "This action cannot be undone." }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: () => setShowConfirm(false), className: "px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors", disabled: loading, children: "Cancel" }), _jsx("button", { onClick: handleDelete, className: "px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors", disabled: loading, children: loading ? 'Deleting...' : 'Delete' })] })] }) })), error && (_jsx("div", { className: "mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg", children: error })), success && (_jsx("div", { className: "mt-3 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg", children: success }))] }));
};
//# sourceMappingURL=ContentCard.js.map