import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquare, X, Minus, Send, RotateCcw, Sparkles, Coins, Shield, ShoppingBag, Trophy } from 'lucide-react';
import { sendChatMessage, getStreakStatus } from '../services/streakApi';
import { useAuth } from '../context/AuthContext';

const QUICK_QUESTIONS = [
  '⏱️ Agla reward kab unlock hoga?',
  '🛡️ Streak Freeze kya hai aur cost kitni hai?',
  '🛍️ Rewards Store me kya redeem kar sakte hain?',
  '🎁 Day 7 Grand Prize kaise milta hai?',
  '🏆 Leaderboard podium ranks kaise milte hain?',
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Namaste! Main hoon VELoop Assistant 🚀 Cooldown timer, Streak Freeze Shield (50 VEs), Rewards Store, ya daily rewards ladder se related koi bhi sawaal poochiye!',
    timestamp: 'Just now',
  },
];

const AIChatWidget = () => {
  const { user, walletSummary } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [liveStreakData, setLiveStreakData] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Fetch live streak data when chat widget opens
  useEffect(() => {
    if (isOpen && user) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);

      getStreakStatus()
        .then((res) => {
          if (res) {
            setLiveStreakData(res);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, user]);

  const handleSend = async (queryText = null) => {
    const text = typeof queryText === 'string' ? queryText : inputValue;
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      // Gather live user context
      let userContext = null;
      if (user) {
        let cooldownStr = '00:00:00';
        if (liveStreakData?.remainingCooldownMs > 0) {
          const hours = Math.floor(liveStreakData.remainingCooldownMs / (1000 * 60 * 60));
          const mins = Math.floor((liveStreakData.remainingCooldownMs % (1000 * 60 * 60)) / (1000 * 60));
          cooldownStr = `${hours}h ${mins}m`;
        } else if (liveStreakData?.canClaim) {
          cooldownStr = 'Ready to Claim!';
        }

        userContext = {
          userName: user.name,
          currentStreak: liveStreakData?.currentStreak ?? 0,
          walletVEs: walletSummary?.veBalance ?? 0,
          hasFreeze: Boolean(liveStreakData?.hasFreeze),
          cooldownTime: cooldownStr,
        };
      }

      const res = await sendChatMessage(text.trim(), userContext);
      const reply =
        res?.reply ||
        res?.data?.reply ||
        'Main abhi aapke request ko process nahi kar saka. Kripya dobara try karein! 🔄';

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Network issue ke kaaran reply nahi mil saka. Page refresh karke check karein! 🔄',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInputValue('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      <button
        id="veloop-ai-chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 40%, #7C3AED 100%)',
          border: '2px solid rgba(251, 191, 36, 0.5)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(245, 158, 11, 0.4), 0 0 15px rgba(124, 58, 237, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          outline: 'none',
          position: 'relative',
        }}
        aria-label="Toggle AI Chat Widget"
      >
        {isOpen ? <X size={26} /> : <Bot size={28} />}
        {/* Pulse online ring */}
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '13px',
            height: '13px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            border: '2px solid #0D0721',
            boxShadow: '0 0 8px #10B981',
          }}
        />
      </button>

      {/* Chat Popup Box */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '76px',
            right: '0',
            width: '380px',
            height: '560px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 110px)',
            background: 'rgba(13, 7, 33, 0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(245, 158, 11, 0.2)',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(23, 14, 56, 0.98) 0%, rgba(13, 7, 33, 0.98) 100%)',
              borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #7C3AED 100%)',
                  border: '1px solid #FBBF24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 0 12px rgba(245, 158, 11, 0.35)',
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  VELoop Assistant
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.5)',
                      color: '#FBBF24',
                      fontSize: '0.65rem',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      fontWeight: 700,
                    }}
                  >
                    Gemini 2.5
                  </span>
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.74rem',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#10B981',
                      borderRadius: '50%',
                    }}
                  />
                  Online • Cooldown & Rewards AI
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleResetChat}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  borderRadius: '8px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Restart Chat"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94A3B8',
                  borderRadius: '8px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Minimize"
              >
                <Minus size={15} />
              </button>
            </div>
          </div>

          {/* User Status Bar */}
          {user && (
            <div
              style={{
                background: 'rgba(23, 14, 56, 0.65)',
                borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.74rem',
                color: '#94A3B8',
              }}
            >
              <span>Hi, {user.name?.split(' ')[0] || 'Member'}!</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FBBF24', fontWeight: 700 }}>
                <Coins size={13} /> {walletSummary?.veBalance || 0} VEs
              </span>
            </div>
          )}

          {/* Chat Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  maxWidth: '88%',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                }}
              >
                {msg.sender === 'bot' && (
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #F59E0B 0%, #7C3AED 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Bot size={14} />
                  </div>
                )}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '14px',
                    fontSize: '0.84rem',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                    background:
                      msg.sender === 'user'
                        ? 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)'
                        : 'rgba(23, 14, 56, 0.95)',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#F8FAFC',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(245, 158, 11, 0.25)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.65rem',
                      color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.6)' : '#94A3B8',
                      marginTop: '4px',
                      textAlign: msg.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0,
                  }}
                >
                  <Bot size={14} />
                </div>
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: '14px',
                    background: 'rgba(23, 14, 56, 0.9)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#FDE68A' }}>VELoop Assistant is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Platform Chips */}
          <div
            style={{
              padding: '0 14px 10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} color="#FBBF24" /> Quick Platform Help:
            </div>
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '4px',
              }}
            >
              {QUICK_QUESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.replace(/^[^\w\s]+/, '').trim())}
                  style={{
                    background: 'rgba(23, 14, 56, 0.8)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#FDE68A',
                    fontSize: '0.72rem',
                    padding: '4px 10px',
                    borderRadius: '16px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              background: 'rgba(23, 14, 56, 0.98)',
              borderTop: '1px solid rgba(245, 158, 11, 0.25)',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask in Hindi or English (e.g. Cooldown timer?)..."
              maxLength={200}
              style={{
                flex: 1,
                background: 'rgba(13, 7, 33, 0.85)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '9px 12px',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #7C3AED 100%)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !inputValue.trim() || loading ? 'not-allowed' : 'pointer',
                opacity: !inputValue.trim() || loading ? 0.5 : 1,
              }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatWidget;
