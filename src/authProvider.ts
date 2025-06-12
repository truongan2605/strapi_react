const STRAPI_URL = 'http://localhost:1337';
import { rolePermissions } from './permissions';

const authProvider = {
    login: async ({ username, password }: { username: string; password: string }) => {
        const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: username, password }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message || 'Login failed');

        const token = json.jwt;

        // Gọi lại /me nhưng populate cả avatar và role
        const meRes = await fetch(`${STRAPI_URL}/api/users/me?populate[avatar]=*&populate[role]=*`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const user = await meRes.json();
        if (!meRes.ok) throw new Error('Cannot fetch user info');

        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        return Promise.resolve();
    },

    checkAuth: () => {
        return localStorage.getItem('auth_token') ? Promise.resolve() : Promise.reject();
    },

    getPermissions: async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const roleType = user?.role?.type || 'public'; // Lấy theo `type`, ví dụ: 'authenticated' hoặc 'public'
        return rolePermissions[roleType] || {};
    },

    getIdentity: async () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const avatarUrl =
            user?.avatar?.formats?.thumbnail?.url ||
            user?.avatar?.url ||
            'https://via.placeholder.com/150';

        return {
            id: user.id,
            fullName: user.username,
            email: user.email,
            avatar: avatarUrl.startsWith('http')
                ? avatarUrl
                : STRAPI_URL + avatarUrl,
        };
    },

    checkError: () => Promise.resolve(),
};

export default authProvider;
