import { useState, useEffect } from "react";

interface TypingAnimationProps {
  text: string;
  className?: string;
}

export function TypingAnimation({ text, className = "" }: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const resetAnimation = () => {
      setDisplayText("");
      setCurrentIndex(0);
      setIsComplete(false);
      setShowCursor(true);
    };

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100); // Typing speed

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      // Reset after 60 seconds
      const resetTimeout = setTimeout(resetAnimation, 60000);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex, text, isComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530); // Cursor blink speed

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayText}
      <span className={`inline-block w-0.5 h-[1em] bg-current ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
        |
      </span>
    </span>
  );
}
