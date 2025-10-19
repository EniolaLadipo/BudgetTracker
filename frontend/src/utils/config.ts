export const config = {
    apiBackend: import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000',
    getCookie: (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        }
};
