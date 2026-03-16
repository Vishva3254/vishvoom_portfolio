'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, MicOff, Bot, X } from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';
import Markdown from 'react-markdown';
import cvData from '@/data/cv.json';
import { getFemaleVoice } from '@/lib/voiceUtils';

export default function HologramChatbot({ onToggle }: { onToggle?: (isOpen: boolean) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hello to Vishwa's space lets explore it! I am your Neural Assistant. Use W, A, S, D or Arrow keys to move, and press Space to jump on a planet to explore its contents." }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (!newState) {
      // Clear memory and reset messages when closing
      chatRef.current = null;
      setMessages([
        { role: 'bot', text: "Hello to Vishwa's space lets explore it! I am your Neural Assistant. Use W, A, S, D or Arrow keys to move, and press Space to jump on a planet to explore its contents." }
      ]);
    }
    if (onToggle) onToggle(newState);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });
      
      if (!chatRef.current) {
        const now = new Date();
        const currentDateTime = now.toLocaleString();
        
        chatRef.current = ai.chats.create({
          model: 'gemini-2.0-flash',
          config: {
            systemInstruction: `You are a futuristic AI assistant for Vishwa Patel's portfolio. Vishwa is female, so you MUST use she/her pronouns when referring to her. You should be helpful, sci-fi themed, and concise. You MUST answer questions ONLY based on the provided CV data below. If the user asks something not in the CV, politely decline and say you only have information about Vishwa's professional background. You can also engage in normal talk and greetings.
            
The current date and time is: ${currentDateTime}.

Here is Vishwa's CV Data:
${JSON.stringify(cvData, null, 2)}`
          }
        });
      }

      const responseStream = await chatRef.current.sendMessageStream({
        message: text
      });
      
      let fullResponse = '';
      let currentSentence = '';
      setMessages(prev => [...prev, { role: 'bot', text: '' }]);
      
      for await (const chunk of responseStream) {
        const c = chunk as any;
        const chunkText = c.text || '';
        fullResponse += chunkText;
        currentSentence += chunkText;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullResponse;
          return newMessages;
        });

        // Check for sentence boundaries to speak chunks
        if (/[.!?]\s/.test(currentSentence) || currentSentence.endsWith('\n')) {
          const utterance = new SpeechSynthesisUtterance(currentSentence.trim());
          const femaleVoice = getFemaleVoice();
          if (femaleVoice) utterance.voice = femaleVoice;
          window.speechSynthesis.speak(utterance);
          currentSentence = '';
        }
      }
      
      // Speak any remaining text
      if (currentSentence.trim()) {
        const utterance = new SpeechSynthesisUtterance(currentSentence.trim());
        const femaleVoice = getFemaleVoice();
        if (femaleVoice) utterance.voice = femaleVoice;
        window.speechSynthesis.speak(utterance);
      }
      
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error in neural link. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
    } else {
      recognition.stop();
      setIsListening(false);
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggle}
          className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 text-black relative"
        >
          {isOpen ? <X size={28} /> : <Bot size={28} />}
          {!isOpen && <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-20" />}
        </motion.button>
      </div>

      {/* Holographic Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Message History (Right Side) */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="fixed right-4 md:right-16 left-4 md:left-auto top-1/2 -translate-y-1/2 z-40 w-auto md:w-96 h-[60vh] bg-cyan-950/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl flex flex-col overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)]"
            >
              <div className="p-4 border-b border-cyan-500/20 bg-cyan-500/10 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Neural Assistant</span>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-cyan-500/20 text-white border border-cyan-500/30' 
                        : 'bg-white/5 text-cyan-100 border border-white/10'
                    }`}>
                      <div className="markdown-body">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-3 rounded-xl flex gap-1">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Input Box (Bottom Center) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
            >
              <div className="p-2 bg-cyan-950/60 backdrop-blur-xl border border-cyan-500/40 rounded-2xl flex gap-2 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white focus:outline-none font-mono placeholder:text-cyan-500/50"
                />
                <button 
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-cyan-400 hover:bg-white/10'}`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button 
                  onClick={() => handleSend(input)}
                  className="p-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
