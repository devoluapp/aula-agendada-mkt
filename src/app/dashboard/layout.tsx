'use client';

import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, BookOpen, User } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/auth/login');
    };

    return (
        <div className="min-h-screen bg-zinc-950">
            <nav className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="text-xl font-bold text-gradient">
                        Minha Área
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-2">
                            <BookOpen size={18} /> Cursos
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-sm font-medium text-zinc-400 hover:text-red-400 flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={18} /> Sair
                        </button>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
