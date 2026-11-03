import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { supabase } from "../supabaseClient";
import activeSoundFile from "../assets/mixkit-message-pop-alert-2354.mp3";

// 1. Remove the forced transports to let Socket.io reliably upgrade the connection
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://disco-code-server.onrender.com";
const socket = io(BACKEND_URL);
const activeAudio = new Audio(activeSoundFile);
export function useChatSocket(roomId, currentUserEmail) {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [memberCount, setMemberCount] = useState(1);

  // Fetch Chat History from Supabase on Load
  useEffect(() => {
    if (!roomId) return;


    const fetchChatHistory = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("room_code", roomId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to load chat history:", error);
      } else if (data) {
        setMessages(data);
      }

      // Mark as read upon entering
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("user_rooms")
          .update({ last_read_at: new Date().toISOString() })
          .eq("room_code", roomId)
          .eq("user_id", user.id);
      }
    };

    fetchChatHistory();
  }, [roomId]);

  // Standard Socket.io Real-Time Listeners
  useEffect(() => {
    if (!roomId) return;

    const handleConnect = () => {

      console.log("🔌 Socket connected! Joining room:", roomId);
      socket.emit("join-room", roomId);
    };

    const handleReceiveMessage = (incomingMsg) => {
      console.log("📨 Live message received from server:", incomingMsg);
      setMessages((prev) => [...prev, incomingMsg]);
      activeAudio.currentTime = 0; // Rewind to start in case messages arrive rapidly
      activeAudio.play().catch((err) => {
        console.warn("Browser blocked active room audio:", err);
      });
    };

    const handleRoomUsersUpdate = ({ roomId: updatedRoomId, count }) => {
      if (updatedRoomId === roomId) setMemberCount(count);
    };

    // Failsafe for if the socket connected before the hook ran
    if (socket.connected) {
      socket.emit("join-room", roomId);
    }

    // Bind listeners
    socket.on("connect", handleConnect);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("room-users-update", handleRoomUsersUpdate);

    return () => {
      // Clean up listeners to prevent memory leaks or ghost renders
      socket.off("connect", handleConnect);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("room-users-update", handleRoomUsersUpdate);
      socket.emit("leave-room", roomId);

      const markReadOnLeave = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("user_rooms")
            .update({ last_read_at: new Date().toISOString() })
            .eq("room_code", roomId)
            .eq("user_id", user.id);
        }
      };
      markReadOnLeave();
    };
  }, [roomId]);

  // Send and Save New Message
// 3. Send and Save New Message
  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text) return;

    const messageData = {
      room_code: roomId,
      message: text,
      sender: currentUserEmail
    };

    // A. Optimistic UI update
    setMessages((prev) => [...prev, messageData]);
    setMessageInput("");

    // 🚨 ADD THIS: Play the sound for your own sent messages!
    activeAudio.currentTime = 0;
    activeAudio.play().catch((err) => {
      console.warn("Browser blocked active room audio:", err);
    });

    // B. Broadcast to the room
    socket.emit("send-message", { roomId, message: text, sender: currentUserEmail });

    // C. Save to database
    const { error } = await supabase.from("messages").insert([messageData]);
    if (error) {
      console.error("Failed to save message to database:", error);
    }
  };

  return { messages, messageInput, setMessageInput, memberCount, handleSendMessage };
}