import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Wrench,
  Sparkles,
  Bot,
  User,
  Phone,
  HelpCircle,
  Car,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerSupportChat: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendChatMessage,
    t,
    activeVehicle,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'How do I wire a 4K Dashcam safely in Thar / Nexon?',
    'What accessories fit my Indian car?',
    'How does Cash on Delivery (COD) and UPI work?',
    'What is your warranty and return policy in India?',
  ];

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;
    sendChatMessage(text.trim());
    setInputText('');
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isChatOpen && (
        <button
          id="open-support-chat-btn"
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3.5 sm:p-4 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-xl shadow-amber-500/20 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group font-black"
          title="Automotive Support Chat"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-neutral-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-neutral-950 animate-pulse" />
          </div>
          <span className="font-bold text-xs hidden sm:inline-block pr-1 font-display text-neutral-950">
            Automotive Tech Support
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-md h-[560px] max-h-[85vh] bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 text-neutral-200">
          {/* Chat Header */}
          <div className="p-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-neutral-950" />
              </div>
              <div>
                <h4 className="font-bold text-sm font-display flex items-center gap-1.5 text-white">
                  Apex Master Tech Bot
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-neutral-400">
                  {activeVehicle
                    ? `Fitment Advisor for ${activeVehicle.make} ${activeVehicle.model}`
                    : '24/7 Car Electronics & Fitment Specialist'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-950/60 text-xs">
            {chatMessages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${
                    isBot ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mb-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      isBot
                        ? 'bg-neutral-850 text-neutral-200 border border-neutral-750 shadow-xs'
                        : 'bg-amber-500 text-neutral-950 rounded-br-xs font-semibold shadow-xs'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isBot ? 'text-neutral-400' : 'text-neutral-900/75'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Chips */}
          <div className="p-2 border-t border-neutral-800 bg-neutral-900 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-[11px] font-semibold text-neutral-300 hover:border-amber-500 hover:text-white shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about fitment, wiring, delivery..."
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-neutral-700 bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-50 shadow-sm transition-transform active:scale-98"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
