'use client';

import { useState, useRef, useEffect } from 'react';
import { IconBrain, IconSend, IconSparkles, IconCalendar, IconBook2, IconFileText, IconBolt } from '@tabler/icons-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  { icon: IconCalendar, text: 'Add an exam event for next week' },
  { icon: IconBook2,    text: 'Create a course plan for CCNA' },
  { icon: IconFileText, text: 'Add notes about subnetting' },
  { icon: IconBolt,     text: "What should I study today?" },
];

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "Hi! I'm your PaceUp AI assistant. I can help you organize your study plan, create events, add notes, manage courses, and set deadlines.\n\nThis feature is coming soon — stay tuned!",
};

export default function AIAssistantPage() {
  const [messages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      maxWidth: 760, margin: '0 auto', gap: 0,
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--accent) 0%, #818CF8 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px var(--accent-glow)',
        }}>
          <IconBrain size={18} color="#fff" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            AI Assistant
          </h1>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-3)' }}>
            Organize your study app with natural language
          </p>
        </div>
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 20,
          background: 'var(--color-amber-subtle)', border: '1px solid var(--color-amber-border)',
        }}>
          <IconSparkles size={10} color="var(--color-amber)" />
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-amber)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Coming soon
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12,
        paddingBottom: 12,
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginRight: 10, marginTop: 2,
                background: 'linear-gradient(135deg, var(--accent) 0%, #818CF8 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconBrain size={14} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth: '78%',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
              background: msg.role === 'user'
                ? 'var(--accent)'
                : 'var(--bg-surface)',
              border: msg.role === 'user'
                ? 'none'
                : '1px solid var(--border-default)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-1)',
              fontSize: 13, lineHeight: 1.6,
              boxShadow: 'var(--shadow-card)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 12, flexShrink: 0,
      }}>
        {SUGGESTIONS.map(({ icon: Icon, text }) => (
          <button
            key={text}
            type="button"
            onClick={() => setInput(text)}
            disabled
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 12px', borderRadius: 10,
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              cursor: 'not-allowed', opacity: 0.55,
              fontSize: 11, fontWeight: 500, color: 'var(--text-2)',
              textAlign: 'left', fontFamily: 'inherit',
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <Icon size={14} color="var(--accent)" style={{ flexShrink: 0 }} />
            {text}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 8, flexShrink: 0,
        padding: '12px 14px',
        background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
        borderRadius: 14, boxShadow: 'var(--shadow-elevated)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me to create an event, add a note, organize your study plan…"
          disabled
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontSize: 13, color: 'var(--text-1)', fontFamily: 'inherit',
            cursor: 'not-allowed',
          }}
        />
        <button
          type="button"
          disabled
          style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: input.trim() ? 'var(--accent)' : 'var(--bg-elevated)',
            border: 'none', cursor: 'not-allowed', opacity: 0.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 150ms ease',
          }}
        >
          <IconSend size={15} color={input.trim() ? '#fff' : 'var(--text-3)'} />
        </button>
      </div>

      <p style={{ margin: '8px 0 0', fontSize: 10, color: 'var(--text-4)', textAlign: 'center' }}>
        AI features are not yet active. This is a preview of the upcoming assistant.
      </p>
    </div>
  );
}
