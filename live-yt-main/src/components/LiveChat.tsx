import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { chatConfig, comments, channelConfig, videoConfig, themeConfig } from "@/config/livestream-config";
import { Heart, Sliders, X, Smile, DollarSign, Users } from "lucide-react";

interface ChatMessage {
  id: string;
  user: string;
  username?: string;
  initials: string;
  message: string;
  color: string;
  timestamp?: string;
}

const getRandomColor = () => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-cyan-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getInitials = (name: string) => {
  const parts = name.split(" ");
  return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
};

const getUsernameFromName = (name: string) => {
  return "@" + name.toLowerCase().replace(/\s+/g, "_");
};

const getRandomTime = () => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, "0");
  const minutes = Math.floor(Math.random() * 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const LiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Initialize with first few comments
    return comments.slice(0, 7).map((comment, index) => ({
      id: `msg-initial-${index}`,
      user: comment.user,
      username: getUsernameFromName(comment.user),
      initials: getInitials(comment.user),
      message: comment.message,
      color: getRandomColor(),
    }));
  });
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const [profileImagePath, setProfileImagePath] = useState("");
  const [currentViewers, setCurrentViewers] = useState(videoConfig.viewers.initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{ id: number; left: number }>>([]);
  const heartIdCounter = useRef(0);

  // Auto-detect profile image
  useEffect(() => {
    const tryExtensions = async () => {
      const baseName = channelConfig.profileImageUrl;
      if (!baseName) return;

      const extensions = ["jpg", "jpeg", "png", "gif", "webp"];

      for (const ext of extensions) {
        const path = `/images/${baseName}.${ext}`;
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = path;
          });
          setProfileImagePath(path);
          return;
        } catch {
          continue;
        }
      }
    };

    tryExtensions();
  }, []);

  // Update viewers count
  useEffect(() => {
    const interval = setInterval(() => {
      const w = window as any;

      setCurrentViewers(prev => {
        // Se o drop foi acionado, use a faixa afterDrop
        if (w.__VIEWER_DROP_DONE) {
          const change = Math.random() > 0.5 ?
            Math.floor(Math.random() * 5) + 1 :
            -(Math.floor(Math.random() * 5) + 1);
          const newValue = prev + change;
          return Math.max(
            videoConfig.viewers.afterDrop.min,
            Math.min(videoConfig.viewers.afterDrop.max, newValue)
          );
        }

        // Antes do drop, use a faixa beforeDrop
        const change = Math.random() > 0.5 ?
          Math.floor(Math.random() * 15) + 1 :
          -(Math.floor(Math.random() * 12) + 1);

        const newValue = prev + change;
        return Math.max(
          videoConfig.viewers.beforeDrop.min,
          Math.min(videoConfig.viewers.beforeDrop.max, newValue)
        );
      });
    }, videoConfig.viewers.updateInterval);

    return () => clearInterval(interval);
  }, []);


  const addFloatingHeart = () => {
    const newHeart = {
      id: heartIdCounter.current++,
      left: Math.random() * 60 + 20,
    };
    setFloatingHearts(prev => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 3000);
  };

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    addFloatingHeart();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-user`,
        user: "Anonymous User",
        username: "@anonymous_user",
        initials: "AU",
        message: inputValue.trim(),
        color: "bg-gray-500",
      };

      setMessages(prev => {
        // Keep only last 7 messages
        const updated = [...prev, newMessage];
        return updated.slice(-7);
      });
      setInputValue("");
    }
  };

  const handleEmojiClick = () => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-emoji`,
      user: "Anonymous User",
      username: "@anonymous_user",
      initials: "AU",
      message: "😊",
      color: "bg-gray-500",
    };

    setMessages(prev => {
      // Keep only last 7 messages
      const updated = [...prev, newMessage];
      return updated.slice(-7);
    });
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages]);

  useEffect(() => {
    let currentIndex = 6;
    let timeout: NodeJS.Timeout;

    const scheduleNextComment = () => {
      if (currentIndex >= comments.length) {
        // Reached the end of comments
        if (chatConfig.loopComments) {
          // Loop back to start
          currentIndex = 0;
        } else {
          // Stop adding comments
          return;
        }
      }

      const comment = comments[currentIndex];
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}-${currentIndex}`,
        user: comment.user,
        username: getUsernameFromName(comment.user),
        initials: getInitials(comment.user),
        message: comment.message,
        color: getRandomColor(),
      };

      setMessages(prev => {
        // Keep only last 7 messages
        const updated = [...prev, newMessage];
        return updated.slice(-7);
      });
      currentIndex++;

      // Schedule next comment
      timeout = setTimeout(scheduleNextComment, chatConfig.commentInterval * 1000);
      timeoutsRef.current.push(timeout);
    };

    // Start scheduling comments after initial interval
    timeout = setTimeout(scheduleNextComment, chatConfig.commentInterval * 1000);
    timeoutsRef.current.push(timeout);

    // Cleanup all timeouts on unmount
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className={`w-full h-full flex flex-col relative ${themeConfig.darkMode ? 'bg-zinc-950' : 'bg-white'}`}>
      {/* Channel Header */}
      <div className={`border-b px-4 py-3 flex-shrink-0 ${themeConfig.darkMode ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-start justify-between gap-3">
          {/* Left side: Title */}
          <div className="flex-1">
            <h3 className={`font-semibold text-base ${themeConfig.darkMode ? 'text-zinc-100' : 'text-gray-900'}`}>{chatConfig.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className={`text-xs ${themeConfig.darkMode ? 'text-zinc-300' : 'text-gray-500'}`}>{chatConfig.topMessagesLabel}</p>
              <div className="flex items-center gap-1">
                <Users className={`w-4 h-4 ${themeConfig.darkMode ? 'text-zinc-400' : 'text-gray-400'}`} />
                <span className={`text-xs ${themeConfig.darkMode ? 'text-zinc-400' : 'text-gray-400'}`}>{(currentViewers / 1000).toFixed(1)}k</span>
              </div>
            </div>
          </div>

          {/* Right side: Badge + Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* XP Badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-300">
              <span className="text-xs font-semibold text-purple-600">👑 0 XP</span>
            </div>

            {/* Filter Button */}
            <button className={`p-1.5 rounded-full transition-colors ${themeConfig.darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              <Sliders className="w-5 h-5" />
            </button>

            {/* Close Button */}
            <button className={`p-1.5 rounded-full transition-colors ${themeConfig.darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto px-0 py-0 min-h-0 ${themeConfig.darkMode ? 'bg-zinc-950' : 'bg-white'}`} ref={messagesContainerRef}>
        <div className="space-y-0">
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`px-4 py-1.5 transition-colors animate-fade-in ${themeConfig.darkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-50'}`}
            >
              <div className="flex gap-3 items-start">
                {/* Avatar */}
                <div
                  className={`w-[1.3rem] h-[1.3rem] rounded-full ${msg.color} flex items-center justify-center text-white text-[0.65rem] font-bold flex-shrink-0`}
                >
                  {msg.initials}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  <span className={`font-semibold text-sm leading-tight ${themeConfig.darkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
                    @{msg.user}
                  </span>
                  <span className={`text-sm break-words leading-snug ${themeConfig.darkMode ? 'text-zinc-100' : 'text-gray-800'}`}>
                    {' '}{msg.message}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className={`border-t px-4 py-3 flex-shrink-0 ${themeConfig.darkMode ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white'}`}>
        <form onSubmit={handleSendMessage} className="w-full">
          <div className="relative flex items-center gap-3">
            {/* Input with Emoji Button inside */}
            <div className="relative flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={chatConfig.inputPlaceholder}
                className={`rounded-full h-9 px-4 pr-12 text-sm focus:ring-0 focus:outline-none w-full transition-all ${themeConfig.darkMode ? 'bg-zinc-800 text-zinc-100 placeholder:text-zinc-400 border border-zinc-700 focus:bg-zinc-700' : 'bg-gray-50 text-gray-900 placeholder:text-gray-500 border border-gray-200 focus:bg-white'}`}
              />
              <button
                type="button"
                onClick={handleEmojiClick}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${themeConfig.darkMode ? 'hover:bg-zinc-700 text-zinc-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            {/* Dollar Button */}
            <button
              type="button"
              className={`p-1 rounded-full transition-colors flex-shrink-0 ${themeConfig.darkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <DollarSign className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Floating Hearts Animation */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute z-10 pointer-events-none"
          style={{
            left: `${heart.left}%`,
            bottom: "120px",
            animation: "float-up 3s ease-out forwards",
          }}
        >
          <Heart className="w-8 h-8 fill-red-500 text-red-500 drop-shadow-lg opacity-90" />
        </div>
      ))}

      {/* Heart Button - Floating on Right */}
      <button
        onClick={handleHeartClick}
        className={`absolute right-4 bottom-24 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 shadow-lg z-20 ${themeConfig.darkMode ? 'bg-zinc-900 border-zinc-700 hover:border-red-500' : 'bg-white border-gray-200 hover:border-red-400'}`}
      >
        <Heart
          className={`w-8 h-8 ${
            isLiked
              ? "fill-red-500 text-red-500 animate-bounce"
              : themeConfig.darkMode ? "text-zinc-400" : "text-gray-400"
          } transition-colors`}
        />
      </button>
    </div>
  );
};
