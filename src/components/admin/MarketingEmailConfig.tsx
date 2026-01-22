'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

const EMAIL_TYPES = [
    { id: 'scheduled', label: 'Confirmação de Agendamento' },
    { id: 'watched', label: 'Cumpriu a Aula' },
    { id: 'not_watched', label: 'Não Iniciou' },
    { id: 'partial', label: 'Assistiu Parcialmente' },
    { id: 'day1', label: 'Remarketing (1 Dia)' },
    { id: 'day3', label: 'Remarketing (3 Dias)' },
    { id: 'day5', label: 'Remarketing (5 Dias)' },
    { id: 'day7', label: 'Remarketing (7 Dias)' },
];

export default function MarketingEmailConfig() {
    const [selectedType, setSelectedType] = useState('watched');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTemplate();
    }, [selectedType]);

    const fetchTemplate = async () => {
        const { data } = await supabase
            .from('email_templates')
            .select('*')
            .eq('type', selectedType)
            .single();

        if (data) {
            setSubject(data.subject);
            setBody(data.body);
        } else {
            setSubject('');
            setBody('');
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const { error } = await supabase
            .from('email_templates')
            .upsert({
                type: selectedType,
                subject,
                body,
            }, { onConflict: 'type' });

        if (error) alert(error.message);
        else alert('E-mail configurado!');
        setLoading(false);
    };

    return (
        <div className="glass p-8 space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Tipo de Gatilho</label>
                    <div className="flex flex-col gap-2">
                        {EMAIL_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`text-left px-4 py-3 rounded-lg border transition-all ${selectedType === type.id
                                    ? 'bg-indigo-600/20 border-indigo-600 text-indigo-400'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <Input
                        label="Assunto do E-mail"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-400 ml-1">Corpo do E-mail</label>
                        <textarea
                            className="w-full h-80 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 focus:border-indigo-600 transition-all"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Use {{name}} para o nome do usuário..."
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSave} isLoading={loading}>Salvar Template</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
