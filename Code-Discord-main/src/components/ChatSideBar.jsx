import React, { useRef, useEffect, useState } from "react";

export default function ChatSidebar({
  roomId,
  memberCount,
  messages,
  currentUserEmail,
  messageInput,
  setMessageInput,
  handleSendMessage,
  navigate
}) {
  const messagesEndRef = useRef(null);
  const [showCopied, setShowCopied] = useState(false);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="w-1/3 bg-[#14151A] flex flex-col font-['Inter']">
      {/* Chat Header */}
      <div className="bg-[#1C1E26] border-b border-white/10 p-4 flex items-center shadow-sm justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/room/join")}
            className="p-2 -ml-2 mr-3 text-white/50 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-white font-['Space_Grotesk'] font-semibold text-base flex items-center gap-2">
              Room {roomId}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  setShowCopied(true);
                  setTimeout(() => setShowCopied(false), 1000);
                }}
                className="relative text-white/50 hover:text-[#E8A33D] transition-colors"
                title="Copy Room Code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                {showCopied && (
                  <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-[#14151A] border border-white/10 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                    Copied!
                  </span>
                )}
              </button>
            </h2>
            <div className="text-xs text-[#4FD1C5] flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#4FD1C5]"></span>
              Connected · {memberCount} member{memberCount !== 1 ? "s" : ""} online
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Messages */}
      <div className="flex-grow p-5 flex flex-col gap-4 overflow-y-auto bg-[#0F1014]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/30 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.sender === currentUserEmail;
            const displayName = isOwnMessage ? "You" : (msg.sender ? msg.sender.split("@")[0] : "User");

            return (
              <div
                key={index}
                className={`flex flex-col gap-1 w-full max-w-[85%] ${
                  isOwnMessage ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <span className={`text-xs text-white/35 ${isOwnMessage ? "mr-1" : "ml-1"}`}>
                  {displayName}
                </span>
                <div
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    isOwnMessage
                      ? "bg-[#E8A33D] text-[#14151A] rounded-tr-sm"
                      : "bg-[#1C1E26] border border-white/10 text-white/80 rounded-tl-sm"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-[#1C1E26] border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            className="flex-grow bg-[#14151A] border border-white/10 rounded-full py-2.5 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#E8A33D] transition-colors"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#E8A33D] hover:bg-[#f0b25c] text-[#14151A] p-2.5 rounded-full transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}