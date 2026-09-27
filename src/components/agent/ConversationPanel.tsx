import React, { useState } from 'react';
import { ChatMessage } from '../../types/agent';
import { Send, Sparkles, Bot, User, Clock, AlertCircle } from 'lucide-react';

interface ConversationPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isInvestigating: boolean;
}

export const SUGGESTED_PROMPTS = [
  'Investigate the cholera signal in Edo State.',
  'Which LGAs have unusual cholera activity?',
  'Why has cholera risk increased?',
  'Compare current cholera activity with the historical baseline.',
  'What evidence supports this signal?',
  'What is the 14-day forecast?',
];

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  onSendMessage,
  isInvestigating,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isInvestigating) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSelectPrompt = (prompt: string) => {
    if (isInvestigating) return;
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      {/* Top Panel Banner */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-teal-400"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Investigation Dialog
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          Agent Mode: Structured Workflow
        </span>
      </div>

      {/* Suggested Prompts Shelf */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-925">
        <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span>Suggested Investigation Prompts:</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {SUGGESTED_PROMPTS.slice(0, 4).map((p, idx) => (
            <button
              key={idx}
              disabled={isInvestigating}
              onClick={() => handleSelectPrompt(p)}
              className="text-left text-xs px-2.5 py-1.5 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed truncate"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'agent' && (
              <div className="w-6 h-6 rounded-md bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white font-medium'
                  : 'bg-slate-950 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-[10px] opacity-75">
                <span>{msg.sender === 'user' ? 'Surveillance Officer' : 'POPU Agent'}</span>
                <span>{msg.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isInvestigating && (
          <div className="flex items-center gap-2.5 p-3 rounded bg-slate-950/70 border border-teal-500/30 text-teal-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span>POPU Agent is executing investigation workflow...</span>
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-950">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isInvestigating}
            placeholder="E.g. Investigate the cholera signal in Edo State..."
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2.5 pl-3 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isInvestigating}
            className="absolute right-1.5 p-1.5 text-teal-400 hover:text-teal-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
          <span>Targeting: Diseases &amp; LGAs across Nigeria</span>
          <span className="font-mono">Ready</span>
        </div>
      </form>
    </div>
  );
};
