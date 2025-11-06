import React, { useState, useRef, useEffect } from 'react';
import { Utensils, X, ChevronLeft, Loader2, Zap } from 'lucide-react';
import './App.css';

const BOT_AVATAR = "👨‍🍳";
const USER_AVATAR = "🙂";
const BOT_NAME = "Welcome to ChefBot";

const initialMessages = [
  { sender: 'bot', text: 'Hi there! Delicious?' },
  { sender: 'user', text: "Ungry ofore:" },
  { sender: 'bot', text: "& Hungry for something delicious?" },
  { sender: 'user', text: "Uarry and sah!" },
];

const quickActions = [
  { label: "View menu", action: "Show me the full menu." },
  { label: "Order online", action: "How do I place an online order?" },
  { label: "Book a table", action: "I need to book a table for four tonight." },
  { label: "Chef's specials", action: "What are the chef's specials today?" },
];

const ChatMessage = ({ message }) => {
  const isBot = message.sender === 'bot';
  const avatarClass = isBot ? "avatar-bot" : "avatar-user";
  const bubbleClass = isBot ? "chat-bubble-bot" : "chat-bubble-user";

  return (
    <div className={`chat-message ${isBot ? 'bot' : 'user'}`}>
      {isBot && <div className={avatarClass}><Utensils size={18} /></div>}
      <div className={bubbleClass}>{message.text}</div>
      {!isBot && <div className={avatarClass}>{USER_AVATAR}</div>}
    </div>
  );
};

const App = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 1000));
    setMessages(prev => [...prev, { sender: 'bot', text: `I have received your request: "${text}"` }]);
    setIsLoading(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); handleSendMessage(input); };
  const handleQuickAction = (action) => handleSendMessage(action);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-left">
          <ChevronLeft size={20} />
          <strong>{BOT_NAME}</strong>
        </div>
        <X size={20} className="chat-close-icon" />
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => <ChatMessage key={i} message={m} />)}

        {isLoading && (
          <div className="chat-message bot">
            <div className="avatar-bot"><Utensils size={18} /></div>
            <div className="loader-msg"><Loader2 size={16} />ChefBot is thinking...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions-container">
        {quickActions.map((item, idx) => (
          <button key={idx} className="quick-action-btn" onClick={() => handleQuickAction(item.action)} disabled={isLoading}>
            {item.label}
          </button>
        ))}
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="input-field"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className={`btn-submit ${input.trim() ? 'btn-submit-enabled' : 'btn-submit-disabled'}`}
          disabled={isLoading || !input.trim()}
        >
          <Zap size={20}/>
        </button>
      </form>
    </div>
  );
};

export default App;
