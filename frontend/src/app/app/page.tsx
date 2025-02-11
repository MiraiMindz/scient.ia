"use client";

import { useUserStore } from '@/app/zustandStores/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const token = useUserStore((state) => state.token);
    const router = useRouter();

    useEffect(() => {
        if (!token) { router.push("/"); }
      }, [router, token]);

    return (
        <main>
            <h1>{token}</h1>
        </main>
    );
}