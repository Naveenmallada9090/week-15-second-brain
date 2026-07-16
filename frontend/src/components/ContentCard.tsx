import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteContent } from '../services/api';

interface Content {
    _id: string;
    title: string;
    link: string;
    type: string;
    tags: any[];
}

interface ContentCardProps {
    content: Content;
    onDelete: (id: string) => void;
    onSuccess?: (message: string) => void;
}

export const ContentCard = ({ content, onDelete, onSuccess }: ContentCardProps) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setShowConfirm(true)}
                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Delete content"
                type="button"
            >
                <Trash2 size={18} />
            </button>

            <div className="pr-8">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                    {content.title}
                </h3>
                <a
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm mb-2 block truncate hover:underline"
                >
                    {content.link}
                </a>
                <span className="inline-block text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded">
                    {content.type}
                </span>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Are you sure you want to delete this content?
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
                    {success}
                </div>
            )}
        </div>
    );
};
