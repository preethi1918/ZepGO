import React, { useState } from 'react';
import { Send, Zap, Bot, User, ArrowLeft } from 'lucide-react';

interface AiAssistantScreenViewProps {
  onBack: () => void;
}

export const AiAssistantScreenView: React.FC<AiAssistantScreenViewProps> = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am ZepGO AI. Ask me about range optimization, charger queue forecasts, or route strategies.',
    },
    {
      sender: 'user',
      text: 'Will I reach Coimbatore safely with 72% battery in my Nexon EV?',
    },
    {
      sender: 'ai',
      text: 'Yes! At 72% SOC (~225 km real range), you require 1 fast charger stop at Salem (at 214 km). I predict 3 of 4 plugs will be open at 1:30 PM with 94% confidence.',
    },
  ]);
  const [input, setInput] = useState('');

  const quickPrompts = [
    'Find 100kW+ fast chargers near Salem',
    'What is my optimal charging speed for 20-80%?',
    'Check Ghat section battery elevation impact',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: query },
      {
        sender: 'ai',
        text: `ZepGO Neural Engine evaluated "${query}". All predicted charger availability metrics are 98.4% verified for NH544 route.`,
      },
    ]);
    setInput('');
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] text-[#0B0F0D] flex flex-col justify-between p-4 select-none animate-fadeIn space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-[#0B0F0D]"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#0B0F0D] rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-[#22C55E] fill-[#22C55E]" />
          </div>
          <span className="font-extrabold text-sm text-[#0B0F0D]">ZepGO AI Assistant</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user' ? 'bg-[#0B0F0D] text-white' : 'bg-[#22C55E] text-[#0B0F0D]'
              }`}
            >
              {m.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className={`max-w-[78%] p-3.5 rounded-[18px] text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#0B0F0D] text-white rounded-tr-none'
                  : 'bg-white text-[#0B0F0D] border border-[#E5E7EB] shadow-sm rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-[11px] font-extrabold text-[#22C55E] bg-[#EAF8EF] border border-[#22C55E]/30 px-3 py-1.5 rounded-full shrink-0 hover:bg-[#22C55E] hover:text-white transition-all cursor-pointer"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center bg-white border border-[#E5E7EB] rounded-[18px] p-2 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask ZepGO AI anything..."
          className="w-full pl-3 text-xs font-semibold text-[#0B0F0D] focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          className="w-9 h-9 bg-[#0B0F0D] hover:bg-[#1A221E] text-[#22C55E] rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};
