"use client";

import { useUserStore } from '@/app/zustandStores/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const token = useUserStore((state) => state.token);
    const rehydrated = useUserStore((state) => state._persist?.rehydrated);
    const router = useRouter();

    useEffect(() => {
        if (rehydrated && !token) { router.push("/"); }
    }, [router, token, rehydrated]);

    return (
        <main>
            <h1>{token}</h1>
        </main>
    );
}