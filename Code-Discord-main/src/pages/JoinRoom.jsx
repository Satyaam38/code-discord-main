import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CodeWorkspace from "../components/CodeWorkspace";
import RoomSidebar from "../components/RoomSidebar";
import { useRecentRooms } from "../hooks/useRecentRooms"; // 🚨 Your new hook

export default function JoinRoom() {
  const [language, setLanguage] = useState("java");
  const [codeFiles, setCodeFiles] = useState({
    python: 'print("Hello, World!")',
    java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}',
  });
  const [roomInput, setRoomInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("$ Ready to compile...");
  const [isCompiling, setIsCompiling] = useState(false);

  const editorRef = useRef(null);
  const navigate = useNavigate();
  
  // Cleanly import all the complex room logic with one line
  const { recentChats } = useRecentRooms();

  const handleJoinRoom = async () => {
    const roomCode = roomInput.trim();
    if (!roomCode) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate(`/room/active/${roomCode}`);

      const { data: existing } = await supabase
        .from("user_rooms")
        .select("id")
        .eq("user_id", user.id)
        .eq("room_code", roomCode)
        .maybeSingle();

      if (!existing) {
        await supabase.from("user_rooms").insert([{ user_id: user.id, room_code: roomCode }]);
      }
      navigate(`/room/active/${roomCode}`);
    } catch (err) {
      navigate(`/room/active/${roomCode}`);
    }
  };

  const handleCreateRoom = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase.rpc("create_room");

      if (error || !data) return console.error("Error creating room:", error);

      const roomCode = Array.isArray(data) ? data[0]?.room_code : data.room_code;
      if (!roomCode) return;

      if (user) {
        await supabase.from("user_rooms").insert([{ user_id: user.id, room_code: roomCode }]);
      }
      setRoomInput(roomCode);
      navigate(`/room/active/${roomCode}`);
    } catch (err) {
      console.error("Failed to create room:", err);
    }
  };

  const handleRunCode = async () => {
    if (!editorRef.current) return;
    const currentCode = editorRef.current.getValue();
    setIsCompiling(true);
    setTerminalOutput(`$ Running ${language}...\n> Please wait...`);

    try {
      const response = await fetch("https://compiler-service-qahj.onrender.com/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code: currentCode }),
      });
      const result = await response.json();
      let formattedOutput = "";
      if (result.stderr) formattedOutput += `[ERROR]\n${result.stderr}\n`;
      if (result.stdout) formattedOutput += result.stdout;
      if (result.exitCode !== 0) formattedOutput += `\n[Process exited with code ${result.exitCode}]`;
      setTerminalOutput(formattedOutput || "[Code executed successfully with no output]");
    } catch (error) {
      setTerminalOutput("Error: Could not connect to the compiler server.");
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-['Inter'] bg-[#14151A] text-white/60 antialiased overflow-hidden">
      <CodeWorkspace
        language={language}
        setLanguage={setLanguage}
        isCompiling={isCompiling}
        handleRunCode={handleRunCode}
        terminalOutput={terminalOutput}
        handleEditorDidMount={(editor) => (editorRef.current = editor)}
        handleEditorChange={(value) => setCodeFiles((prev) => ({ ...prev, [language]: value }))}
        value={codeFiles[language]}
      />
      <RoomSidebar
        recentChats={recentChats}
        roomInput={roomInput}
        setRoomInput={setRoomInput}
        handleJoinRoom={handleJoinRoom}
        handleCreateRoom={handleCreateRoom}
        navigate={navigate}
      />
    </div>
  );
}