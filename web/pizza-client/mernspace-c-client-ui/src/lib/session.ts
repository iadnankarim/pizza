import { cookies } from 'next/headers';

interface Session {
    user: User;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'customer' | 'manager';
    tenant: number | null;
}

export const getSession = async () => {
    return await getSelf();
};

const getSelf = async (): Promise<Session | null> => {
    let response: Response;
    try {
        response = await fetch(`${process.env.BACKEND_URL}/api/auth/auth/self`, {
            headers: {
                Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
            },
        });
    } catch {
        // backend not reachable -> treat as logged out
        return null;
    }

    if (!response.ok) {
        return null;
    }

    return {
        user: (await response.json()) as User,
    };
};
