import React, { useState, useEffect, useRef } from 'react';
import { Send, ShieldCheck, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';
import { projectApi } from '../api/axios';

export default function ProjectChat({ projectId, currentUserId, isTeamLead }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await projectApi.getMessages(projectId);
      setMessages(res.data || []);
      setError('');
    } catch (err) {
      console.warn('Chat poll error:', err);
      setError(err.message || 'Failed to load messages.');
    } finally {
      if (isInitial) {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    }
  };

  // Poll every 3 seconds
  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [projectId]);

  // Scroll to bottom when message count increases
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending) return;

    const content = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await projectApi.sendMessage(projectId, content);
      setMessages((prev) => [...prev, res.data]);
      setTimeout(scrollToBottom, 50);
    } catch (err) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col h-[600px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 px-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <MessageSquare className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Project Group Discussion</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live polling (3s) • Full conversation history visible to all accepted teammates</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchMessages(false)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          title="Refresh Messages"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
        {loading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading team chat history...</span>
          </div>
        ) : error && messages.length === 0 ? (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 stroke-[1.5]" />
            <h4 className="font-semibold text-sm text-slate-600">No messages yet</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Be the first to say hello, propose project milestones, or share repository links!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = String(msg.senderId) === String(currentUserId);
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isMe
                      ? 'bg-indigo-600 text-white'
                      : msg.senderRole === 'TEAM_LEAD'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                  title={`${msg.senderName} (${msg.senderRoll})`}
                >
                  {msg.senderName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                {/* Bubble */}
                <div>
                  <div
                    className={`flex items-center gap-1.5 mb-1 ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    {msg.senderRole === 'TEAM_LEAD' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        <span>Lead</span>
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatMessageTime(msg.sentAt)}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-slate-100 bg-white flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Type a message to your team... (Press Enter to send)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || sending}
          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-colors shadow-xs"
          title="Send Message"
        >
          {sending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
