'use client';

import React, { useEffect, useState } from 'react';
import { supabase, Course } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';

export default function UserDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const { data } = await supabase.from('courses').select('*').eq('is_published', true);
        if (data) setCourses(data);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="space-y-4">
                    <h1 className="text-4xl font-bold text-gradient">Seus Cursos Disponíveis</h1>
                    <p className="text-zinc-500">Escolha um mini curso para começar seus estudos agora.</p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="glass h-64 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div key={course.id} className="glass p-8 flex flex-col justify-between glass-hover group h-full border border-zinc-800/50">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                                        <BookOpen size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold">{course.title}</h3>
                                    <p className="text-zinc-500 line-clamp-3 text-sm leading-relaxed">
                                        {course.description}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                                        <Clock size={16} />
                                        <span>Aulas por agendamento</span>
                                    </div>
                                    <Link href={`/dashboard/course/${course.id}`}>
                                        <Button variant="outline" size="sm" className="group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                            Acessar <ChevronRight size={16} className="ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
