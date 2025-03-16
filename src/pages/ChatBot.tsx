import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Send,
  Scale,
  FileText,
  Sparkles,
  MessagesSquare,
  Brain,
  Camera,
  Upload,
  Mic,
  X,
  Image as ImageIcon,
  CameraOff,
  SwitchCamera,
} from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type ChatMode = 'legal' | 'document' | 'creative';

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  url: string | null;
  file: File; // store the original file for uploading
};

export function ChatBot() {
  const { mode: urlMode } = useParams<{ mode: string }>();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>((urlMode as ChatMode) || 'legal');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const modes = {
    legal: {
      Icon: Scale,
      title: 'Legal Expert',
      description: 'Specialized in legal advice and interpretation',
      greeting: "I'm your legal expert assistant. How can I help you with your legal questions today?",
      color: 'from-indigo-900/80 to-indigo-800/80',
      hoverColor: 'from-indigo-800/80 to-indigo-700/80',
      dotColor: 'bg-indigo-400',
      suggestions: [
        'What are my tenant rights?',
        'How do I file a small claims case?',
        'Explain this legal document to me',
      ],
    },
    document: {
      Icon: FileText,
      title: 'Document Analyzer',
      description: 'Analyze and explain legal documents',
      greeting: "I'm ready to help you understand and analyze legal documents. Please share your document or ask questions.",
      color: 'from-emerald-900/80 to-emerald-800/80',
      hoverColor: 'from-emerald-800/80 to-emerald-700/80',
      dotColor: 'bg-emerald-400',
      suggestions: [
        'Review my rental agreement',
        'Check if this contract is fair',
        'Explain these legal terms',
      ],
    },
    creative: {
      Icon: Sparkles,
      title: 'Creative Solutions',
      description: 'Find innovative legal solutions',
      greeting: "I'm here to help you think creatively about your legal challenges. What would you like to explore?",
      color: 'from-purple-900/80 to-purple-800/80',
      hoverColor: 'from-purple-800/80 to-purple-700/80',
      dotColor: 'bg-purple-400',
      suggestions: [
        'Alternative dispute resolution options',
        'Creative ways to negotiate',
        'Innovative legal strategies',
      ],
    },
  };

  useEffect(() => {
    // Add initial greeting based on mode
    setChatHistory([
      {
        role: 'assistant',
        content: modes[mode].greeting,
        timestamp: new Date(),
      },
    ]);
  }, [mode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  const switchCamera = async () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    await startCamera();
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const newFile: UploadedFile = {
              id: Math.random().toString(36).substring(7),
              name: file.name,
              type: file.type,
              url: URL.createObjectURL(file),
              file: file,
            };
            setUploadedFiles((prev) => [...prev, newFile]);
          }
        }, 'image/jpeg', 0.8);
        stopCamera();
      }
    }
  };

  // Voice interface functions
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        // Process audioBlob if needed
      };
      mediaRecorder.start();
      setIsRecording(true);
      setIsVoiceOpen(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsRecording(false);
    setIsVoiceOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && uploadedFiles.length === 0) return;

    // 1) Add the user's message to the chat
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, userMessage]);
    const currentMessage = message; // store the typed message
    setMessage('');
    setLoading(true);

    // 2) Build form data
    const formData = new FormData();
    formData.append('message', currentMessage);
    uploadedFiles.forEach((fileObj) => {
      if (fileObj.file) {
        formData.append('file', fileObj.file);
        // Optionally re-append message if your backend expects it per file
        // formData.append('message', currentMessage);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      // We'll assume your backend returns an object like:
      // {
      //   "type": "ocr",
      //   "ocr_text": "...",
      //   "claude_response": {
      //       "content": {
      //           "text": "Claude's response..."
      //       }
      //   }
      // }
      // or for text-only:
      // {
      //   "type": "text_only",
      //   "message": "Hello",
      //   "claude_response": {
      //       "content": {
      //           "text": "Claude's text-only response..."
      //       }
      //   }
      // }

      let aiText = 'No response from server.';
      if (result.claude_response && result.claude_response.content) {
        // We expect .content.text
        aiText = result.claude_response.content.text || aiText;
      }

      // 3) Add an assistant message to the chat
      const aiResponse: Message = {
        role: 'assistant',
        content: aiText,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error processing request:', error);
      const errorMsg: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.',
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
    setUploadedFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      type: file.type,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      file: file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    event.target.value = '';
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const truncateFileName = (name: string, maxLength: number = 20) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.slice(0, -(extension?.length || 0) - 1);
    return `${nameWithoutExt.slice(0, maxLength)}...${extension}`;
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-gray-300" />;
    return <FileText className="h-8 w-8 text-gray-300" />;
  };

  const CurrentModeIcon = modes[mode].Icon;

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 space-y-6">
            {/* Mode Selection */}
            <div className="bg-[#2a2a2a] rounded-2xl p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Assistant Modes
              </h3>
              {(Object.entries(modes) as [ChatMode, typeof modes[keyof typeof modes]][]).map(([key, value]) => {
                const IconComponent = value.Icon;
                return (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`w-full p-3 rounded-xl transition-all duration-300 ${
                      mode === key
                        ? `bg-gradient-to-br ${value.color}`
                        : 'bg-[#333333] hover:bg-[#404040]'
                    } flex items-center gap-3`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                    <div className="text-left">
                      <p className="text-white font-medium">{value.title}</p>
                      <p className="text-sm text-gray-300">{value.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chat History */}
            <div className="bg-[#2a2a2a] rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <MessagesSquare className="h-5 w-5" />
                Recent Chats
              </h3>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <button
                    key={i}
                    className="w-full p-3 rounded-xl bg-[#333333] hover:bg-[#404040] transition-all duration-300"
                  >
                    <p className="text-white text-sm text-left truncate">Previous Chat {i + 1}</p>
                    <p className="text-gray-400 text-xs text-left">
                      {new Date().toLocaleDateString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="col-span-3">
            <div className="bg-[#2a2a2a] rounded-2xl shadow-xl overflow-hidden h-[800px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 bg-[#333333] border-b border-[#404040] flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${modes[mode].color}`}>
                  <CurrentModeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{modes[mode].title}</h2>
                  <p className="text-sm text-gray-300">{modes[mode].description}</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.role === 'user'
                          ? `bg-gradient-to-br ${modes[mode].color} text-white`
                          : 'bg-[#333333] text-gray-200'
                      }`}
                    >
                      <p className="text-sm md:text-base">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-[#333333] rounded-2xl p-4 max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions */}
              {!message && !uploadedFiles.length && (
                <div className="px-4 py-3 bg-[#333333] border-t border-[#404040] flex gap-2 overflow-x-auto">
                  {modes[mode].suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap bg-gradient-to-br ${modes[mode].color} text-white hover:opacity-90 transition-opacity`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* File Upload Counter */}
              {uploadedFiles.length > 0 && (
                <div className="px-4 py-2 bg-[#333333] border-t border-[#404040]">
                  <p className="text-sm text-gray-400">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} attached
                  </p>
                </div>
              )}

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="px-4 py-3 bg-[#333333] border-t border-[#404040] flex gap-2 overflow-x-auto">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="relative group">
                      {file.url ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                            <p className="text-xs text-white truncate">{truncateFileName(file.name)}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-[#404040] flex flex-col items-center justify-center">
                          {getFileIcon(file.type)}
                          <p className="text-xs text-gray-300 mt-1 px-2 text-center">
                            {truncateFileName(file.name)}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Camera Interface */}
              {isCameraOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                  <div className="relative max-w-2xl w-full mx-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-2xl"
                      style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                      <button
                        onClick={switchCamera}
                        className="p-4 bg-gray-800/80 rounded-full text-white hover:bg-gray-700/80 transition-colors"
                      >
                        <SwitchCamera className="h-6 w-6" />
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="p-6 bg-white rounded-full text-black hover:bg-gray-200 transition-colors"
                      >
                        <Camera className="h-8 w-8" />
                      </button>
                      <button
                        onClick={stopCamera}
                        className="p-4 bg-gray-800/80 rounded-full text-white hover:bg-gray-700/80 transition-colors"
                      >
                        <CameraOff className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Interface */}
              {isVoiceOpen && (
                <div className="fixed bottom-24 right-24 bg-[#2a2a2a] rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="p-4 w-80">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    </div>
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        className={`p-4 rounded-full ${
                          isRecording
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                      >
                        <Mic className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => setIsVoiceOpen(false)}
                        className="p-4 bg-gray-700 rounded-full text-white hover:bg-gray-600 transition-colors"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="p-4 bg-[#333333] border-t border-[#404040]">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#2a2a2a] border border-[#404040] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />

                  {/* File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,video/mp4"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#2a2a2a] text-white rounded-xl px-4 hover:bg-[#404040] transition-colors"
                  >
                    <Upload className="h-5 w-5" />
                  </button>

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="bg-[#2a2a2a] text-white rounded-xl px-4 hover:bg-[#404040] transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                  </button>

                  {/* Voice Input Button */}
                  <button
                    type="button"
                    onClick={() => setIsVoiceOpen(true)}
                    className="bg-[#2a2a2a] text-white rounded-xl px-4 hover:bg-[#404040] transition-colors"
                  >
                    <Mic className="h-5 w-5" />
                  </button>

                  <button
                    type="submit"
                    disabled={loading || (!message.trim() && uploadedFiles.length === 0)}
                    className={`bg-gradient-to-br ${modes[mode].color} text-white rounded-xl px-6 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:opacity-90`}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
