'use client';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '' });

export function useChat() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hello to Vishwa's space lets explore it! I am your Neural Assistant. Use W, A, S, D or Arrow keys to move, and press Space to jump on a planet to explore its contents." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      const stream = await ai.models.generateContentStream({
        model: 'gemini-2.0-flash',
        contents: text,
        config: {
          systemInstruction: "You are a futuristic AI assistant for Vishwa Patel's portfolio. Vishwa is an AI/ML Engineer from Surat, India. You should be helpful, sci-fi themed, and concise. You can talk about his projects in AI Agents, Computer Vision, Trading AI, and Speech AI. If asked about him, mention his research in student learning prediction (IEEE EDUCON 2025)."
        }
      });
      
      let responseText = '';
      setMessages(prev => [...prev, { role: 'bot', text: '' }]);
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        responseText += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = responseText;
          return newMessages;
        });
      }
      
      // Text to Speech
      const utterance = new SpeechSynthesisUtterance(responseText);
      window.speechSynthesis.speak(utterance);
      
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

  return { messages, input, setInput, isTyping, isListening, handleSend, toggleListening };
}
