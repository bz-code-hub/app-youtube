import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import { videoConfig, channelConfig } from "@/config/livestream-config";

interface VideoPlayerProps {
  videoId?: string;
  viewerCount?: number;
}

interface FloatingHeart {
  id: number;
  left: number;
}

// Helper function to extract YouTube video ID from URL or return ID directly
const extractYouTubeId = (input: string): string => {
  if (!input) return "";

  // If it's already just an ID (11 characters, no special chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  // Try to extract from various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,  // Standard & short URLs
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,                   // YouTube Shorts
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,                    // Embed URLs
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,                        // Old embed format
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If no pattern matches, return the input as-is (might be an ID)
  return input;
};

// Helper function to resolve profile image path
const resolveProfileImage = (input: string): string => {
  if (!input) return "";

  // If it's already a full path (starts with /), return as-is
  if (input.startsWith("/")) {
    return input;
  }

  // If it's just a filename without extension, try common image extensions
  if (!input.includes(".")) {
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];
    // Return the first valid path (browser will try to load it)
    // We'll use .jpg as default since it's most common
    for (const ext of extensions) {
      const path = `/images/${input}.${ext}`;
      // In production, we'd check if file exists, but for now return first jpg/png attempt
      if (ext === "jpg" || ext === "png") {
        return path;
      }
    }
    return `/images/${input}.jpg`; // Default fallback
  }

  // If it has extension but no path, prepend /images/
  return `/images/${input}`;
};


