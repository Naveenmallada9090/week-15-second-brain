import { useState, useEffect } from 'react';
import { ContentCard } from '../components/ContentCard';
import { AddContentModal } from '../components/AddContentModal';
import { getContent, deleteContent, toggleShare } from '../services/api';

interface Content {
    _id: string;
    title: string;
    link: string;
    type: string;
    tags: any[];
}

const AllNotes: React.FC = () => {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [shareLoading, setShareLoading] = useState<boolean>(false);
    const [shareEnabled, setShareEnabled] = useState<boolean>(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [showAddContentModal, setShowAddContentModal] = useState(false);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getContent();
            setContents(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteContent(id);
            setContents(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert('Failed to delete: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    const toggleShareHandler = async () => {
        setShareLoading(true);
        try {
            const result = await toggleShare(!shareEnabled);
            if (result && 'url' in result) {
                // Sharing enabled, we got a URL back
                setShareEnabled(true);
                setShareUrl(result.url);
            } else {
                // Sharing disabled
                setShareEnabled(false);
                setShareUrl(null);
            }
        } catch (err) {
            alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setShareLoading(false);
        }
    };

    const handleAddContentSuccess = () => {
        // Refresh content list after successful addition
        fetchContents();
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (error) {
        return <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header and actions */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            All Notes
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage and organize all your saved content
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
                        <button
                            onClick={() => setShowAddContentModal(true)}
                            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                            </svg>
                            Add Content
                        </button>
                        <button
                            onClick={toggleShareHandler}
                            disabled={shareLoading}
                            className="px-5 py-3 flex items-center gap-2 rounded-lg transition-colors font-medium"
                            className={shareEnabled
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
                        >
                            {shareLoading ? (
                                <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M4 4a5 5 0 014.596 9.125l-.961 1.92A5.001 5.001 0 114 4z" fillRule="evenodd" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <>
                                    {shareEnabled ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 9.586V7a1 1 0 10-2 0v2.586l-.793-.793z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.706 4.406a1 1 0 00-1.414 1.414l1.293 1.293a1 1 0 101.414-1.414L9.293 5.707a1 1 0 00-1.414 0l-1.293 1.293zm5.657 11.414a1 1 0 001.414-1.414l-1.293-1.293a1 1 0 10-1.414 1.414l1.293 1.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {shareEnabled ? 'Shared' : 'Share Brain'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Share Link (if enabled) */}
                {shareEnabled && shareUrl && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="mb-2 text-sm font-medium text-blue-800">Your brain is shared!</p>
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="w-full p-2 bg-white border border-gray-300 rounded-md text-sm font-mono"
                        />
                    </div>
                )}

                {/* Content List */}
                <div className="space-y-4">
                    {contents.length > 0 ? (
                        contents.map((content) => (
                            <ContentCard
                                key={content._id}
                                content={content}
                                onDelete={handleDelete}
                                onSuccess={() => {
                                    // Optionally refetch or update state
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No content yet. Add some to get started!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Content Modal */}
            <AddContentModal
                isOpen={showAddContentModal}
                onClose={() => setShowAddContentModal(false)}
                onSuccess={handleAddContentSuccess}
            />
        </div>
    );
};

export default AllNotes;