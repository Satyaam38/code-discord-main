import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import lobbySoundFile from "../assets/mixkit-gaming-lock-2848.wav";

const lobbyAudio = new Audio(lobbySoundFile);

// Bulletproof Date Formatter (Immune to Daylight Saving Time bugs)
const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  const msgDate = new Date(dateString);
  const now = new Date();

  // Force both dates to exactly 00:00:00 to compare calendar days
  now.setHours(0, 0, 0, 0);
  const msgMidnight = new Date(msgDate);
  msgMidnight.setHours(0, 0, 0, 0);

  const diffTime = now.getTime() - msgMidnight.getTime();
  // Math.round fixes the bug where time zone shifts create 23-hour days
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 

  if (diffDays === 0) {
    return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export function useRecentRooms() {
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return;

        const { data: roomData, error: roomError } = await supabase
          .from("user_rooms")
          .select("id, room_code, last_read_at")
          .eq("user_id", user.id);

        if (roomError || !roomData) return;

        const formattedRooms = await Promise.all(roomData.map(async (room) => {
          const { data: latestMsg } = await supabase
            .from("messages")
            .select("sender, message, created_at")
            .eq("room_code", room.room_code)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          let unreadCount = 0;
          if (room.last_read_at) {
            const { count } = await supabase
              .from("messages")
              .select("*", { count: 'exact', head: true })
              .eq("room_code", room.room_code)
              .gt("created_at", room.last_read_at)
              .neq("sender", user.email);
            unreadCount = count || 0;
          }

          return {
            id: room.id,
            roomCode: room.room_code,
            name: `Room ${room.room_code}`,
            latestMessage: latestMsg ? latestMsg.message : null,
            latestSender: latestMsg ? latestMsg.sender.split("@")[0] : null,
            latestTime: latestMsg ? formatMessageTime(latestMsg.created_at) : "",
            unreadCount,
            rawDate: latestMsg ? new Date(latestMsg.created_at).getTime() : 0
          };
        }));

        formattedRooms.sort((a, b) => b.rawDate - a.rawDate);
        setRecentChats(formattedRooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };

    fetchRooms();

    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
         lobbyAudio.currentTime = 0;
         lobbyAudio.play().catch((err) => console.warn("Audio blocked:", err));
         fetchRooms(); 
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return { recentChats };
}