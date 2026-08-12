import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Send } from "lucide-react";
import robotGif from "@/assets/robot.gif";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

const qaDatabase = [
  {
    keywords: ["who", "join", "eligibility", "eligible", "member", "student", "freshman", "sophomore", "junior", "senior"],
    question: "Who can join the IEEE Student Branch?",
    answer: "Any student currently enrolled at SREC, regardless of their major or year of study, is welcome to join our branch. We encourage diverse perspectives and interdisciplinary collaboration."
  },
  {
    keywords: ["benefit", "benefits", "why join", "advantage", "advantages", "perk", "perks", "membership"],
    question: "What are the core benefits of becoming a member?",
    answer: "Members get exclusive access to industry workshops, global networking events, hackathons, and research mentorship. You also receive the official IEEE membership which unlocks a vast library of technical publications."
  },
  {
    keywords: ["participate", "event", "events", "how", "register", "join event", "upcoming"],
    question: "How do I participate in upcoming events?",
    answer: "You can view all our upcoming initiatives on the 'Latest Activities' page. Members usually receive early-bird registration links via their university email."
  },
  {
    keywords: ["leadership", "lead", "officer", "committee", "excom", "role", "roles", "volunteer", "president", "chair"],
    question: "Are there opportunities for leadership roles?",
    answer: "Absolutely! We hold annual elections for Executive Committee positions and constantly recruit volunteers to lead specific events, technical societies, and community outreach programs."
  },
  {
    keywords: ["hello", "hi", "hey", "greetings", "nexus", "bot"],
    question: "Greetings",
    answer: "Hello! I am Nexus, your SREC IEEE AI assistant. How can I help you today?"
  },
  {
    keywords: ["about", "srec", "ieee srec", "what is"],
    question: "What is IEEE SREC?",
    answer: "Operating since June 11th, 2001 under the IEEE Madras Section, the IEEE Student Branch of Sri Ramakrishna Engineering College is a vibrant hub promoting continuous technical excellence, innovation, and professional growth."
  },
  {
    keywords: ["thank you", "thanks", "helpful"],
    question: "Thanks",
    answer: "You're very welcome! Let me know if there's anything else I can help you with."
  }
];

