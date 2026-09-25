import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  MessageSquare,
  X,
  Minus,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Flame,
  Coins,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { askAssistant } from '../../services/assistantApi';
import styles from './VELoopAssistant.module.css';

const INITIAL_SUGGESTIONS = [
  '⏱️ Agla reward kab milega?',
  '🎁 Day 7 Grand Prize kya hai?',
  '🪙 Day 1 & Day 2 rewards?',
  '⚠️ Streak break hui toh?',
  '💼 Coins & Vouchers kahan hain?',
  '🔄 Timer sync nahi ho raha?',
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: 'Namaste! Main hoon VELoop Assistant 🚀 Daily Streaks, countdown timer aur rewards ladder me guide karne ke liye tayyar hoon. Aapka koi bhi sawaal ho, toh batayein!',
    timestamp: 'Just now',
  },
];

const VELoopAssistant = () => {
  const { user, walletSummary } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Play subtle web audio notification chime
  const playChime = () => {
    if (isMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      // Audio autoplay policy or context error ignored
    }
  };

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opening chat
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  const handleSend = async (textToSend = null) => {
    const query = typeof textToSend === 'string' ? textToSend : inputText;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const userContext = {
        name: user?.name,
        veBalance: walletSummary?.veBalance || 0,
      };

      const res = await askAssistant(query.trim(), userContext);

      // Natural conversational delay for smooth UX
      setTimeout(() => {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        playChime();

        if (res.suggested && res.suggested.length > 0) {
          setSuggestions(res.suggested);
        }
      }, 450);
    } catch (error) {
      setTimeout(() => {
        const errorMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Maaf kijiye, ek temporary connection issue aaya. Kripya thodi der baad dobara poochiye! 🔄',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsTyping(false);
      }, 350);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setSuggestions(INITIAL_SUGGESTIONS);
    setInputText('');
  };

  return (
    <div className={styles.assistantContainer}>
      {/* Floating Teaser Prompt on Initial Load */}
      {showTeaser && !isOpen && (
        <div className={styles.teaserBubble} onClick={() => setIsOpen(true)}>
          <span className={styles.teaserText}>
            👋 Need streak help? <span>Ask VELoop Assistant!</span>
          </span>
          <button
            className={styles.teaserClose}
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="veloop-assistant-trigger"
        className={styles.triggerButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle VELoop Assistant"
        title="Chat with VELoop Assistant"
      >
        <div className={styles.botIconPulse}>
          {isOpen ? <X size={26} /> : <Bot size={28} />}
          <span className={styles.onlineBadge} />
        </div>
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-modal="true">
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.avatarCircle}>
                <Bot size={20} />
                <span className={styles.avatarStatus} />
              </div>
              <div className={styles.headerInfo}>
                <h4>
                  VELoop Assistant <span className={styles.botTag}>AI Bot</span>
                </h4>
                <p>
                  <span className={styles.liveDot} /> Online • Streak & Rewards Guide
                </p>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button
                className={styles.headerBtn}
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                className={styles.headerBtn}
                onClick={handleResetChat}
                title="Restart Chat"
                aria-label="Restart Chat"
              >
                <RotateCcw size={14} />
              </button>
              <button
                className={styles.headerBtn}
                onClick={() => setIsOpen(false)}
                title="Minimize Chat"
                aria-label="Minimize Chat"
              >
                <Minus size={15} />
              </button>
            </div>
          </div>

          {/* Context Banner: If user is logged in */}
          {user && (
            <div className={styles.contextBanner}>
              <div className={styles.contextPill}>
                <span>Hi, {user.name?.split(' ')[0] || 'Friend'}!</span>
              </div>
              <div className={styles.contextPill}>
                <Coins size={13} color="#FBBF24" />
                <span>{walletSummary?.veBalance || 0} VEs</span>
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.sender === 'user' ? styles.userRow : styles.botRow
                }`}
              >
                {msg.sender === 'bot' && (
                  <div className={styles.botAvatarMini}>
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`${styles.bubble} ${
                    msg.sender === 'user' ? styles.userBubble : styles.botBubble
                  }`}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <span className={styles.msgTime}>{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.messageRow} ${styles.botRow}`}>
                <div className={styles.botAvatarMini}>
                  <Bot size={14} />
                </div>
                <div className={styles.typingIndicator}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Horizontal Scroll */}
          <div className={styles.quickChipsArea}>
            <div className={styles.quickChipsTitle}>
              <Sparkles size={12} color="#FBBF24" /> Quick Platform Questions:
            </div>
            <div className={styles.chipsScroll}>
              {suggestions.map((chip, idx) => (
                <button
                  key={idx}
                  className={styles.chipBtn}
                  onClick={() => handleSend(chip.replace(/^[^\w\s]+/, '').trim())}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            className={styles.chatInputForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className={styles.chatInput}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask in Hindi or English (e.g. Agla reward kab milega?)..."
              maxLength={200}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!inputText.trim() || isTyping}
              aria-label="Send Message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VELoopAssistant;
