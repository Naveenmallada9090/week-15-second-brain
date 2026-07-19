const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const deleteContent = async (contentId: string): Promise<void> => {
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

export const getContent = async (): Promise<any[]> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to fetch content (${response.status})`);
    }

    return response.json();
};

export const toggleShare = async (share: boolean): Promise<{ url: string } | { message: string }> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/brain/share`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({ share }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to share brain (${response.status})`);
    }

    return response.json();
};

export const addContent = async (data: {
    title: string;
    link: string;
    type: string;
    tags: string[];
}): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/content`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
        },
        body: JSON.stringify({
            title: data.title,
            link: data.link,
            type: data.type,
            tags: data.tags,
        }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `Failed to add content (${response.status})`);
    }
};