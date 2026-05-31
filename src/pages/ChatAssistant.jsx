import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { askAssistant, getGeminiApiKey } from "../services/gemini";
import { 
  Send, Bot, User, ArrowLeft, Sliders, ShieldCheck
} from "lucide-react";

export default function ChatAssistant() {
  const { profile, eligibleSchemes } = useApp();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  // Messages State
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "assistant",
      text: `Hello ${profile.name || "Citizen"}! I am your AI Scheme Advisor. I have analyzed your profile and loaded **${eligibleSchemes.length} matching schemes** as context.
      
Ask me anything about these schemes, their benefits, required documents, or step-by-step application instructions!`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  
  // RAG Sidebar State
  const [showContextSidebar, setShowContextSidebar] = useState(true);

  // Chat Window Scroll Ref
  const messagesEndRef = useRef(null);

  // Quick Starter Prompts
  const quickPrompts = [
    { label: "🎓 What scholarships qualify?", query: "What scholarships am I eligible for?" },
    { label: "💼 Loans for starting a business", query: "Which business/startup loans do I qualify for?" },
    { label: "📋 Which documents do I need?", query: "What documents do I need across all my eligible schemes?" },
    { label: "🌾 How do I apply for PM-KISAN?", query: "What are the application steps for PM-KISAN?" }
  ];

  const sendMessage = useCallback(async (textToSend) => {
    if (!textToSend || textToSend.trim() === "" || loading) return;
    
    const userMsg = {
      id: "msg_" + Math.random().toString(36).substring(2, 9),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      // call askAssistant with the chat history (excluding the current user message, which we pass separately)
      const chatHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const reply = await askAssistant(profile, eligibleSchemes, chatHistory, userMsg.text);
      
      const assistantMsg = {
        id: "msg_" + Math.random().toString(36).substring(2, 9),
        sender: "assistant",
        text: reply,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg = {
        id: "error_" + Math.random().toString(36).substring(2, 9),
        sender: "assistant",
        text: "I ran into an issue communicating with the AI. Please verify your internet connection or try again in a moment.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [profile, eligibleSchemes, messages, loading]);

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle URL pre-seeded queries (e.g. redirected from details page)
  useEffect(() => {
    if (initialQuery) {
      const t = setTimeout(() => {
        sendMessage(initialQuery);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [initialQuery, sendMessage]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  // Basic Markdown parser for formatting text inside chat bubbles
  const renderMessageContent = (text) => {
    return text.split("\n").map((line, idx) => {
      let content = line;
      
      // Headings
      if (content.startsWith("###")) {
        return <h4 key={idx} className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-3 mb-1.5">{content.replace("###", "").trim()}</h4>;
      }
      
      // Bold text parser
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-slate-900 dark:text-white">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      // Check if it's a bullet item
      const isBullet = content.startsWith("*") || content.startsWith("-");
      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-2.5 my-1 text-xs">
            <span className="text-slate-400 dark:text-slate-500 font-bold">•</span>
            <span>{parts.length > 0 ? parts : content.substring(1).trim()}</span>
          </div>
        );
      }

      // Check if it's a numbered item
      const numMatch = content.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-2.5 my-1 text-xs">
            <span className="text-brand-500 font-bold shrink-0">{numMatch[1]}.</span>
            <span>{numMatch[2]}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs leading-relaxed my-1">
          {parts.length > 0 ? parts : content}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-[#0b0f19] flex flex-col items-stretch overflow-hidden relative">
      
      {/* Top Banner */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-brand-500" />
              SchemeAI Chat Advisor
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {getGeminiApiKey() ? "Live AI (gemini-2.5-flash)" : "Offline Simulation Mode"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowContextSidebar(!showContextSidebar)}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1"
        >
          <Sliders className="h-3.5 w-3.5" />
          {showContextSidebar ? "Hide RAG Context" : "Show RAG Context"}
        </button>
      </div>

      {/* Main Panel Frame */}
      <div className="flex-1 flex items-stretch overflow-hidden min-h-0">
        
        {/* Chat Message Thread */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-[#090d16]">
          
          {/* Thread Scroll */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === "assistant";
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] sm:max-w-[70%] text-left ${isAi ? "" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Avatar */}
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isAi 
                      ? "bg-brand-500/10 text-brand-600 border border-brand-500/20" 
                      : "bg-gradient-to-tr from-slate-700 to-slate-900 text-white"
                  }`}>
                    {isAi ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                  </div>

                  {/* Bubble Container */}
                  <div className={`p-4 rounded-3xl ${
                    isAi 
                      ? "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-250 shadow-sm rounded-tl-sm" 
                      : "bg-brand-600 text-white shadow-md shadow-brand-600/10 rounded-tr-sm"
                  }`}>
                    {isAi ? (
                      renderMessageContent(msg.text)
                    ) : (
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                    )}
                    <span className={`text-[9px] block text-right mt-1.5 ${isAi ? "text-slate-400" : "text-brand-100"}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Loading / Typing indicator */}
            {loading && (
              <div className="flex gap-3 max-w-[70%] text-left">
                <div className="h-8 w-8 rounded-xl bg-brand-500/10 text-brand-600 border border-brand-500/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <div className="p-4 rounded-3xl rounded-tl-sm bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-slate-500 flex items-center gap-1.5 shadow-sm">
                  <span className="text-xs font-medium animate-pulse">Assistant is thinking</span>
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick starter queries, only show if messages thread is just the welcome message */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/10">
              <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(p.query)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-350 transition-colors shadow-sm"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form Panel */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form onSubmit={handleFormSubmit} className="max-w-4xl mx-auto flex gap-2">
              <input
                type="text"
                disabled={loading}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask details, documents required, application links..."
                className="flex-1 px-4 py-2.5 bg-slate-50 focus:bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 text-xs sm:text-sm"
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Collapsible RAG Context Sidebar */}
        {showContextSidebar && (
          <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 overflow-y-auto hidden lg:flex flex-col gap-6 shrink-0 text-left">
            <div>
              <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                Retrieval-Augmented Context
              </h3>
              <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                To guarantee zero-hallucinations, the AI generates answers by filtering database rules, and grounding responses strictly in these parameters:
              </p>
            </div>

            {/* Profile Attributes Section */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">User Context</h4>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-350">
                <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-normal">Age</span>
                  {profile.age} years
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-normal">Category</span>
                  {profile.category}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg col-span-2">
                  <span className="text-[9px] text-slate-400 block font-normal">Annual Income</span>
                  ₹{Number(profile.income).toLocaleString()}/year
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-normal">Occupation</span>
                  {profile.occupation}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-lg">
                  <span className="text-[9px] text-slate-400 block font-normal">State</span>
                  {profile.state}
                </div>
              </div>
            </div>

            {/* Grounding Schemes Section */}
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Grounding Schemes ({eligibleSchemes.length})
              </h4>
              
              <div className="overflow-y-auto space-y-2 pr-1 flex-1 min-h-0">
                {eligibleSchemes.map((s) => (
                  <div 
                    key={s.schemeId}
                    className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold text-brand-650 dark:text-brand-400">
                      <span>{s.schemeId}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-500 font-normal">
                        {s.state === "All" ? "Central" : "State"}
                      </span>
                    </div>
                    <h5 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {s.name}
                    </h5>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
