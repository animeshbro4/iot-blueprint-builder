import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Terminal, Play, Square } from "lucide-react";

interface TerminalCodeViewerProps {
  code: string;
  title?: string;
}

const TerminalCodeViewer = ({ code, title = "firmware.ino" }: TerminalCodeViewerProps) => {
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedCode, setDisplayedCode] = useState(code);
  const [charIndex, setCharIndex] = useState(code.length);
  const scrollRef = useRef<HTMLPreElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startTypingAnimation = () => {
    setIsTyping(true);
    setCharIndex(0);
    setDisplayedCode("");
  };

  const stopTypingAnimation = () => {
    setIsTyping(false);
    setDisplayedCode(code);
    setCharIndex(code.length);
  };

  useEffect(() => {
    if (!isTyping) return;
    if (charIndex >= code.length) {
      setIsTyping(false);
      return;
    }
    const charsPerTick = 3;
    const timeout = setTimeout(() => {
      const nextIndex = Math.min(charIndex + charsPerTick, code.length);
      setDisplayedCode(code.slice(0, nextIndex));
      setCharIndex(nextIndex);
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 8);
    return () => clearTimeout(timeout);
  }, [isTyping, charIndex, code]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg overflow-hidden border border-border bg-[hsl(210,22%,6%)] shadow-[0_0_30px_hsl(164,100%,42%,0.08)]"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(210,18%,9%)] border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-accent/80" />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
          </div>
          <div className="flex items-center gap-1.5 ml-3">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={isTyping ? stopTypingAnimation : startTypingAnimation}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-primary transition-colors"
            title={isTyping ? "Stop" : "Replay typing"}
          >
            {isTyping ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative">
        <pre
          ref={scrollRef}
          className="p-4 overflow-x-auto overflow-y-auto text-xs leading-relaxed font-mono text-foreground/90 max-h-96 scrollbar-thin"
        >
          <code>
            {displayedCode}
            {isTyping && (
              <span className="inline-block w-2 h-4 bg-primary animate-pulse-glow ml-0.5 align-middle" />
            )}
          </code>
        </pre>
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,hsl(164,100%,42%,0.015)_2px,hsl(164,100%,42%,0.015)_4px)]" />
      </div>
    </motion.div>
  );
};

export default TerminalCodeViewer;
