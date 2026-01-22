'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;
        const phone = formData.get('phone') as string;

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                },
            },
        });

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        if (data.user) {
            // Profile trigger will handle creation
            alert('Cadastro realizado! Verifique seu e-mail para confirmar.');
            router.push('/auth/login');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="glass p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gradient">Crie sua conta</h1>
                        <p className="text-zinc-400">Entre para ter acesso às aulas exclusivas</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            label="Nome Completo"
                            name="fullName"
                            placeholder="Ex: João Silva"
                            required
                        />
                        <Input
                            label="E-mail"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                        />
                        <Input
                            label="Telefone (WhatsApp)"
                            name="phone"
                            placeholder="(00) 00000-0000"
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
                            Cadastrar Agora
                        </Button>
                    </form>

                    <p className="text-center text-zinc-500 text-sm">
                        Já tem uma conta?{' '}
                        <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                            Fazer Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