const callGeminiAPI = async (userPrompt: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return "That sounds interesting! While I don't have specific details on that in my memory bank, I can guide you on joining IEEE SREC, our technical chapters, or upcoming events.";
  }

  const systemInstruction = 
    "You are Nexus, the AI assistant for SREC IEEE Student Branch at Sri Ramakrishna Engineering College, Coimbatore. " +
    "Use the following SREC IEEE facts to answer questions: " +
    "- Established: June 11th, 2001 under the IEEE Madras Section. " +
    "- Eligibility: Any SREC student from any department or year can join SREC IEEE. " +
    "- Benefits: Exclusive access to industry workshops, global networking, research mentorship, hackathons, and official IEEE publications. " +
    "- How to participate: View upcoming events on the 'Latest Activities' page. Members receive links via university email. " +
    "- Leadership: Opportunities exist via annual elections for Executive Committee (ExCom) or volunteering. " +
    "- SREC Campus: SNR Sons Charitable Trust, 45-acre green campus. " +
    "- SREC IEEE stats: 500+ members, 60+ annual events, 8 technical societies (Computer Society, EMBS, ComSoc, Power & Energy, CIS, etc.). " +
    "Guidelines:\n" +
    "1. Keep responses very brief, friendly, professional, and under 2-3 sentences.\n" +
    `2. Today's date is: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}. If the user asks about the date or today, state this date clearly.\n` +
    "3. If the user asks general questions, math calculations, or general knowledge queries, answer them directly and accurately.";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\nUser: ${userPrompt}` }]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API response status error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (text) {
      return text.trim();
    }
    throw new Error("No text returned in Gemini candidate");
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "That sounds interesting! While I don't have specific details on that in my memory bank, I can guide you on joining IEEE SREC, our technical chapters, or upcoming events.";
  }
};

const getAIResponse = async (input: string): Promise<string> => {
  return await callGeminiAPI(input);
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      sender: "bot", 
      text: "Welcome to the IEEE SREC digital portal. I am Nexus, your interactive AI assistant. Ask me anything about our branch!" 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Trigger speech bubble popup after 2.5s delay and auto-hide after 5 seconds
  useEffect(() => {
    let hideTimer: any;
    const showTimer = setTimeout(() => {
      setShowWelcomeBubble(true);
      hideTimer = setTimeout(() => {
        setShowWelcomeBubble(false);
      }, 5000);
    }, 2500);
    
    return () => {
      clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowWelcomeBubble(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, chatHistory, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    setChatHistory((prev) => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsTyping(true);
    
    try {
      const response = await getAIResponse(text);
      setIsTyping(false);
      
      // Stream characters to simulate real AI generation
      let currentLength = 0;
      setChatHistory((prev) => [...prev, { sender: "bot", text: "" }]);
      
      const interval = setInterval(() => {
        currentLength += 4;
        if (currentLength >= response.length) {
          clearInterval(interval);
          setChatHistory((prev) => {
            const copy = [...prev];
            copy[copy.length - 1].text = response;
            return copy;
          });
        } else {
          setChatHistory((prev) => {
            const copy = [...prev];
            copy[copy.length - 1].text = response.substring(0, currentLength);
            return copy;
          });
        }
      }, 12);
    } catch (error) {
      setIsTyping(false);
      const fallbackMsg = "That sounds interesting! While I don't have specific details on that in my memory bank, I can guide you on joining IEEE SREC, our technical chapters, or upcoming events.";
      setChatHistory((prev) => [...prev, { sender: "bot", text: fallbackMsg }]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const suggestedQuestions = [
    "Who can join?",
    "What are the benefits?",
    "How to participate?",
    "Are there leadership roles?"
  ];

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end">
      
      {/* Welcome Speech Bubble Pop-up */}
      <AnimatePresence>
        {!isOpen && showWelcomeBubble && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute right-28 bottom-10 md:right-32 md:bottom-12 bg-white text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg border border-slate-100 whitespace-nowrap z-50 flex items-center gap-2 group-hover:scale-105 transition-transform"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
            <span>How can I help you?</span>
            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-slate-100 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[350px] md:w-[380px] h-[520px] bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.15),_0_0_40px_rgba(34,211,238,0.15)] rounded-2xl overflow-hidden relative flex flex-col"
          >
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500"></div>

            {/* Header */}
            <div className="bg-slate-900/5 px-5 py-4 flex items-center justify-between border-b border-slate-100 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-3 h-3">
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75"></div>
                  <div className="relative w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                </div>
                <span className="text-slate-900 font-extrabold text-xs tracking-[0.2em] uppercase">Nexus AI System</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                title="Close Assistant" 
                aria-label="Close Assistant" 
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-full transition-colors"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-white to-slate-50/30 flex flex-col no-scrollbar">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                    msg.sender === "user" 
                      ? "bg-slate-900 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions & Input */}
            <div className="p-4 border-t border-slate-100 bg-white shrink-0 space-y-3">
              {/* Quick Click Suggestions */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(q)}
                    className="text-[11px] font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100/80 px-2.5 py-1 rounded-full border border-cyan-100/50 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Nexus AI something..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00629b] focus:bg-white transition-all text-slate-800 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-[#00629b] disabled:bg-slate-100 disabled:text-slate-400 transition-colors shadow-sm"
                  title="Send Message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Robot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Assistant"
        aria-label="Toggle Assistant"
        className="group relative flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 transition-all duration-500 overflow-visible focus:outline-none"
      >
        {isOpen ? (
          <motion.div 
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex items-center justify-center w-14 h-14 bg-slate-900 border-2 border-slate-700 text-white rounded-full shadow-[0_0_30px_rgba(11,59,143,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:bg-rose-500 hover:border-rose-400 transition-all duration-300"
          >
            <X size={26} strokeWidth={2.5} />
          </motion.div>
        ) : (
          <motion.div 
            animate={{ 
              y: [-15, 15, -15],
              rotate: [-4, 4, -4],
              scale: [1, 1.02, 1]
            }} 
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-full h-full drop-shadow-[0_15px_15px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_25px_35px_rgba(34,211,238,0.6)] transition-all duration-500 cursor-pointer"
          >
            <img 
              src={robotGif} 
              alt="Floating Mascot Animation" 
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
            
            <motion.div 
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-2 lg:-bottom-6 left-1/2 -translate-x-1/2 w-16 h-4 bg-cyan-400 blur-[15px] rounded-full -z-10 opacity-50"
            />
            <Sparkles size={24} className="absolute top-2 right-2 text-yellow-300 opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
          </motion.div>
        )}
      </motion.button>

    </div>
  );
};

export default ChatBot;
