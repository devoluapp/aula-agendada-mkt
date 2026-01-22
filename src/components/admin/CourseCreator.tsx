'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase, Course } from '@/lib/supabase';
import { Plus, Trash, Edit, Save, X } from 'lucide-react';

interface LessonField {
    id?: string;
    title: string;
    description: string;
    video_url: string;
}

export default function CourseCreator() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

    const [courseTitle, setCourseTitle] = useState('');
    const [description, setDescription] = useState('');
    const [hotmartLink, setHotmartLink] = useState('');
    const [buttonText, setButtonText] = useState('Garantir Minha Vaga');
    const [lessons, setLessons] = useState<LessonField[]>([{ title: '', description: '', video_url: '' }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
        if (data) setCourses(data);
    };

    const handleEdit = async (course: Course) => {
        setEditingCourseId(course.id);
        setCourseTitle(course.title);
        setDescription(course.description || '');
        setHotmartLink(course.hotmart_link || '');
        setButtonText(course.button_text || '');

        setLoading(true);
        const { data: lessonsData } = await supabase
            .from('lessons')
            .select('*')
            .eq('course_id', course.id)
            .order('order_index');

        if (lessonsData && lessonsData.length > 0) {
            setLessons(lessonsData);
        } else {
            setLessons([{ title: '', description: '', video_url: '' }]);
        }
        setLoading(false);
    };

    const resetForm = () => {
        setEditingCourseId(null);
        setCourseTitle('');
        setDescription('');
        setHotmartLink('');
        setButtonText('Garantir Minha Vaga');
        setLessons([{ title: '', description: '', video_url: '' }]);
    };

    const addLesson = () => {
        setLessons([...lessons, { title: '', description: '', video_url: '' }]);
    };

    const removeLesson = (index: number) => {
        setLessons(lessons.filter((_, i) => i !== index));
        if (lessons.length <= 1) {
            setLessons([{ title: '', description: '', video_url: '' }]);
        }
    };

    const updateLesson = (index: number, field: keyof LessonField, value: string) => {
        const newLessons = [...lessons];
        newLessons[index][field] = value;
        setLessons(newLessons);
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm('Tem certeza que deseja excluir este curso e todas as suas aulas?')) return;

        setLoading(true);
        const { error } = await supabase.from('courses').delete().eq('id', courseId);

        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            alert('Curso excluído com sucesso!');
            fetchCourses();
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!courseTitle) return alert('Dê um título ao curso');

        setLoading(true);
        try {
            // Check if scheduled email template exists (Mandatory)
            const { data: emailTemplate } = await supabase
                .from('email_templates')
                .select('*')
                .eq('type', 'scheduled')
                .single();

            if (!emailTemplate || !emailTemplate.body || emailTemplate.body.trim() === '') {
                alert('⚠️ Obrigatório: Configure o "E-mail de Confirmação de Agendamento" na aba Marketing antes de publicar o curso.');
                setLoading(false);
                return;
            }

            let courseId = editingCourseId;

            if (editingCourseId) {
                const { error: courseError } = await supabase
                    .from('courses')
                    .update({
                        title: courseTitle,
                        description,
                        hotmart_link: hotmartLink,
                        button_text: buttonText,
                    })
                    .eq('id', editingCourseId);
                if (courseError) throw courseError;
            } else {
                const { data: course, error: courseError } = await supabase
                    .from('courses')
                    .insert([{
                        title: courseTitle,
                        description,
                        hotmart_link: hotmartLink,
                        button_text: buttonText,
                        is_published: true
                    }])
                    .select()
                    .single();
                if (courseError) throw courseError;
                courseId = course.id;
            }

            // 1. Delete existing lessons for this course to ensure sync
            const { error: deleteError } = await supabase
                .from('lessons')
                .delete()
                .eq('course_id', courseId);

            if (deleteError) throw deleteError;

            // 2. Prepare and Insert new lessons
            const lessonsData = lessons
                .filter(l => l.title.trim() !== '') // Don't save empty lessons
                .map((l, i) => ({
                    course_id: courseId,
                    title: l.title,
                    description: l.description,
                    video_url: l.video_url,
                    order_index: i
                }));

            if (lessonsData.length > 0) {
                const { error: lessonsError } = await supabase.from('lessons').insert(lessonsData);
                if (lessonsError) throw lessonsError;
            }

            alert(editingCourseId ? 'Curso e aulas atualizados!' : 'Curso e aulas criados!');
            resetForm();
            fetchCourses();
        } catch (err: any) {
            console.error(err);
            alert('Erro ao salvar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 max-w-4xl mx-auto pb-20">
            {!editingCourseId && (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-zinc-300">Cursos Existentes</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {courses.map(c => (
                            <div key={c.id} className="glass p-4 flex items-center justify-between group">
                                <div>
                                    <h4 className="font-bold text-zinc-100">{c.title}</h4>
                                    <p className="text-zinc-500 text-sm truncate max-w-md">{c.hotmart_link}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => handleEdit(c)} className="gap-2">
                                        <Edit size={16} /> Editar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteCourse(c.id)}
                                        className="gap-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
                                    >
                                        <Trash size={16} /> Excluir
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && <p className="text-zinc-600 italic">Nenhum curso criado ainda.</p>}
                    </div>
                </div>
            )}

            <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-indigo-400">
                        {editingCourseId ? 'Editando Curso' : 'Novo Curso'}
                    </h2>
                    {editingCourseId && (
                        <Button variant="ghost" size="sm" onClick={resetForm} className="gap-2">
                            <X size={16} /> Cancelar
                        </Button>
                    )}
                </div>

                <div className="glass p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Título do Curso"
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                        />
                        <Input
                            label="Texto do Botão (Hotmart)"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                        />
                    </div>
                    <Input
                        label="Descrição do Curso"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Input
                        label="URL Hotmart (Afiliado)"
                        value={hotmartLink}
                        onChange={(e) => setHotmartLink(e.target.value)}
                        placeholder="https://pay.hotmart.com/..."
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-zinc-100">Aulas do Mini Curso</h3>
                        <Button variant="outline" size="sm" onClick={addLesson} className="gap-2">
                            <Plus size={16} /> Adicionar Aula
                        </Button>
                    </div>

                    {lessons.map((lesson, index) => (
                        <div key={index} className="glass p-6 space-y-4 relative group animate-fade-in">
                            <button
                                onClick={() => removeLesson(index)}
                                className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors"
                                type="button"
                            >
                                <Trash size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={`Título da Aula ${index + 1}`}
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                />
                                <Input
                                    label="URL do Vídeo (MP4 ou YouTube)"
                                    value={lesson.video_url}
                                    onChange={(e) => updateLesson(index, 'video_url', e.target.value)}
                                />
                            </div>
                            <Input
                                label="Descrição da Aula"
                                value={lesson.description}
                                onChange={(e) => updateLesson(index, 'description', e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button size="lg" onClick={handleSave} isLoading={loading} className="px-12 gap-2">
                        <Save size={20} /> {editingCourseId ? 'Salvar Alterações' : 'Publicar Curso'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