export const VideoPlayer = ({ videoId = videoConfig.videoId }: VideoPlayerProps) => {
  const extractedVideoId = extractYouTubeId(videoId);
  const [currentViewers, setCurrentViewers] = useState(videoConfig.viewers.initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [profileImagePath, setProfileImagePath] = useState("");
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const isInitializing = useRef(false);
  const heartIdCounter = useRef(0);

  // Auto-detect profile image with any extension
  useEffect(() => {
    const resolvedPath = resolveProfileImage(channelConfig.profileImageUrl);

    if (!resolvedPath) {
      setProfileImagePath("");
      return;
    }

    // If it's a full path, use it directly
    if (resolvedPath.includes(".") && resolvedPath.startsWith("/images/")) {
      setProfileImagePath(resolvedPath);
      return;
    }

    // If it's just a name without extension, try to find the image
    const tryExtensions = async () => {
      const baseName = channelConfig.profileImageUrl;
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentViewers(prev => {
        // If already dropped, keep in configured range
        if (hasDropped) {
          const change = Math.random() > 0.5 ? 
            Math.floor(Math.random() * 5) + 1 : 
            -(Math.floor(Math.random() * 5) + 1);
          const newValue = prev + change;
          return Math.max(
            videoConfig.viewers.afterDrop.min, 
            Math.min(videoConfig.viewers.afterDrop.max, newValue)
          );
        }

        // Before the drop, keep in configured range
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
  }, [hasDropped]);


  // Function to add floating hearts
  const addFloatingHeart = () => {
    const newHeart: FloatingHeart = {
      id: heartIdCounter.current++,
      left: Math.random() * 60 + 20, // Random position between 20% and 80%
    };
    setFloatingHearts((prev) => [...prev, newHeart]);

    // Remove heart after animation (3 seconds)
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 3000);
  };

  // Auto-generate hearts periodically (Instagram effect)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        // 70% chance every 1 second - more hearts!
        addFloatingHeart();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleHeartClick = () => {
    setIsLiked(!isLiked);
    addFloatingHeart();
  };

  useEffect(() => {
    const container = playerContainerRef.current;
    if (!container) return;

    // Prevent duplicate initialization
    if (isInitializing.current) return;
    isInitializing.current = true;

    // Clear previous container
    container.innerHTML = '';

    const w = window as any;
    let checkInterval: any = null;
    let dropTimeout: any = null;

    const triggerDrop = () => {
      if (w.__VIEWER_DROP_DONE) {
        return;
      }
      w.__VIEWER_DROP_DONE = true;
      setHasDropped(true);
      const range = videoConfig.viewers.afterDrop.max - videoConfig.viewers.afterDrop.min;
      setCurrentViewers(Math.floor(Math.random() * (range + 1)) + videoConfig.viewers.afterDrop.min);
    };

    // YOUTUBE PLAYER
    if (videoConfig.videoType === "youtube") {
      const scriptId = 'youtube-iframe-api';
      
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }

      let player: any = null;

      const onPlayerReady = () => {
        checkInterval = setInterval(() => {
          if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();

            if (videoConfig.viewers.dropEnabled && currentTime >= videoConfig.viewers.dropTimeInSeconds && !w.__VIEWER_DROP_DONE) {
              triggerDrop();
            }
          }
        }, 1000);
      };

      const initPlayer = () => {
        if (!w.YT || !w.YT.Player) {
          return;
        }

        const playerDiv = document.createElement('div');
        playerDiv.id = 'youtube-player';
        container.appendChild(playerDiv);

        player = new w.YT.Player('youtube-player', {
          videoId: extractedVideoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: onPlayerReady,
          },
        });
      };

      if (w.YT && w.YT.Player) {
        initPlayer();
      } else {
        w.onYouTubeIframeAPIReady = () => {
          initPlayer();
        };
      }

      dropTimeout = setTimeout(() => {
        if (!w.__VIEWER_DROP_DONE) {
          triggerDrop();
        }
      }, videoConfig.viewers.dropTimeInSeconds * 1000);

      return () => {
        isInitializing.current = false;
        if (checkInterval) clearInterval(checkInterval);
        if (dropTimeout) clearTimeout(dropTimeout);
        if (player && player.destroy) {
          player.destroy();
        }
      };
    }

    // VIMEO PLAYER
    if (videoConfig.videoType === "vimeo" && videoConfig.vimeoEmbedCode) {
      // Create a temporary wrapper div to process the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = videoConfig.vimeoEmbedCode;

      // Separate scripts from HTML
      const htmlElements = Array.from(tempDiv.children).filter(el => el.tagName !== 'SCRIPT');
      const scriptElements = tempDiv.querySelectorAll('script');

      // Add HTML elements first
      htmlElements.forEach(el => container.appendChild(el));

      // Execute scripts after (to ensure DOM is ready)
      scriptElements.forEach((oldScript) => {
        const newScript = document.createElement('script');

        // Copy attributes (src, async, defer, etc)
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // Copy inline content
        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent;
        }

        // Add to container to execute
        container.appendChild(newScript);
      });

      dropTimeout = setTimeout(() => {
        if (videoConfig.viewers.dropEnabled && !w.__VIEWER_DROP_DONE) {
          triggerDrop();
        }
      }, videoConfig.viewers.dropTimeInSeconds * 1000);

      return () => {
        isInitializing.current = false;
        if (dropTimeout) clearTimeout(dropTimeout);
        container.innerHTML = '';
      };
    }

    // PANDA VIDEO PLAYER
    if (videoConfig.videoType === "panda" && videoConfig.pandaEmbedCode) {
      // Create a temporary wrapper div to process the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = videoConfig.pandaEmbedCode;

      // Separate scripts from HTML
      const htmlElements = Array.from(tempDiv.children).filter(el => el.tagName !== 'SCRIPT');
      const scriptElements = tempDiv.querySelectorAll('script');

      // Add HTML elements first
      htmlElements.forEach(el => container.appendChild(el));

      // Execute scripts after (to ensure DOM is ready)
      scriptElements.forEach((oldScript) => {
        const newScript = document.createElement('script');

        // Copy attributes (src, async, defer, etc)
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });

        // Copy inline content
        if (oldScript.textContent) {
          newScript.textContent = oldScript.textContent;
        }

        // Add to container to execute
        container.appendChild(newScript);
      });

      dropTimeout = setTimeout(() => {
        if (videoConfig.viewers.dropEnabled && !w.__VIEWER_DROP_DONE) {
          triggerDrop();
        }
      }, videoConfig.viewers.dropTimeInSeconds * 1000);

      return () => {
        isInitializing.current = false;
        if (dropTimeout) clearTimeout(dropTimeout);

        // Clean up container completely
        container.innerHTML = '';
      };
    }

    // DIRECT VIDEO LINK PLAYER
    if (videoConfig.videoType === "direct" && videoConfig.directVideoUrl) {
      const videoElement = document.createElement('video');
      videoElement.src = videoConfig.directVideoUrl;
      videoElement.controls = true;
      videoElement.autoplay = true;
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoElement.style.objectFit = 'contain';
      videoElement.style.backgroundColor = '#000';
      
      container.appendChild(videoElement);

      checkInterval = setInterval(() => {
        const currentTime = videoElement.currentTime;

        if (videoConfig.viewers.dropEnabled && currentTime >= videoConfig.viewers.dropTimeInSeconds && !w.__VIEWER_DROP_DONE) {
          triggerDrop();
        }
      }, 1000);

      dropTimeout = setTimeout(() => {
        if (videoConfig.viewers.dropEnabled && !w.__VIEWER_DROP_DONE) {
          triggerDrop();
        }
      }, videoConfig.viewers.dropTimeInSeconds * 1000);

      return () => {
        isInitializing.current = false;
        if (checkInterval) clearInterval(checkInterval);
        if (dropTimeout) clearTimeout(dropTimeout);
      };
    }

    // VTURB PLAYER
    if (videoConfig.videoType === "vturb" && videoConfig.vturbScript) {
      container.innerHTML = videoConfig.vturbScript;
      
      const scripts = container.querySelectorAll('script');
      scripts.forEach((oldScript) => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      });

      dropTimeout = setTimeout(() => {
        if (videoConfig.viewers.dropEnabled && !w.__VIEWER_DROP_DONE) {
          triggerDrop();
        }
      }, videoConfig.viewers.dropTimeInSeconds * 1000);

      return () => {
        isInitializing.current = false;
        if (dropTimeout) clearTimeout(dropTimeout);
      };
    }
  }, [videoId]);

  return (
    <div className="w-full h-full relative bg-black">
      {/* Video Container */}
      <div ref={playerContainerRef} className="w-full h-full" />

      {/* Floating Hearts Animation */}
      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute z-10 pointer-events-none"
          style={{
            right: '20px',
            bottom: '80px',
            animation: 'float-up 3s ease-out forwards',
          }}
        >
          <Heart className="w-8 h-8 fill-red-500 text-red-500 drop-shadow-lg opacity-90" />
        </div>
      ))}
    </div>
  );
};
