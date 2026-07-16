const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
export const deleteContent = async (contentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ contentId }),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to delete content (${response.status})`);
    }
};
//# sourceMappingURL=api.js.map