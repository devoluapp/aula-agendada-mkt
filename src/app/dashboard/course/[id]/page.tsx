'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, Course, Lesson } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Clock, Play, Calendar, Lock } from 'lucide-react';
import { format, addMinutes, startOfMinute, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function CourseDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [slots, setSlots] = useState<Date[]>([]);

    useEffect(() => {
        fetchCourseDetails();
        generateSlots();
    }, [id]);

    const fetchCourseDetails = async () => {
        const { data: c } = await supabase.from('courses').select('*').eq('id', id).single();
        const { data: l } = await supabase.from('lessons').select('*').eq('course_id', id).order('order_index');
        if (c) setCourse(c);
        if (l) setLessons(l);
        setLoading(false);
    };

    const generateSlots = () => {
        const now = new Date();
        const nextSlots: Date[] = [];

        // Aligns to the next 10 minute interval
        let firstSlot = startOfMinute(now);
        const remainder = 10 - (firstSlot.getMinutes() % 10);
        firstSlot = addMinutes(firstSlot, remainder);

        for (let i = 0; i < 6; i++) {
            nextSlots.push(addMinutes(firstSlot, i * 10));
        }
        setSlots(nextSlots);
    };

    const handleSchedule = async (slot: Date) => {
        if (!selectedLesson) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert('Faça login para agendar');

        const { error } = await supabase.from('schedules').insert({
            user_id: user.id,
            lesson_id: selectedLesson.id,
            scheduled_at: slot.toISOString(),
            status: 'scheduled'
        });

        if (error) {
            alert(error.message);
        } else {
            // Trigger confirmation email
            fetch('/api/marketing/send', {
                method: 'POST',
                body: JSON.stringify({
                    type: 'scheduled',
                    userId: user.id,
                    lessonId: selectedLesson.id,
                    extraData: {
                        hora: format(slot, "HH:mm"),
                        lessonLink: `${window.location.origin}/dashboard/lesson/${selectedLesson.id}`,
                        lessonName: selectedLesson.title
                    }
                })
            }).catch(console.error);

            // Redirect to lesson page
            router.push(`/dashboard/lesson/${selectedLesson.id}`);
        }
    };

    if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Carrregando...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="space-y-4">
                    <h1 className="text-5xl font-bold">{course?.title}</h1>
                    <p className="text-zinc-500 text-lg leading-relaxed max-w-3xl">
                        {course?.description}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Play className="text-indigo-500" /> Aulas do Curso
                        </h2>
                        <div className="space-y-4">
                            {lessons.map((lesson, idx) => (
                                <div key={lesson.id} className="glass p-6 flex items-center justify-between group glass-hover">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{lesson.title}</h3>
                                            <p className="text-sm text-zinc-500">{lesson.description}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="secondary" onClick={() => setSelectedLesson(lesson)}>
                                        Agendar Aula
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sidebar space-y-6">
                        <div className="glass p-6 space-y-4 sticky top-24 border border-indigo-600/20 active:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Calendar className="text-indigo-400" size={20} /> Horários Próximos
                            </h3>
                            <p className="text-xs text-zinc-500">Selecione uma aula à esquerda para agendar em um dos horários abaixo:</p>

                            <div className="grid grid-cols-2 gap-2">
                                {slots.map((slot, i) => (
                                    <button
                                        key={i}
                                        disabled={!selectedLesson}
                                        onClick={() => handleSchedule(slot)}
                                        className={`px-3 py-3 rounded-xl border text-sm font-medium transition-all ${selectedLesson
                                            ? 'bg-zinc-900 border-zinc-800 hover:border-indigo-600 hover:text-indigo-400'
                                            : 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed'
                                            }`}
                                    >
                                        {format(slot, "HH:mm")}
                                    </button>
                                ))}
                            </div>

                            {!selectedLesson && (
                                <div className="text-center py-4 text-zinc-600 text-sm flex flex-col items-center gap-2">
                                    <Lock size={16} />
                                    Escolha uma aula
                                </div>
                            )}
                        </div>

                        <div className="glass p-6 text-center space-y-4">
                            <p className="text-sm text-zinc-400">Gostando do conteúdo?</p>
                            <Button className="w-full">{course?.button_text}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
