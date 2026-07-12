"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TARA_AVATAR = "/tara.png";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function TaraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Tara, your AssetFlow AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Filter out only role and content to send to API (in case we add id/timestamp later)
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error || 'Failed to communicate with Tara.'}` }]);
        return;
      }

      if (data.choices && data.choices[0]?.message) {
        setMessages(prev => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process that right now." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am having trouble connecting to my servers." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-odoo-100 flex items-center justify-center overflow-hidden shadow-sm border border-odoo-200">
                  <img src={TARA_AVATAR} alt="Tara" className="w-full h-full object-cover scale-110 translate-y-1" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">Tara</h3>
                  <p className="text-xs text-odoo-600 font-bold tracking-wide uppercase mt-0.5">AI Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${
                    msg.role === "assistant" ? "bg-odoo-100 border border-odoo-200" : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {msg.role === "assistant" ? (
                      <img src={TARA_AVATAR} alt="Tara" className="w-full h-full object-cover scale-110 translate-y-1" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[85%] shadow-sm overflow-x-auto ${
                    msg.role === "user" 
                      ? "bg-odoo-600 text-white rounded-tr-sm" 
                      : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm prose prose-sm prose-slate"
                  }`}>
                    {msg.role === "user" ? msg.content : (
                      <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                          table: ({node, ...props}) => <table className="w-full text-left border-collapse my-2" {...props} />,
                          th: ({node, ...props}) => <th className="border-b border-slate-200 pb-1 text-xs font-bold uppercase text-slate-500" {...props} />,
                          td: ({node, ...props}) => <td className="border-b border-slate-100 py-1" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-odoo-100 border border-odoo-200 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                    <img src={TARA_AVATAR} alt="Tara" className="w-full h-full object-cover scale-110 translate-y-1" />
                  </div>
                  <div className="px-5 py-4 bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Tara anything..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:border-odoo-500 focus:bg-white transition-all shadow-inner shadow-slate-100"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-odoo-600 text-white rounded-full hover:bg-odoo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        
        {/* Greeting Bubble */}
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
          className="bg-white px-5 py-3.5 rounded-2xl rounded-br-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all origin-bottom-right"
          onClick={() => setIsOpen(true)}
        >
          <p className="text-sm font-bold text-slate-800">Hi, I'm Tara! 👋</p>
          <p className="text-xs font-medium text-slate-500 mt-0.5">How can I help you today?</p>
        </motion.div>

        {/* Floating Avatar Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(113,75,103,0.3)] hover:scale-105 active:scale-95 transition-all border-2 border-odoo-600 p-0.5 overflow-hidden"
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-odoo-100 flex items-center justify-center">
             <img src={TARA_AVATAR} alt="Tara" className="w-full h-full object-cover scale-110 translate-y-2" />
          </div>
        </button>
      </div>
    </>
  );
}
