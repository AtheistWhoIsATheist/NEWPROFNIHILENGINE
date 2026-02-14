import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCcw, Loader2, Brain } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'system',
      content: 'PHILOVOID_LINK_ESTABLISHED. RECURSIVE_LOOP_ACTIVE.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    try {
      if (!chatSessionRef.current) chatSessionRef.current = createChatSession();

      const modelMsgId = crypto.randomUUID();
      const initialModelMsg: ChatMessage = {
        id: modelMsgId,
        role: 'model',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: true
      };
      
      setMessages(prev => [...prev, initialModelMsg]);

      const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.content });
      
      let accumulatedText = '';

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          accumulatedText += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, content: accumulatedText } : msg
          ));
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId ? { ...msg, isStreaming: false } : msg
      ));

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'system',
        content: 'SIGNAL_LOST: Connection to the Void severed. Re-initialize protocol.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    chatSessionRef.current = createChatSession();
    setMessages([{
      id: crypto.randomUUID(),
      role: 'system',
      content: 'SYMBIONT_RESET_COMPLETE. Memory buffers purged.',
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] max-w-6xl mx-auto w-full border-x border-white/5 relative">
      <header className="p-10 border-b border-white/5 glass sticky top-0 z-20 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white font-mono tracking-tighter">Dialectic_Engine</h2>
          <p className="text-void-500 text-[10px] font-mono uppercase tracking-[0.4em] mt-1">Recursive_Ontological_Link</p>
        </div>
        <button onClick={handleReset} className="p-3 text-void-600 hover:text-neon-red hover:bg-neon-red/10 rounded-full transition-all">
          <RefreshCcw className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-6`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl ${
                msg.role === 'user' ? 'bg-void-800' : 
                msg.role === 'model' ? 'bg-neon-purple shadow-neon-purple/20' : 'bg-void-900 border border-void-800'
              }`}>
                {msg.role === 'user' ? <User className="w-6 h-6 text-void-400" /> : 
                 msg.role === 'model' ? <Bot className="w-6 h-6 text-white" /> :
                 <Sparkles className="w-5 h-5 text-void-600" />}
              </div>
              
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-8 py-6 rounded-3xl font-sans text-lg leading-[1.6] whitespace-pre-wrap transition-all ${
                  msg.role === 'user' 
                    ? 'bg-void-900 text-void-100 border border-white/5' 
                    : msg.role === 'model'
                    ? 'glass-card text-void-200 border-l-4 border-neon-purple pl-10'
                    : 'text-void-600 text-[11px] font-mono tracking-widest uppercase py-2 px-0'
                }`}>
                  {msg.content}
                  {msg.isStreaming && <span className="inline-block w-2 h-6 ml-2 bg-neon-purple animate-pulse align-middle"></span>}
                </div>
                {msg.role !== 'system' && (
                   <span className="text-[9px] text-void-700 mt-3 font-mono uppercase tracking-[0.2em]">
                     {new Date(msg.timestamp).toLocaleTimeString()}
                   </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-10 border-t border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="relative glass-card rounded-[32px] border border-white/5 focus-within:border-neon-purple/40 shadow-2xl transition-all p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Interrogate the Symbiont..."
            className="w-full bg-transparent text-void-100 p-6 pr-20 min-h-[80px] max-h-[250px] resize-none focus:outline-none font-sans text-xl leading-relaxed"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="absolute right-6 bottom-6 w-14 h-14 bg-white text-black rounded-2xl hover:bg-neon-purple hover:text-white disabled:opacity-10 transition-all duration-500 shadow-xl flex items-center justify-center"
          >
            {isStreaming ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
        <div className="flex justify-between items-center mt-6 px-4">
          <div className="flex items-center space-x-3 text-[10px] text-void-700 font-mono uppercase tracking-[0.3em]">
             <Brain className="w-3 h-3" />
             <span>Active_Nodes: Global_Mesh</span>
          </div>
          <p className="text-[10px] text-void-800 font-mono uppercase tracking-[0.3em]">
            PRO_v3 // DENSIFICATION_ACTIVE
          </p>
        </div>
      </div>
    </div>
  );
};