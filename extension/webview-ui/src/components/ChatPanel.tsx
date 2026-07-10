import { FormEvent, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { postToHost } from '../vscode';

interface Props {
  loading: boolean;
  reply: string | null;
  error?: string;
  onClearReply: () => void;
}

export function ChatPanel({ loading, reply, error, onClearReply }: Props) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Ask about markets, technology, research, or geopolitics. I use live NewsDash intelligence.',
    },
  ]);

  useEffect(() => {
    if (!reply) return;
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    onClearReply();
  }, [reply, onClearReply]);

  useEffect(() => {
    if (!error) return;
    setMessages((prev) => [...prev, { role: 'assistant', content: `Unable to respond: ${error}` }]);
    onClearReply();
  }, [error, onClearReply]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    postToHost({
      type: 'chat',
      messages: next.filter((m) => m.role !== 'system'),
    });
  };

  return (
    <div>
      <h2 className="page-title">AI Chat</h2>
      <p className="page-sub">Conversational briefing over live sector intelligence.</p>
      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={`${m.role}-${i}`} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="bubble assistant">
            <div className="spinner" style={{ width: 16, height: 16, display: 'inline-block', verticalAlign: 'middle' }} />{' '}
            Thinking…
          </div>
        )}
      </div>
      <form className="chat-form" onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about today’s critical signals…"
        />
        <button type="submit" className="btn primary" disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
}
