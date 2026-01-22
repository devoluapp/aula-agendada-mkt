import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const { type, userId, lessonId, extraData } = await req.json();

        // 1. Get Template
        const { data: template, error: tError } = await supabase
            .from('email_templates')
            .select('*')
            .eq('type', type)
            .single();

        if (tError || !template) return NextResponse.json({ error: 'Template not found' }, { status: 404 });

        // 2. Get User
        const { data: profile, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (pError || !profile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // 3. Replace Placeholders
        let body = template.body.replace(/{{name}}/g, profile.full_name);
        let subject = template.subject.replace(/{{name}}/g, profile.full_name);

        if (extraData) {
            if (extraData.hora) {
                body = body.replace(/{{hora}}/g, extraData.hora);
                subject = subject.replace(/{{hora}}/g, extraData.hora);
            }
            if (extraData.lessonLink) {
                body = body.replace(/{{link-da-aula}}/g, extraData.lessonLink);
                subject = subject.replace(/{{link-da-aula}}/g, extraData.lessonLink);
            }
            if (extraData.lessonName) {
                body = body.replace(/{{nome-da-aula}}/g, extraData.lessonName);
                subject = subject.replace(/{{nome-da-aula}}/g, extraData.lessonName);
            }
        }

        // 4. Send Email
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: profile.email,
            subject: subject,
            text: body,
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
