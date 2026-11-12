'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/page-shell';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Loader2, 
  FileText, 
  GraduationCap, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm-1',
    sender: 'ai',
    text: 'Olá! Eu sou o NEXUS AI Assistant, especialista em gestão escolar, regulamentos do MINEDH e administração institucional em Moçambique. Como posso auxiliar a direcção da sua escola hoje?',
    time: 'Agora'
  }
];

const SUGGESTIONS = [
  { label: 'Circular de Início de Trimestre', icon: FileText, prompt: 'Redige uma circular oficial em Português de Moçambique para os pais sobre a abertura do 1º Trimestre Lectivo de 2026, horários e pontualidade.' },
  { label: 'Regulamento de Exames (10ª e 12ª)', icon: GraduationCap, prompt: 'Quais são as directrizes do MINEDH para a inscrição de alunos nas classes com exame nacional (10ª e 12ª classes)?' },
  { label: 'Estratégia de Cobrança WhatsApp', icon: DollarSign, prompt: 'Como estruturar uma régua de cobrança de propinas via WhatsApp e M-Pesa com respeito e alta taxa de adesão dos pais?' },
  { label: 'Convocatória para Conselho de Notas', icon: ShieldCheck, prompt: 'Elabora um modelo formal de convocatória para o Conselho de Avaliação e Notas dos professores do 1º Trimestre.' },
];

let msgCounter = 0;
const generateId = (prefix: string) => `${prefix}-${++msgCounter}`;

export default function IAChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: Message = {
      id: generateId('usr'),
      sender: 'user',
      text: text.trim(),
      time: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, messages: [...messages, userMsg] })
      });

      const data = await res.json();
      const aiReplyText = data.reply || 'Não foi possível obter resposta no momento.';

      const aiMsg: Message = {
        id: generateId('ai'),
        sender: 'ai',
        text: aiReplyText,
        time: timeStr
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      toast.error('Erro na comunicação com o assistente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Texto copiado para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    toast.success('Conversa reiniciada.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="text-accent-500 h-6 w-6" /> NEXUS AI Assistant
          </h1>
          <p className="text-sm text-slate-500">
            Inteligência especializada na legislação do MINEDH, circulares pedagógicas e apoio à gestão escolar moçambicana.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleReset} className="text-xs text-slate-600">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Nova Conversa
        </Button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
        {/* Messages Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 custom-scrollbar bg-slate-50/30">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="h-9 w-9 rounded-xl bg-primary-950 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Bot size={18} />
                </div>
              )}

              <div 
                className={`group relative max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-primary-950 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                
                <div className="mt-2 flex items-center justify-between gap-4 pt-1 border-t border-slate-100/20 text-[10px] text-slate-400">
                  <span>{m.time}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => handleCopy(m.text, m.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-500 hover:text-slate-900"
                    >
                      {copiedId === m.id ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copiedId === m.id ? 'Copiado' : 'Copiar Texto'}</span>
                    </button>
                  )}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="h-9 w-9 rounded-xl bg-accent-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3.5 justify-start">
              <div className="h-9 w-9 rounded-xl bg-primary-950 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-4 text-sm text-slate-500 flex items-center gap-2 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary-950" />
                <span>O NEXUS AI está a redigir a resposta pedagógica...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 px-2">Sugestões:</span>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.prompt)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 whitespace-nowrap transition-colors"
            >
              <s.icon size={13} className="text-primary-900" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte sobre regulamentos MINEDH, circulares, exames, propinas..." 
              className="bg-slate-50 border-slate-200 text-sm focus-visible:ring-primary-950"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading || !inputValue.trim()} 
              className="bg-primary-950 hover:bg-primary-900 text-white shrink-0 px-5"
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
