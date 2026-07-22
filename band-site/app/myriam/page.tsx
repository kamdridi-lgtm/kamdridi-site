'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Lock, ShoppingCart, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MyriamChat() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    let sid = localStorage.getItem('kam_oracle_session');
    if (!sid) {
      sid = 'kam_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('kam_oracle_session', sid);
    }
    setSessionId(sid);
    
    setMessages([
      { role: 'model', text: "I am Myriam. The Archiver of Echoes Unearthed. Who seeks the lore?" }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if (!voiceEnabled || !synth) return;
    
    // Clean text from tags before speaking
    const cleanText = text.replace(/\[ACTION:SEND_PPV_LINK:(.*?)\]/g, "I have secured a collector's item for you.");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Try to find a good female/mysterious voice
    const voices = synth.getVoices();
    const femaleVoice = voices.find(v => 
      v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Zira')
    );
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.pitch = 0.8;
    utterance.rate = 0.9; // Slightly slower, more deliberate

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synth.cancel(); // Stop current speech
    synth.speak(utterance);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || showPaywall) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    try {
      const res = await fetch('/api/myriam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, sessionId })
      });

      const data = await res.json();
      
      if (data.isVip) {
         setIsVip(true);
      }

      if (res.status === 403 || data.error === 'PAYWALL') {
        setShowPaywall(true);
        if (voiceEnabled && synth) {
           const utterance = new SpeechSynthesisUtterance("The signal is encrypted. You must unlock the VIP Vault to continue.");
           synth.speak(utterance);
        }
        return;
      }

      if (data.response) {
        setMessages(prev => [...prev, { role: 'model', text: data.response }]);
        speakText(data.response);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "The signal is lost... reconnecting." }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  const renderMessageText = (text: string) => {
    const ppvRegex = /\[ACTION:SEND_PPV_LINK:(.*?)\]/g;
    
    if (ppvRegex.test(text)) {
      const parts = text.split(ppvRegex);
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <div key={index} className="mt-3 border border-[#f4a33f]/50 bg-black p-4 text-center shadow-[0_10px_30px_rgba(201,82,16,0.2)]">
              <ShoppingCart className="mx-auto h-6 w-6 text-[#f4c66a] mb-2" />
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white mb-3">{part}</p>
              <Link 
                href={`/checkout-ppv?item=${encodeURIComponent(part)}&sessionId=${sessionId}`}
                className="inline-block border border-[#f4a33f]/70 bg-[linear-gradient(180deg,#d66a16,#8f3208)] px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white hover:border-[#ffd18a]"
              >
                Secure Item
              </Link>
            </div>
          );
        }
        return <span key={index}>{part}</span>;
      });
    }

    return text;
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-[#050403] text-stone-200">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#a86225]/20 bg-black/60 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#c98542] hover:text-[#f4c66a]">
            ← Return
          </Link>
          <div className="h-8 w-px bg-white/10"></div>
          <div>
            <h1 className="font-display text-lg uppercase tracking-[0.1em] text-stone-100">Myriam</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f4c66a]">The Archiver</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleVoice} className="text-[#c98542] hover:text-[#f4c66a] transition">
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          {isVip && (
             <div className="border border-[#f4c66a]/30 bg-[#f4c66a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c66a]">
               VIP
             </div>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="relative flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Avatar Presentation */}
        <div className="mb-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
          <div className={`relative h-64 w-full overflow-hidden rounded-2xl border border-[#f4a33f]/50 transition-all duration-300 ${isSpeaking ? 'shadow-[0_0_40px_rgba(244,163,63,0.6)] scale-105' : 'shadow-[0_0_15px_rgba(244,163,63,0.1)]'}`}>
            <Image src="/myriam.jpg" alt="Myriam Avatar" fill className="object-cover object-top" />
            <div className={`absolute inset-0 bg-[#f4a33f] mix-blend-overlay transition-opacity duration-300 ${isSpeaking ? 'opacity-30' : 'opacity-0'}`}></div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-[#f4c66a] opacity-75 ${isSpeaking ? 'animate-ping' : ''}`}></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f4c66a]"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#f4c66a]">
              {isSpeaking ? 'Transmitting...' : 'Online'}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] sm:max-w-[75%] p-4 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'border border-white/10 bg-black/50 text-stone-300' 
                    : 'border border-[#8f5728]/30 bg-[linear-gradient(135deg,rgba(20,12,8,0.9),rgba(5,4,3,0.95))] text-stone-100 shadow-[0_10px_40px_rgba(201,82,16,0.05)]'
                }`}
              >
                {msg.role === 'model' ? renderMessageText(msg.text) : msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Paywall Overlay */}
        {showPaywall && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md border border-[#f4a33f]/50 bg-[#0a0705] p-8 text-center shadow-[0_30px_100px_rgba(201,82,16,0.3)]">
              <Lock className="mx-auto mb-4 h-10 w-10 text-[#f4c66a]" />
              <h2 className="mb-2 font-display text-2xl uppercase tracking-[0.1em] text-stone-100">Signal Encrypted</h2>
              <p className="mb-6 text-sm leading-6 text-stone-400">
                You have reached the limit of free transmissions. To unlock the VIP Vault, access unreleased tracks, and continue your dialogue with Myriam, secure your VIP Pass.
              </p>
              <Link
                href={`/checkout-ppv?item=VIP_PASS&sessionId=${sessionId}`}
                className="flex w-full items-center justify-center border border-[#f4a33f]/70 bg-[linear-gradient(180deg,#d66a16,#8f3208)] py-4 text-xs font-bold uppercase tracking-[0.18em] text-white hover:border-[#ffd18a]"
              >
                Unlock VIP Vault — $99
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#a86225]/20 bg-black/80 p-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={showPaywall}
            placeholder="Transmit message to Myriam..."
            className="flex-1 border border-white/10 bg-black/50 p-4 text-sm text-stone-200 placeholder:text-stone-600 focus:border-[#c98542] focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={showPaywall || !input.trim()}
            className="flex h-12 w-12 items-center justify-center border border-white/10 bg-black/50 text-[#c98542] transition hover:border-[#c98542] hover:text-[#f4c66a] disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
