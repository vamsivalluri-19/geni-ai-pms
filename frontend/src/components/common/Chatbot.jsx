
import React, { useState, useRef, useEffect } from "react";
import Webcam from "../Webcam";
import { Send, X, MessageCircle, Minimize2, Maximize2, Bot, User, Loader2, Image as ImageIcon, Camera, Mic, Sparkles } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [provider, setProvider] = useState("connecting...");
  const messagesEndRef = useRef(null);
  // Camera capture modal state
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamVideoRef = useRef(null);

  // Drag-and-drop upload state
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewError, setPreviewError] = useState("");
  // Voice input state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const normalizeRole = (value) => {
    const raw = String(value || "guest").toLowerCase().replace(/[_-]/g, " ").replace(/\s+/g, " ").trim();
    if (raw.includes("human resources") || raw === "hr" || raw.includes("hr admin") || raw === "hradmin") return "hr";
    if (raw.includes("placement coordinator") || raw.includes("staff")) return "staff";
    if (raw.includes("candidate") || raw.includes("student")) return "student";
    return "guest";
  };

  const currentRole = normalizeRole(user?.role);

  const getRoleConfig = () => ({
    title: "Google AI Assistant",
    subtitle: "Ask anything! General knowledge, coding, or platform help.",
    greeting: "Hi, I'm your AI Assistant powered by Google Gemini. Ask me anything—whether it's about this platform, general knowledge, technology, or writing!"
  });

  const roleConfig = getRoleConfig(currentRole);

  // Get initial greeting based on user role
  const getInitialMessages = () => [
    {
      id: 1,
      text: roleConfig.greeting,
      sender: "bot",
      time: new Date()
    }
  ];

  // Reset chat state completely
  const resetChatState = () => {
    setMessages(getInitialMessages());
    setInput("");
    setPreviewFile(null);
    setPreviewError("");
    setShowCamera(false);
    setCapturedImage(null);
    setIsRecording(false);
  };

  // Handle closing chat completely
  const handleCloseChat = () => {
    resetChatState();
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Reset chat when the authenticated role changes
  useEffect(() => {
    resetChatState();
  }, [user?._id, user?.id, currentRole]);

  // File/image upload handler
  // Drag-and-drop and file input handler
  const handleFileChange = async (e, droppedFile) => {
    const file = droppedFile || (e?.target?.files?.[0]);
    setPreviewError("");
    if (!file || isSending) return;
    // Validate file type/size (example: max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setPreviewError("File too large (max 10MB)");
      return;
    }
    setPreviewFile(file);
    // Optionally preview image
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewFile({ ...file, preview: ev.target.result });
      reader.readAsDataURL(file);
    }
    // Upload immediately
    await uploadFileToChat(file);
  };

  // Drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(null, e.dataTransfer.files[0]);
    }
  };

  // Upload file to chat
  const uploadFileToChat = async (file) => {
    const formData = new FormData();
    formData.append("attachment", file);
    formData.append("role", currentRole);
    const history = messages
      .filter((m) => !m.isPending)
      .slice(-10)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        message: m.text
      }));
    formData.append("history", JSON.stringify(history));
    const uploadId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: uploadId,
        text: `Uploading: ${file.name}`,
        sender: "user",
        time: new Date(),
        isPending: true,
        fileType: file.type,
        fileName: file.name
      }
    ]);
    setIsSending(true);
    try {
      const response = await api.post("/ai/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { userMessage, aiMessage } = response.data;
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== uploadId),
        {
          id: userMessage._id || Date.now() + 1,
          text: userMessage.message || (userMessage.attachment ? `📎 ${userMessage.attachment.name}` : ""),
          sender: "user",
          time: new Date(userMessage.createdAt),
          attachment: userMessage.attachment
        },
        aiMessage && {
          id: aiMessage._id || Date.now() + 2,
          text: aiMessage.message,
          sender: "bot",
          time: new Date(aiMessage.createdAt)
        }
      ].filter(Boolean));
    } catch (error) {
      setMessages((prev) => prev.map((m) => m.id === uploadId ? { ...m, text: "Upload failed.", isPending: false } : m));
    } finally {
      setIsSending(false);
      setPreviewFile(null);
    }
  };

  // Camera capture handler
  const handleCameraClick = () => {
    setShowCamera(true);
    setCapturedImage(null);
  };

  // Capture image from webcam
  const handleCapture = () => {
    const video = webcamVideoRef.current?.querySelector('video');
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
  };

  // Send captured image as chat image
  const handleSendCaptured = async () => {
    if (!capturedImage || isSending) return;
    setShowCamera(false);
    setIsSending(true);
    // Convert dataURL to Blob
    const res = await fetch(capturedImage);
    const blob = await res.blob();
    const file = new File([blob], `camera-${Date.now()}.png`, { type: 'image/png' });
    const formData = new FormData();
    formData.append("attachment", file);
    formData.append("role", currentRole);
    const history = messages
      .filter((m) => !m.isPending)
      .slice(-10)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        message: m.text
      }));
    formData.append("history", JSON.stringify(history));
    const uploadId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: uploadId,
        text: `Uploading camera image...`,
        sender: "user",
        time: new Date(),
        isPending: true,
        fileType: 'image/png',
        fileName: file.name
      }
    ]);
    try {
      const response = await api.post("/ai/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const { userMessage, aiMessage } = response.data;
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== uploadId),
        {
          id: userMessage._id || Date.now() + 1,
          text: userMessage.message || (userMessage.attachment ? `📸 Camera Image` : ""),
          sender: "user",
          time: new Date(userMessage.createdAt),
          attachment: userMessage.attachment
        },
        aiMessage && {
          id: aiMessage._id || Date.now() + 2,
          text: aiMessage.message,
          sender: "bot",
          time: new Date(aiMessage.createdAt)
        }
      ].filter(Boolean));
    } catch (error) {
      setMessages((prev) => prev.map((m) => m.id === uploadId ? { ...m, text: "Camera upload failed.", isPending: false } : m));
    } finally {
      setIsSending(false);
    }
  };

  // Text-to-image handler (scaffold)
  // Text-to-image handler
  const handleTextToImage = async () => {
    const prompt = window.prompt("Enter a prompt to generate an image:");
    if (!prompt) return;
    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: `Generating image for: "${prompt}"`,
        sender: "user",
        time: new Date(),
        isPending: true
      }
    ]);
    try {
      const response = await api.post("/ai/chat", { prompt, type: "text-to-image", role: currentRole });
      const { imageUrl, aiMessage } = response.data;
      setMessages((prev) => [
        ...prev.filter((m) => !m.isPending),
        {
          id: Date.now() + 1,
          text: aiMessage || "[Image generated]",
          sender: "bot",
          time: new Date(),
          attachment: imageUrl ? { type: "image", url: imageUrl, name: "Generated Image" } : undefined
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((m) => !m.isPending),
        {
          id: Date.now() + 2,
          text: "Image generation failed.",
          sender: "bot",
          time: new Date()
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Voice assistant handler (scaffold)
  // Voice assistant handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput("");
      setIsRecording(false);
      // Automatically send the recognized text as a message
      handleSendMessageFromVoice(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;
    setIsRecording(true);
    recognition.start();
  };

  // Helper to send message from voice
  const handleSendMessageFromVoice = async (voiceText) => {
    if (!voiceText || isSending) return;
    const pendingId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: pendingId,
        text: voiceText,
        sender: "user",
        time: new Date(),
        isPending: true
      }
    ]);
    try {
      setIsSending(true);
      const response = await api.post("/ai/chat", {
        message: voiceText,
        history: messages.filter((m) => m.sender && m.text).map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
        role: currentRole
      });
      const reply = response?.data?.reply;
      const replyProvider = response?.data?.provider || "gemini";
      setProvider(replyProvider);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, text: reply, isPending: false, time: new Date() }
            : m
        )
      );
    } catch (error) {
      // If backend is up, show a friendly fallback answer instead of a generic error
      let fallback = "I’m having trouble reaching the AI service right now. Please try again in a moment.";
      if (error?.response?.status !== 500 && error?.response?.status !== 404) {
        fallback = "I’m the AI Assistant, and I’m here to help. I couldn’t answer that, but please try rephrasing or ask another question.";
      } else if (error?.response?.data?.reply) {
        fallback = error.response.data.reply;
      }
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, text: fallback, isPending: false }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  // Initialize messages when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages(getInitialMessages());
    }
  }, [isOpen, user?.role]);

  // Reset chat when user changes
  useEffect(() => {
    resetChatState();
  }, [user?._id, user?.id, user?.role]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    const userMessage = {
      id: Date.now(),
      text: userText,
      sender: "user",
      time: new Date()
    };

    const pendingId = Date.now() + 1;
    // Show instant fallback reply (Copilot-like speed)
    const pendingMessage = {
      id: pendingId,
        text: "Thinking...",
      sender: "bot",
      time: new Date(),
      isPending: true
    };

    setMessages((prev) => [...prev, userMessage, pendingMessage]);
    setInput("");

    // Prepare history for Gemini (mapped to 'message' to match backend controller)
    const history = messages
      .filter((m) => !m.isPending)
      .slice(-10)
      .map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        message: m.text
      }));

    while (history.length && history[0].role !== "user") {
      history.shift();
    }

    setIsSending(true);
    // Fire-and-forget: update with real answer if/when it arrives
    api.post("/ai/chat", {
      message: userText,
      history,
      role: currentRole
    }, { timeout: 10000 })
      .then((response) => {
        console.log("[Chat] Full backend response:", JSON.stringify(response?.data, null, 2));
        const reply = response?.data?.reply || response?.data?.aiMessage?.message;
        const replyProvider = response?.data?.provider || "gemini";
        console.log(`[Chat] Extracted reply (${reply?.length} chars): "${reply?.substring(0, 200)}..."`);
        setProvider(replyProvider);
        if (reply && reply.trim()) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === pendingId
                ? { ...m, text: reply, isPending: false, time: new Date() }
                : m
            )
          );
        } else {
          console.warn("[Chat] Empty reply received from backend");
        }
      })
      .catch((error) => {
        console.error("[Chat] Request error:", error?.message);
        console.error("[Chat] Response data:", error?.response?.data);
        const errorMsg = error?.response?.data?.error || error?.response?.data?.message;
        const errorMessage = error.response?.data?.reply || errorMsg || "I’m having trouble reaching the AI service right now. Please try again in a moment.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? { ...m, text: errorMessage, isPending: false, sender: "bot" }
              : m
          )
        );
        setProvider("error");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:scale-110 flex items-center justify-center"
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-all ${isMinimized ? 'h-16' : 'h-[550px]'}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      style={{ outline: dragActive ? '2px dashed #6366f1' : 'none', outlineOffset: dragActive ? '-4px' : undefined }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">{roleConfig.title}</h3>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full animate-pulse ${provider === 'gemini' ? 'bg-green-400' : 'bg-yellow-400'}`} />
              <span className="text-[9px] uppercase font-bold tracking-widest opacity-80">
                {provider === "gemini" ? "Google Gemini" : "Connecting"}
              </span>
            </div>
            <p className="text-[10px] opacity-80 mt-0.5 max-w-[220px] leading-tight">{roleConfig.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => {
              if (window.confirm('Clear this chat history?')) {
                resetChatState();
              }
            }}
            className="p-2 hover:bg-white/10 rounded-lg transition text-xs"
            title="Clear chat history"
          >
            ✕
          </button>
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg transition">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={handleCloseChat} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 flex flex-col items-center relative min-w-[340px]">
            <button onClick={() => setShowCamera(false)} className="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-500"><X size={20} /></button>
            <div ref={webcamVideoRef} className="mb-4">
              <Webcam width={320} height={240} />
            </div>
            {!capturedImage ? (
              <button onClick={handleCapture} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">Capture</button>
            ) : (
              <>
                <img src={capturedImage} alt="Captured" className="rounded-xl mb-3 max-w-xs max-h-48" />
                <div className="flex gap-2">
                  <button onClick={handleSendCaptured} className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700">Send</button>
                  <button onClick={() => setCapturedImage(null)} className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 font-bold hover:bg-gray-400">Retake</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!isMinimized && (
        <div className="flex flex-col h-[calc(100%-64px)]">
          {/* Chat Window */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] ${
                    msg.sender === "user" 
                      ? "bg-gradient-to-br from-blue-600 to-indigo-700" 
                      : "bg-gradient-to-br from-slate-600 to-slate-700"
                  }`}>
                    {msg.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none"
                  }`}>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${msg.sender === "user" ? "text-blue-100" : "text-slate-400 dark:text-slate-400"}`}>
                      {msg.sender === "user" ? "Question" : "Answer"}
                    </div>
                    {msg.isPending ? (
                      <div className="flex items-center gap-2 italic opacity-70">
                        <Loader2 size={14} className="animate-spin" />
                        Thinking...
                      </div>
                    ) : (
                      <>
                        {/* Show image if attachment is image */}
                        {msg.attachment && msg.attachment.type === "image" && msg.attachment.url && (
                          <img src={msg.attachment.url} alt={msg.attachment.name} className="max-w-xs max-h-40 rounded mb-1" />
                        )}
                        {/* Show file link if attachment is file */}
                        {msg.attachment && msg.attachment.type === "file" && msg.attachment.url && (
                          <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 underline mb-1">
                            📎 {msg.attachment.name}
                          </a>
                        )}
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      </>
                    )}
                    <span className={`text-[9px] mt-1 block opacity-50 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                      {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={handleCameraClick}
                disabled={isSending}
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-800 rounded-lg"
                title="Use Camera"
              >
                <Camera size={20} />
              </button>
              <label className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer" title="Attach Image/File">
                <ImageIcon size={20} />
                <input type="file" className="hidden" onChange={handleFileChange} disabled={isSending} />
              </label>
            </div>
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything or drag a file..."
                className="w-full pl-4 pr-20 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                disabled={isSending}
              />
              {/* Mic Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isSending}
                className={`absolute right-12 p-2 rounded-lg transition-all flex items-center justify-center ${
                  isRecording
                    ? "bg-red-100 text-red-600 animate-pulse shadow-lg"
                    : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
                title={isRecording ? "Stop Recording" : "Start Voice Input"}
              >
                <Mic size={20} className={isRecording ? "animate-pulse" : ""} />
              </button>
              {/* Send Button */}
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className={`absolute right-1.5 p-2 rounded-lg transition-all ${
                  isSending || !input.trim() 
                    ? "text-slate-400 dark:text-slate-600" 
                    : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
            {/* Drag-and-drop area and preview */}
            {dragActive && (
              <div className="absolute inset-0 bg-blue-100/80 dark:bg-blue-900/40 flex items-center justify-center z-50 border-2 border-dashed border-blue-500 rounded-xl pointer-events-none">
                <span className="text-blue-700 dark:text-blue-200 font-bold text-lg">Drop file/image to upload</span>
              </div>
            )}
            {previewError && <p className="text-xs text-red-500 mt-2">{previewError}</p>}
            {previewFile && previewFile.preview && (
              <div className="flex items-center gap-2 mt-2">
                <img src={previewFile.preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg border" />
                <span className="text-xs text-slate-600 dark:text-slate-300">{previewFile.name}</span>
              </div>
            )}
            <p className="text-[9px] text-center text-slate-400 dark:text-slate-500 mt-2 uppercase font-bold tracking-widest">
              🔒 Session-only chats per role · questions and answers stay visible
            </p>
          </form>
        </div>
      )}
    </div>
  );
}