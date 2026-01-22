# 🚀 Plataforma de Aulas Agendadas (Link-Aula)

Sistema premium de mini-cursos com agendamento de aulas "ao vivo", automação de marketing via e-mail e integração com Hotmart.

## 🛠 Como Publicar na Vercel (Passo a Passo)

### 1. Preparar o Repositório
Certifique-se de que seu código está em um repositório no **GitHub**, **GitLab** ou **Bitbucket**.

### 2. Configurar o Projeto na Vercel
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Clique em **"Add New"** > **"Project"**.
3. Importe o repositório deste projeto.

### 3. Configurar Variáveis de Ambiente (CRÍTICO)
Durante a importação, abra a seção **"Environment Variables"** e adicione as chaves que estão no seu `.env.local`:

| Variável | Valor |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sua URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sua Chave Anon do Supabase |
| `RESEND_API_KEY` | Sua API Key do Resend |

### 4. Deploy
Clique em **"Deploy"**. A Vercel levará cerca de 1-2 minutos para compilar e gerar sua URL pública (ex: `link-aula.vercel.app`).

---

## ⚡ Configuração Pós-Publicação

### 1. Atualizar URL no Resend (Opcional)
Se você for usar um domínio próprio (ex: `seu-site.com.br`), lembre-se de:
1. Validar o domínio no painel do **Resend**.
2. No arquivo `src/app/api/marketing/send/route.ts`, alterar o campo `from` de `onboarding@resend.dev` para `contato@seu-site.com.br`.

### 2. Configurações de Segurança no Supabase
Certifique-se de que todas as políticas de RLS e a função `is_admin()` foram executadas no SQL Editor do Supabase conforme as instruções durante o desenvolvimento.

---

## 👨‍💻 Fluxo Administrativo
1. Acesse `/auth/register` e crie sua conta.
2. No Supabase, mude sua `role` para `admin` na tabela `profiles`.
3. Acesse `/admin/dashboard` para criar cursos e configurar templates de e-mail.

---

**Desenvolvido por Antigravity (Advanced Agentic Coding)**
