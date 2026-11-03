import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeWorkspace from "../components/CodeWorkspace";
import ChatSidebar from "../components/ChatSideBar";

// Hooks
import { useAuth } from "../hooks/useAuth";
import { useChatSocket } from "../hooks/useChatSocket";
import { useCompiler } from "../hooks/useCompiler";
import { useYjsWorkspace } from "../hooks/useYjsWorkspace";

export default function ActiveRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  // Local State
  const [language, setLanguage] = useState("java");
  const [editorMounted, setEditorMounted] = useState(false);
  const editorRef = useRef(null);

  // Custom Hooks
  const { currentUserEmail } = useAuth();
  
  const { 
    messages, messageInput, setMessageInput, memberCount, handleSendMessage 
  } = useChatSocket(roomId, currentUserEmail);
  
  const { 
    terminalOutput, isCompiling, handleRunCode 
  } = useCompiler(editorRef, language);
  
  const { 
    activeEditors, isSaving, handleSaveCode 
  } = useYjsWorkspace(roomId, currentUserEmail, language, editorRef, editorMounted);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    setEditorMounted(true);
  };

  const headerStatus = activeEditors.length > 0 && (
  <span className="text-xs text-[#4FD1C5] flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full bg-[#4FD1C5] animate-pulse"></span>
    {activeEditors.join(", ")} {activeEditors.length === 1 ? "is" : "are"} editing
  </span>
);

  return (
    <div className="flex h-screen w-full font-['Inter'] bg-[#14151A] text-white/60 antialiased overflow-hidden">
      <CodeWorkspace
        language={language}
        setLanguage={setLanguage}
        isCompiling={isCompiling}
        handleRunCode={handleRunCode}
        terminalOutput={terminalOutput}
        handleEditorDidMount={handleEditorDidMount}
        headerStatus={headerStatus} 
        handleSaveCode={handleSaveCode} 
        isSaving={isSaving}
      />
      <ChatSidebar
        roomId={roomId}
        memberCount={memberCount}
        messages={messages}
        currentUserEmail={currentUserEmail}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        navigate={navigate}
      />
    </div>
  );
}