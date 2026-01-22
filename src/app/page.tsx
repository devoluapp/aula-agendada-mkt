import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 max-w-4xl px-4 animate-fade-in">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 text-sm font-medium">
            Plataforma Exclusiva de Mini Cursos
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Aprenda com Estrutura de{' '}
            <span className="text-gradient">Live Mentoria</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Tenha acesso a mini cursos práticos com sistema de agendamento em tempo real.
            Escolha seu horário e assista como se fosse ao vivo.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register">
            <Button size="lg" className="px-10">
              Começar Agora
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="lg">
              Já tenho conta
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          {[
            { title: 'Acesso Restrito', desc: 'Conteúdo protegido e exclusivo para alunos selecionados.' },
            { title: 'Agenda Dinâmica', desc: 'Aulas a cada 10 minutos. Escolha o melhor momento para sua aula.' },
            { title: 'Links VIP Hotmart', desc: 'Acesso direto a conteúdos complementares e ofertas exclusivas.' },
          ].map((feature, i) => (
            <div key={i} className="glass p-6 text-left space-y-2 glass-hover">
              <h3 className="font-bold text-zinc-100">{feature.title}</h3>
              <p className="text-zinc-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
