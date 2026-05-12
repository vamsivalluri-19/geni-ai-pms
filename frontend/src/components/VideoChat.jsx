import React, { useState, useRef, useEffect } from 'react';

export default function VideoChat({ socket, roomId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef();

  useEffect(() => {
    if (!socket) return;
    socket.on('chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off('chat-message');
    };
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const msg = { user: user?.name || 'HR', text: input, time: new Date().toLocaleTimeString() };
      socket.emit('chat-message', { roomId, msg });
      setMessages((prev) => [...prev, msg]);
      setInput('');
    }
  };

  return (
    <div className="vc-chat bg-slate-900 rounded-xl flex flex-col h-full min-h-[300px] w-full">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
         <h4 className="text-sm font-bold text-slate-200">Live Chat</h4>
         <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-400/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Connected
         </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">No messages yet. Say hi!</div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className="flex flex-col mb-1 text-sm bg-slate-800 p-2.5 rounded-xl border border-slate-700/50">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-bold text-indigo-400 text-xs">{m.user}</span>
                <span className="ml-2 text-[10px] text-slate-500">{m.time}</span>
              </div>
              <p className="text-slate-200">{m.text}</p>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="flex gap-2 relative">
          <input
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
          />
          <button className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
