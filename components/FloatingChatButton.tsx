import React from 'react';
import { MessageSquare, X } from 'lucide-react';

interface FloatingChatButtonProps {
    onClick: () => void;
    isOpen: boolean;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 end-5 bg-primary-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 z-[101]"
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
    </button>
  );
};

export default FloatingChatButton;