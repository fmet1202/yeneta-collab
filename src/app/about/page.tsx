"use client";

import Link from "next/link";
import { ArrowRight, User, FileText, MessageSquare, UploadCloud, CheckCircle2, Mail, Sparkles } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-body text-content relative overflow-hidden">
      
      {/* Background Accents */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <PublicNavbar />

      <main className="flex-1 flex flex-col items-center px-4 mt-12 md:mt-16 relative z-10 max-w-6xl mx-auto w-full pb-24">
        
        {/* Hero Section */}
        <section className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-muted text-primary font-bold rounded-full text-[0.8125rem] mb-6 border border-primary/20 font-label tracking-wide uppercase">
            <Sparkles size={14} />
            AI-Powered Study Assistant
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-content mb-4 tracking-tight font-headline">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">የኔታ | Yeneta</span>
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-content mb-6 font-headline tracking-tight">
            "Learn Smarter in Your Own Language."
          </p>
          
          <p className="text-lg md:text-xl text-content-muted max-w-2xl mx-auto leading-relaxed mb-8">
            Your personal AI tutor. Designed to empower Ethiopian students through seamless bilingual support and smart document analysis.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/chat" className="bg-primary text-content-inverse px-8 py-3.5 rounded-xl font-bold hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2">
              Go to Chat <ArrowRight size={18} />
            </Link>
            <a href="https://github.com/0xTeme/yeneta.git" target="_blank" rel="noreferrer" className="bg-surface text-content px-8 py-3.5 rounded-xl font-bold hover:bg-surface-hover border border-border-strong transition-all flex items-center gap-2">
              <GithubIcon size={18} /> View Source
            </a>
          </div>
        </section>

        {/* Premium SaaS Stats / Highlights Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {[
            { label: "Language Support", value: "Amharic & English", desc: "Learn seamlessly in both languages without losing context." },
            { label: "Personalized", value: "Smart AI Tutor", desc: "Academic guidance tailored specifically to each student's level." },
            { label: "Document-Based", value: "Interactive Quizzes", desc: "Practice generation directly from your uploaded materials." },
            { label: "Voice-Enabled", value: "Continuous Support", desc: "Audio study assistance for better accessibility and retention." },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-glass backdrop-blur-md border border-border-subtle rounded-3xl p-6 shadow-sm flex flex-col items-start hover:border-primary/30 transition-colors">
              <div className="text-[0.6875rem] font-bold text-primary uppercase tracking-widest font-label mb-3 bg-primary-muted px-2.5 py-1 rounded-md">
                {stat.label}
              </div>
              <div className="text-xl font-bold text-content font-headline mb-2 leading-tight">
                {stat.value}
              </div>
              <p className="text-sm text-content-muted leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </section>

        {/* How It Works */}
        <section className="w-full mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-content font-headline mb-4">How it works</h2>
            <p className="text-content-muted">A seamless study flow designed for maximum retention.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: UploadCloud, title: "1. Upload", desc: "Drop your notes, PDFs, or PPTXs." },
              { icon: MessageSquare, title: "2. Ask", desc: "Chat with your materials instantly." },
              { icon: FileText, title: "3. Learn", desc: "Get simplified, bilingual summaries." },
              { icon: CheckCircle2, title: "4. Practice", desc: "Generate quizzes to test your knowledge." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-surface rounded-3xl border border-border-subtle relative hover:border-border-strong transition-colors">
                <div className="w-12 h-12 bg-primary-muted rounded-full flex items-center justify-center text-primary mb-4">
                  <step.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-content font-headline mb-2">{step.title}</h3>
                <p className="text-sm text-content-muted">{step.desc}</p>
                
                {i !== 3 && <ArrowRight className="absolute right-[-16px] top-1/2 -translate-y-1/2 text-border-strong hidden md:block z-10 bg-background rounded-full" size={32} />}
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Creators Section */}
        <section className="w-full mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border-subtle pb-4">
            <h2 className="text-2xl font-bold text-content font-headline">Meet the Creators</h2>
            <span className="text-xs sm:text-sm font-bold text-primary bg-primary-muted px-4 py-1.5 rounded-full uppercase tracking-widest font-label border border-primary/10">
              Built by CODE GE'EZ
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Creator 1: Temesgen Melaku (Backend / AI) */}
            <div className="group bg-surface-glass backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-border-subtle hover:border-primary/50 transition-all duration-300 hover:shadow-sm flex flex-col sm:flex-row items-start gap-5">
              <div className="bg-primary/10 p-1.5 rounded-2xl border border-primary/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-content-inverse font-bold shadow-sm relative overflow-hidden">
                  <User size={28} className="absolute z-0 opacity-50" />
                  <img 
                    src="/creators/temesgen.png" 
                    alt="Temesgen Melaku" 
                    className="w-full h-full object-cover relative z-10 transition-opacity duration-300" 
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }} 
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-1 mb-3">
                  <h3 className="font-bold text-content font-headline text-xl">Temesgen Melaku</h3>
                  <span className="text-primary font-semibold text-sm">Backend / Database & AI</span>
                </div>
                <p className="text-sm text-content-muted leading-relaxed mb-5">
                  <strong className="text-content font-medium">Focuses On:</strong> API routes, Database architecture, Gemini integration, prompts, and file processing.
                </p>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/0xTeme" target="_blank" rel="noreferrer" title="GitHub" className="text-content-muted hover:text-content transition-colors p-2.5 bg-surface hover:bg-surface-hover rounded-xl border border-border-strong shadow-sm"><GithubIcon size={18} /></a>
                  <a href="mailto:Temezgens@gmail.com" title="Email" className="text-content-muted hover:text-content transition-colors p-2.5 bg-surface hover:bg-surface-hover rounded-xl border border-border-strong shadow-sm"><Mail size={18} /></a>
                  <a href="https://www.linkedin.com/in/temesgen-melaku-walelign" target="_blank" rel="noreferrer" title="LinkedIn" className="text-content-muted hover:text-[#0a66c2] transition-colors p-2.5 bg-surface hover:bg-surface-hover rounded-xl border border-border-strong shadow-sm"><LinkedInIcon size={18} /></a>
                </div>
              </div>
            </div>

            {/* Creator 2: Fiseha Mengistu (Frontend / UI-UX) */}
            <div className="group bg-surface-glass backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-border-subtle hover:border-primary/50 transition-all duration-300 hover:shadow-sm flex flex-col sm:flex-row items-start gap-5">
              <div className="bg-primary/10 p-1.5 rounded-2xl border border-primary/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-content-inverse font-bold shadow-sm relative overflow-hidden">
                  <User size={28} className="absolute z-0 opacity-50" />
                  <img 
                    src="/creators/fiseha.png" 
                    alt="Fiseha Mengistu" 
                    className="w-full h-full object-cover relative z-10 transition-opacity duration-300" 
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }} 
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-1 mb-3">
                  <h3 className="font-bold text-content font-headline text-xl">Fiseha Mengistu</h3>
                  <span className="text-primary font-semibold text-sm">Frontend / UI-UX</span>
                </div>
                <p className="text-sm text-content-muted leading-relaxed mb-5">
                  <strong className="text-content font-medium">Focuses On:</strong> Interface design, React components, styling, responsiveness, and speech features.
                </p>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/fmet1202" target="_blank" rel="noreferrer" title="GitHub" className="text-content-muted hover:text-content transition-colors p-2.5 bg-surface hover:bg-surface-hover rounded-xl border border-border-strong shadow-sm"><GithubIcon size={18} /></a>
                  <a href="mailto:fmet1202@gmail.com" title="Email" className="text-content-muted hover:text-content transition-colors p-2.5 bg-surface hover:bg-surface-hover rounded-xl border border-border-strong shadow-sm"><Mail size={18} /></a>
                  <a href="https://www.linkedin.com/in/fiseha-mengistu" target="_blank" rel="noreferrer" title="LinkedIn" className="text-content-muted hover:text-[#0a66c2] transition-colors p-2.5 bg-surface hover:bg-surface-hover rounded-xl border border-border-strong shadow-sm"><LinkedInIcon size={18} /></a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full text-center bg-primary-muted border border-primary/20 rounded-3xl p-12 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline mb-4">Ready to start learning?</h2>
          <p className="text-primary/80 mb-8 max-w-xl mx-auto">Join the study room and experience AI-powered personalized tutoring right now.</p>
          <Link href="/chat" className="bg-primary text-content-inverse px-8 py-4 rounded-xl font-bold hover:bg-primary-hover shadow-sm transition-all inline-flex items-center gap-2">
            Go to Chat <ArrowRight size={18} />
          </Link>
        </section>

      </main>
    </div>
  );
}
