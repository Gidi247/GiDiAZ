import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { sendMessageToAzara } from '../services/geminiService';

const AzaraAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello, I am AZARA. I can assist with drug information, symptom checking, inventory insights, or analyze images of drug labels. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ data: string, mimeType: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const currentInput = input;
    const currentImage = selectedImage;

    // Reset input states immediately
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput,
      timestamp: Date.now(),
      image: currentImage ? `data:${currentImage.mimeType};base64,${currentImage.data}` : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const responseText = await sendMessageToAzara(currentInput, currentImage || undefined);

    const modelMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  // Basic Web Speech API implementation
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Speech recognition is not supported in this browser. Please use Chrome.");
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
        setIsListening(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white relative overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b flex items-center px-6 justify-between bg-white z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gidiBlue to-gidiTeal flex items-center justify-center shadow-md">
                <i className="fa-solid fa-user-doctor text-white"></i>
            </div>
            <div>
                <h2 className="font-bold text-gidiDark">AZARA Assistant</h2>
                <p className="text-xs text-gidiTeal font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-gidiTeal rounded-full animate-pulse"></span> Online
                </p>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] lg:max-w-[60%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-gidiBlue text-white rounded-br-none' 
                    : 'bg-white text-gidiDark border border-gray-100 rounded-bl-none'
                }`}>
                    {msg.image && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                        <img src={msg.image} alt="Uploaded context" className="max-h-48 object-cover" />
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[10px] mt-2 block opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-gidiBlue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gidiBlue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gidiBlue rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        {selectedImage && (
          <div className="mb-2 flex items-center gap-2 bg-blue-50 p-2 rounded-lg w-fit">
             <span className="text-xs text-blue-600 font-medium"><i className="fa-solid fa-image mr-1"></i> Image selected</span>
             <button onClick={clearImage} className="text-blue-400 hover:text-blue-600"><i className="fa-solid fa-times"></i></button>
          </div>
        )}
        <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="Upload Image"
            >
                <i className="fa-solid fa-camera"></i>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />

            <button 
                onClick={handleMicClick}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Voice Input"
            >
                <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
            </button>
            
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={selectedImage ? "Add a question about this image..." : "Ask about drugs, symptoms, or interactions..."}
                    className="w-full bg-gray-100 border-0 rounded-full py-3 px-5 focus:ring-2 focus:ring-gidiBlue focus:bg-white transition-all"
                />
            </div>

            <button 
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className="w-10 h-10 rounded-full bg-gidiBlue text-white flex items-center justify-center shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <i className="fa-solid fa-paper-plane"></i>
            </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
            AZARA may produce inaccurate information. Always verify with a professional.
        </p>
      </div>
    </div>
  );
};

export default AzaraAI;