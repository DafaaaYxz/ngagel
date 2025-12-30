
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, ChevronLeft, Terminal, Cpu } from 'lucide-react';
import { dataService } from '../services/dataService';
import { chatWithAdmin } from '../services/geminiService';
import { Admin, ChatMessage } from '../types';

const ChatView: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdmins(dataService.getAdmins());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedAdmin) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      text: input,
      timestamp: new Date(),
      isAdmin: false
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.slice(-5).map(m => ({
      role: m.isAdmin ? 'model' : 'user',
      text: m.text
    }));

    const responseText = await chatWithAdmin(selectedAdmin, input, history);
    
    setIsTyping(false);
    const adminMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      senderId: selectedAdmin.id,
      text: responseText,
      timestamp: new Date(),
      isAdmin: true
    };
    setMessages(prev => [...prev, adminMsg]);
  };

  if (!selectedAdmin) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tighter">SELECT AN <span className="text-red-600">ARCHITECT</span></h2>
          <p className="text-zinc-500">Initialize a direct neural link with one of our legendary maintainers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {admins.map(admin => (
            <button
              key={admin.id}
              onClick={() => setSelectedAdmin(admin)}
              className="glass p-6 rounded-[2.5rem] flex items-center gap-4 hover:border-red-600 transition-all text-left group"
            >
              <img src={admin.photoUrl} alt={admin.name} className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
              <div>
                <h3 className="font-bold text-lg">{admin.name}</h3>
                <p className="text-zinc-500 text-xs">@{admin.username}</p>
                <div className="flex items-center gap-1 mt-1">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Link</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[70vh] glass rounded-[3rem] overflow-hidden border-zinc-800 shadow-2xl relative">
      {/* Header */}
      <div className="p-6 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedAdmin(null)} className="p-2 hover:bg-zinc-900 rounded-xl text-zinc-500 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <img src={selectedAdmin.photoUrl} alt={selectedAdmin.name} className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-sm">{selectedAdmin.name}</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] text-green-500 font-bold tracking-widest uppercase">Encryption Established</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-700 font-mono text-[10px]">
           <Terminal size={12} />
           NODE_CHAT_v4.1
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow p-6 overflow-y-auto space-y-6 scroll-smooth"
      >
        <div className="text-center py-4">
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Session Started • {new Date().toLocaleTimeString()}</span>
        </div>
        
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] flex items-end gap-3 ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.isAdmin ? 'bg-red-900/30' : 'bg-zinc-800'}`}>
                {msg.isAdmin ? <Cpu size={14} className="text-red-500" /> : <User size={14} className="text-zinc-400" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.isAdmin 
                  ? 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-bl-none' 
                  : 'bg-red-600 text-white shadow-lg rounded-br-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 p-4 rounded-2xl rounded-bl-none border border-zinc-800 flex gap-1">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-6 bg-zinc-950/80 backdrop-blur-md border-t border-white/5 flex gap-4">
        <input 
          type="text" 
          placeholder={`Message ${selectedAdmin.name}...`}
          className="flex-grow bg-black/50 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-red-600 transition-colors"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:bg-zinc-800 text-white p-4 rounded-2xl transition-all red-glow"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default ChatView;
