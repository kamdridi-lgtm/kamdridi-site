'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Lock, ShoppingCart, Volume2, VolumeX, Mic, Keyboard } from 'lucide-react';
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
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Import VoiceTransceiver dynamically to avoid SSR issues with window.SpeechRecognition
  const VoiceTransceiver = require('@/components/myriam/voice-transceiver').VoiceTransceiver;

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
    
    // Ensure voices are loaded (sometimes they load async)
    let voices = synth.getVoices();
    
    // Fallback wait if voices are empty (Chrome bug on first load)
    if (voices.length === 0) {
      synth.onvoiceschanged = () => {
         const reloadedVoices = synth.getVoices();
         assignFemaleVoice(utterance, reloadedVoices);
         synth.speak(utterance);
      };
      return;
    }

    assignFemaleVoice(utterance, voices);

    utterance.pitch = 0.8;
    utterance.rate = 0.9; // Slightly slower, more deliberate

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synth.cancel(); // Stop current speech
    synth.speak(utterance);
  };

  const assignFemaleVoice = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) => {
    // Priorities for a feminine, mysterious voice
    const femaleVoice = voices.find(v => 
      v.name.includes('Zira') || // Windows default female
      v.name.includes('Hazel') || // Windows UK female
      v.name.includes('Catherine') || // Windows AU female
      v.name.includes('Samantha') || // macOS default female
      v.name.includes('Google UK English Female') ||
      v.name.includes('Google US English Female') ||
      v.name.includes('Female') ||
      v.name.includes('Amelie') ||
      v.name.includes('Kyoko')
    ) || voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) || voices[0];
    
    if (femaleVoice) utterance.voice = femaleVoice;
  };


  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && synth) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || showPaywall) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);

    try {
      const res = await fetch('/api/myriam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, sessionId })
      });

      const data = await res.json();
      
      if (data.isVip) {
         setIsVip(true);
      }

      if (res.status === 403 || data.error === 'PAYWALL') {
        setShowPaywall(true);
        if (voiceEnabled && synth) {
           const utterance = new SpeechSynthesisUtterance("The signal is encrypted. You must unlock the VIP Vault to continue.");
           let voices = synth.getVoices();
           assignFemaleVoice(utterance, voices);
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
    <div className="relative flex h-[100dvh] flex-col overflow-hidden text-stone-200">
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/myriam.jpg" 
          alt="Myriam Avatar Background" 
          fill 
          className={`object-cover object-top transition-all duration-700 ease-in-out ${isSpeaking ? 'scale-[1.03] blur-[2px]' : 'scale-100'}`} 
          quality={100}
          priority
        />
        {/* Overlays for readability and speaking effect */}
        {/* Removed heavy black overlays completely so image is 100% bright */}
        <div className={`absolute inset-0 bg-[#f4a33f] mix-blend-overlay transition-opacity duration-300 ${isSpeaking ? 'opacity-30' : 'opacity-0'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent h-48 mt-auto"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-[#a86225]/20 bg-black/10 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#c98542] hover:text-[#f4c66a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            ← Return
          </Link>
          <div className="h-8 w-px bg-white/10"></div>
          <div>
            <h1 className="font-display text-lg uppercase tracking-[0.1em] text-stone-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Myriam</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f4c66a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">The Archiver</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleVoice} className="text-[#c98542] hover:text-[#f4c66a] transition drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
          {isVip && (
             <div className="border border-[#f4c66a]/30 bg-[#f4c66a]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c66a] backdrop-blur-md">
               VIP
             </div>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto p-4 sm:p-8">
        {/* Online Status Indicator aligned to the left and pushed to bottom */}
        <div className="mt-auto mb-6 flex flex-col items-start justify-start max-w-xl">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full bg-[#f4c66a] opacity-75 ${isSpeaking ? 'animate-ping' : ''}`}></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#f4c66a]"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#f4c66a]">
              {isSpeaking ? 'Transmitting...' : 'Online'}
            </span>
          </div>
        </div>

        <div className="max-w-xl space-y-6 pb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[90%] p-4 text-sm leading-relaxed backdrop-blur-md ${
                  msg.role === 'user' 
                    ? 'border border-white/20 bg-black/60 text-stone-300 rounded-2xl rounded-br-sm' 
                    : 'border border-[#8f5728]/40 bg-black/60 text-stone-100 shadow-[0_10px_40px_rgba(201,82,16,0.15)] rounded-2xl rounded-tl-sm'
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
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-md border border-[#f4a33f]/50 bg-[#0a0705]/90 p-8 text-center shadow-[0_30px_100px_rgba(201,82,16,0.3)] backdrop-blur-xl">
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
      <div className="relative z-10 border-t border-[#f4c66a]/30 bg-black/80 p-4 pb-28 sm:p-6 sm:pb-6 backdrop-blur-xl transition-all duration-500">
        <div className="mx-auto max-w-3xl">
          {/* Mode Toggle */}
          <div className="mb-4 flex justify-center gap-4">
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                inputMode === 'text' 
                  ? 'bg-[#f4c66a] text-black shadow-[0_0_15px_rgba(244,198,106,0.5)]' 
                  : 'border border-white/20 text-stone-400 hover:text-white'
              }`}
            >
              <Keyboard className="h-3.5 w-3.5" /> Text
            </button>
            <button
              onClick={() => {
                setInputMode('voice');
                setVoiceEnabled(true); // Auto-enable TTS when switching to voice input
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                inputMode === 'voice' 
                  ? 'bg-[#f4c66a] text-black shadow-[0_0_15px_rgba(244,198,106,0.5)]' 
                  : 'border border-white/20 text-stone-400 hover:text-white'
              }`}
            >
              <Mic className="h-3.5 w-3.5" /> Voice
            </button>
          </div>

          {inputMode === 'text' ? (
            <div className="flex items-center gap-3 relative rounded-xl">
              {/* Golden Flashy Haze Effect */}
              <div className="absolute inset-[-10px] rounded-2xl bg-[#f4a33f] opacity-30 blur-2xl animate-pulse pointer-events-none"></div>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={showPaywall}
                placeholder="Transmit message to Myriam..."
                className="relative z-10 flex-1 rounded-xl border-2 border-[#f4c66a]/60 bg-black/80 p-4 text-sm font-medium text-stone-100 placeholder:text-stone-400 focus:border-[#f4c66a] focus:bg-black focus:outline-none focus:ring-4 focus:ring-[#f4c66a]/30 shadow-[0_0_20px_rgba(244,198,106,0.3)] transition-all"
              />
              <button
                onClick={() => sendMessage()}
                disabled={showPaywall || !input.trim()}
                className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#f4c66a]/60 bg-black/80 text-[#f4c66a] transition-all hover:border-[#f4c66a] hover:bg-[#f4c66a] hover:text-black hover:shadow-[0_0_30px_rgba(244,198,106,0.8)] disabled:opacity-50 shadow-[0_0_20px_rgba(244,198,106,0.3)]"
              >
                <Send className="h-6 w-6 ml-1" />
              </button>
            </div>
          ) : (
            <div className="relative z-10 rounded-xl border-2 border-[#f4c66a]/30 bg-black/40">
              <VoiceTransceiver 
                disabled={showPaywall} 
                onTranscript={(text: string) => sendMessage(text)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
