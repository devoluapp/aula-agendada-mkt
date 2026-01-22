'use client';

import React, { useState } from 'react';
import CourseCreator from '@/components/admin/CourseCreator';
import MarketingEmailConfig from '@/components/admin/MarketingEmailConfig';
import { LayoutDashboard, Mail, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'courses' | 'marketing'>('courses');

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <nav className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gradient">Painel Administrativo</h1>
                    <div className="flex gap-4 items-center">
                        <Link href="/dashboard" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium mr-4">
                            Área do Aluno
                        </Link>
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'courses' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            <BookOpen size={18} /> Cursos
                        </button>
                        <button
                            onClick={() => setActiveTab('marketing')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'marketing' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            <Mail size={18} /> Marketing
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-12">
                {activeTab === 'courses' ? (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center space-y-2 mb-12">
                            <h2 className="text-4xl font-bold">Gerenciamento de Aulas</h2>
                            <p className="text-zinc-500">Crie e edite seus mini cursos exclusivos</p>
                        </div>
                        <CourseCreator />
                    </div>
                ) : (
                    <div className="space-y-8 animate-fade-in">
                        <div className="text-center space-y-2 mb-12">
                            <h2 className="text-4xl font-bold">Réguas de E-mail</h2>
                            <p className="text-zinc-500">Configure as automações de remarketing por comportamento</p>
                        </div>
                        <MarketingEmailConfig />
                    </div>
                )}
            </main>
        </div>
    );
}
