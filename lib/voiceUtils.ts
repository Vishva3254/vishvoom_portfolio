export const getFemaleVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a female voice by common names or keywords
  const femaleVoice = voices.find(v => {
    const name = v.name.toLowerCase();
    return name.includes('female') || 
           name.includes('samantha') || 
           name.includes('zira') ||
           name.includes('victoria') ||
           name.includes('karen') ||
           name.includes('tessa') ||
           name.includes('moira') ||
           name.includes('fiona') ||
           name.includes('luciana') ||
           name.includes('monica') ||
           name.includes('ava') ||
           name.includes('allison') ||
           name.includes('susan');
  });
  
  // Fallback to the first English voice if no explicit female voice is found
  return femaleVoice || voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
};
