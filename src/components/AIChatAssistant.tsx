import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareCode, Send, Sparkles, Bot, User, RefreshCw, Zap, Lightbulb } from 'lucide-react';
import { ChatMessage, EVModel } from '../types';
import { sendChatMessage } from '../services/api';

interface AIChatAssistantProps {
  evModel: EVModel;
  currentBattery: number;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  evModel,
  currentBattery
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello! I am your **ZepGo AI Assistant**, powered by Gemini.
I can help calculate exact battery consumption, cold weather range drops, connector compatibility (CCS2 / NACS), and recommended charging stops for your **${evModel.name}**.

What EV journey questions can I answer for you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    `Can I reach Lake Tahoe with ${currentBattery}% battery in my ${evModel.name}?`,
    "How does cold weather affect my EV range?",
    "Explain DC fast charging speed curves above 80% battery.",
    "Which charger is cheapest and compatible with my vehicle?",
    "What is the difference between CCS2 and NACS connectors?"
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build context history
      const history = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text
      }));

      const replyText = await sendChatMessage(text, history);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold flex items-center gap-2">
              ZepGo Gemini AI Assistant
            </h1>
            <p className="text-xs text-slate-300">
              Expert EV journey advice, battery chemistry, range estimation, and charging protocols.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold bg-sky-500/10 border border-sky-400/20 px-3 py-1.5 rounded-full text-sky-300">
          <Zap className="w-3.5 h-3.5" />
          <span>Vehicle Context: {evModel.name}</span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                msg.sender === 'user' ? 'bg-slate-900' : 'bg-sky-600'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className={`block text-[10px] mt-2 ${
                  msg.sender === 'user' ? 'text-sky-200 text-right' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 text-xs">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span className="font-medium">ZepGo AI is analyzing battery parameters...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggested Questions Bar */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-[10px] font-bold text-slate-500 shrink-0 uppercase tracking-wider">Prompts:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-[11px] font-medium text-slate-700 whitespace-nowrap transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask ZepGo AI about range, chargers, or ${evModel.name}...`}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
