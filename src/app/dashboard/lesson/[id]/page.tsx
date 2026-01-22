'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase, Lesson, Course } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { format, isAfter, isBefore, addMinutes } from 'date-fns';

export default function LessonViewer() {
    const { id } = useParams();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [schedule, setSchedule] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [canWatch, setCanWatch] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>('00:00');

    useEffect(() => {
        fetchLessonData();
        checkCanWatch(); // Call immediately
        const interval = setInterval(checkCanWatch, 1000);
        return () => clearInterval(interval);
    }, [id, schedule]); // Added schedule as dependency for immediate sync

    const fetchLessonData = async () => {
        const { data: l } = await supabase.from('lessons').select('*, courses(*)').eq('id', id).single();
        if (l) {
            setLesson(l);
            setCourse(l.courses);
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: s } = await supabase
                .from('schedules')
                .select('*')
                .eq('lesson_id', id)
                .eq('user_id', user.id)
                .order('scheduled_at', { ascending: false })
                .limit(1)
                .single();
            setSchedule(s);
        }
        setLoading(false);
    };

    const checkCanWatch = () => {
        if (!schedule) return;

        const now = new Date();
        const scheduledTime = new Date(schedule.scheduled_at);
        const endTime = addMinutes(scheduledTime, 60); // Assume 60 min classes

        if (isAfter(now, scheduledTime) && isBefore(now, endTime)) {
            setCanWatch(true);
        } else if (isBefore(now, scheduledTime)) {
            const diff = scheduledTime.getTime() - now.getTime();
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            setCanWatch(false);
        } else {
            setCanWatch(false);
            setTimeLeft('Expirado');
        }
    };

    if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Preparando sala de aula...</div>;

    if (!schedule) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <h2 className="text-2xl font-bold">Você não tem agendamento para esta aula</h2>
                <Button onClick={() => window.history.back()}>Voltar e Agendar</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold">{lesson?.title}</h1>
                        <p className="text-zinc-500">{course?.title}</p>
                    </div>
                    <div className="bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-800 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <Clock size={20} />
                            <span className="font-mono text-xl">{canWatch ? 'AO VIVO' : timeLeft}</span>
                        </div>
                    </div>
                </div>

                <div className="aspect-video w-full bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                    {canWatch ? (
                        lesson?.video_url.includes('.mp4') || lesson?.video_url.includes('supabase') ? (
                            <video
                                src={lesson?.video_url}
                                controls
                                autoPlay
                                className="w-full h-full object-cover"
                                controlsList="nodownload"
                            />
                        ) : (
                            <iframe
                                src={lesson?.video_url.includes('?') ? `${lesson.video_url}&autoplay=1` : `${lesson?.video_url}?autoplay=1`}
                                className="w-full h-full"
                                allow="autoplay; fullscreen"
                                allowFullScreen
                            />
                        )
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-zinc-950/95 backdrop-blur-xl animate-in fade-in duration-700">
                            <div className="relative">
                                <ShieldCheck size={100} className="text-indigo-500 animate-pulse" />
                                <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
                            </div>

                            <div className="text-center space-y-3">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-white">
                                    Sala de Transmissão
                                </h2>
                                <p className="text-zinc-400 font-medium text-lg">
                                    A aula será liberada em:
                                </p>
                            </div>

                            <div className="flex gap-4">
                                {timeLeft.split(':').map((unit, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className="w-20 h-24 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-indigo-600/5 group-hover:bg-indigo-600/10 transition-colors" />
                                            <span className="text-4xl md:text-5xl font-black text-indigo-500 font-mono relative z-10 transition-transform group-hover:scale-110 duration-300">
                                                {unit}
                                            </span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                                            {i === 0 ? 'Minutos' : 'Segundos'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="px-6 py-2 bg-indigo-600/10 border border-indigo-600/20 rounded-full">
                                <p className="text-indigo-400 text-sm font-bold flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                    </span>
                                    HORÁRIO AGENDADO: {format(new Date(schedule.scheduled_at), "HH:mm")}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 glass p-8 space-y-4">
                        <h2 className="text-xl font-bold">Descrição da Aula</h2>
                        <p className="text-zinc-400 leading-relaxed">{lesson?.description}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-8 bg-indigo-600/5 border-indigo-600/20 space-y-6 text-center">
                            <h3 className="text-xl font-bold text-indigo-400">Oferta Especial</h3>
                            <p className="text-zinc-400 text-sm">Aproveite a oportunidade única citada pelo professor na aula.</p>
                            <a href={course?.hotmart_link} target="_blank">
                                <Button size="lg" className="w-full gap-2">
                                    <ExternalLink size={18} /> {course?.button_text}
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
