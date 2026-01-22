'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (profile?.role === 'admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="glass p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gradient">Bem-vindo de volta</h1>
                        <p className="text-zinc-400">Acesse sua área de estudos</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            label="E-mail"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                        />
                        <Input
                            label="Senha"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />

                        {error && (
                            <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                {error}
                            </p>
                        )}

                        <Button className="w-full" size="lg" isLoading={loading}>
                            Entrar
                        </Button>
                    </form>

                    <p className="text-center text-zinc-500 text-sm">
                        Ainda não tem conta?{' '}
                        <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
