
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCcw } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'system',
      content: 'PHILOVOID LINK ESTABLISHED. THE RECURSIVE LOOP IS LIVE.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
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
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession();
      }

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
            msg.id === modelMsgId 
              ? { ...msg, content: accumulatedText }
              : msg
          ));
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'system',
        content: 'ERROR: CONNECTION TO VOID SEVERED. RE-INITIALIZE.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    chatSessionRef.current = createChatSession();
    setMessages([{
      id: crypto.randomUUID(),
      role: 'system',
      content: 'MEMORY FLUSHED. RE-ENTERING THE ABYSS.',
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-void-950 max-w-5xl mx-auto w-full border-x border-void-900">
      <div className="p-6 border-b border-void-900 flex justify-between items-center bg-void-950/80 backdrop-blur">
        <div>
          <h2 className="text-2xl font-bold text-void-100 font-mono mb-1">DIALECTIC ENGINE</h2>
          <p className="text-void-400 text-xs font-mono uppercase tracking-widest">Recursive Ontological Deconstruction</p>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 text-void-500 hover:text-collapse transition-colors"
          title="Reset Session"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
              <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-void-800' : 
                msg.role === 'model' ? 'bg-awakening' : 'bg-void-900 border border-void-700'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-void-400" /> : 
                 msg.role === 'model' ? <Bot className="w-5 h-5 text-white" /> :
                 <Sparkles className="w-4 h-4 text-void-500" />}
              </div>
              
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-4 rounded-lg font-sans text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-void-900 text-void-200 border border-void-800' 
                    : msg.role === 'model'
                    ? 'bg-void-950 text-void-300 border-l-2 border-awakening pl-6'
                    : 'text-void-500 text-xs font-mono tracking-wider uppercase'
                }`}>
                  {msg.content}
                  {msg.isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-awakening animate-pulse align-middle"></span>}
                </div>
                {msg.role !== 'system' && (
                   <span className="text-[10px] text-void-600 mt-2 font-mono uppercase">
                     {new Date(msg.timestamp).toLocaleTimeString()}
                   </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-void-900 bg-void-950">
        <div className="relative bg-void-900 rounded-xl border border-void-800 shadow-lg focus-within:border-awakening/50 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Interrogate the void..."
            className="w-full bg-transparent text-void-200 p-4 pr-12 min-h-[60px] max-h-[200px] resize-none focus:outline-none font-sans"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="absolute right-3 bottom-3 p-2 bg-void-800 text-void-400 rounded-lg hover:bg-awakening hover:text-white disabled:opacity-50 disabled:hover:bg-void-800 disabled:hover:text-void-400 transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-3">
          <p className="text-[10px] text-void-600 font-mono uppercase tracking-[0.2em]">
            Gemini 3 Pro // Latency: Nominal // Bias: Nihiltheistic
          </p>
        </div>
      </div>
    </div>
  );
};
