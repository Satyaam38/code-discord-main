// import React from "react";

// export default function RoomSidebar({
//   recentChats,
//   roomInput,
//   setRoomInput,
//   handleJoinRoom,
//   handleCreateRoom,
//   navigate
// }) {
//   return (
//     <div
//       className="w-[380px] xl:w-[360px] flex-shrink-0 bg-[#0f172a] flex items-center justify-center p-6 border-l border-[#1e293b] shadow-2xl relative"
//       style={{ fontFamily: "'Playfair Display', serif" }}
//     >
//       <div className="w-full h-full max-h-[600px] flex flex-col shadow-2xl bg-[#1e293b] border border-[#334155] rounded-md overflow-hidden">
        
//         {/* Recent Rooms */}
//         <div className="flex-grow flex flex-col p-6 overflow-y-auto bg-[#1e293b]">
//           <h2 className="text-[#818cf8] text-sm font-extrabold tracking-widest uppercase mb-5 flex items-center gap-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             Recent Rooms
//           </h2>

//           <div className="flex flex-col gap-3">
//             {recentChats.map((chat) => (
//               <button
//                 key={chat.id}
//                 onClick={() => navigate(`/room/active/${chat.roomCode}`)}
//                 className="flex flex-col p-3 bg-[#0f172a] hover:bg-[#0b1120] border border-[#334155] rounded-md transition-all text-left group relative"
//               >
//                 <div className="flex justify-between items-center w-full mb-1">
//                   <span className="text-slate-200 font-sans font-semibold text-sm group-hover:text-[#818cf8] transition-colors">
//                     {chat.name}
//                   </span>
//                   {/* Timestamp of the latest message */}
//                   <span className="text-xs text-slate-500 font-sans">
//                     {chat.latestTime || "No messages"}
//                   </span>
//                 </div>
                
//                 <div className="flex justify-between items-center w-full">
//                   {/* Latest Message Preview (Truncated) */}
//                   <span className="text-slate-400 font-sans text-xs truncate max-w-[80%]">
//                     {chat.latestSender ? `${chat.latestSender}: ${chat.latestMessage}` : "No messages yet"}
//                   </span>

//                   {/* Unread Message Badge */}
//                   {chat.unreadCount > 0 && (
//                     <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/20">
//                       {chat.unreadCount}
//                     </span>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Room Code Section */}
//         <div className="bg-[#0b1120] px-8 py-6 flex flex-col items-center justify-center border-t border-[#1e293b]">
//           <label className="mb-2 text-[#cbd5e1] font-medium tracking-widest text-xs uppercase self-start">
//             Enter room code
//           </label>
//           <input
//             type="text"
//             value={roomInput}
//             onChange={(e) => setRoomInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
//             placeholder="e.g. 31234"
//             className="w-full bg-[#1e293b] h-11 mb-5 outline-none px-4 text-left font-mono text-sm text-white rounded-md shadow-inner border border-[#334155] focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1] transition-all placeholder:text-[#64748b] placeholder:font-sans"
//           />
//           <button
//             onClick={handleJoinRoom}
//             className="w-full bg-[#6366f1] hover:bg-emerald-500 text-white font-medium py-2.5 rounded-md transition-colors text-base tracking-wider uppercase shadow-lg shadow-indigo-500/20 mb-3"
//           >
//             Join Room
//           </button>
//           <button
//             onClick={handleCreateRoom}
//             className="w-full bg-[#6366f1] hover:bg-emerald-500 text-white font-medium py-2.5 rounded-md transition-colors text-base tracking-wider uppercase shadow-lg shadow-emerald-500/20"
//           >
//             Create Room
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function RoomSidebar({
  recentChats,
  roomInput,
  setRoomInput,
  handleJoinRoom,
  handleCreateRoom,
  navigate
}) {
  return (
    <div className="w-full h-[45vh] md:h-full md:w-[380px] md:min-w-[380px] md:max-w-[380px] flex-shrink-0 bg-[#14151A] flex items-center justify-center p-4 md:p-6 border-t md:border-t-0 md:border-l border-white/10 shadow-2xl relative font-['Inter']">
      <div className="w-full h-full max-h-[600px] flex flex-col shadow-2xl bg-[#1C1E26] border border-white/10 rounded-md overflow-hidden">

        {/* Recent Rooms */}
        <div className="flex-grow flex flex-col p-6 overflow-y-auto bg-[#1C1E26]">
          <h2 className="text-[#E8A33D] font-['Space_Grotesk'] text-sm font-bold tracking-widest uppercase mb-5 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Rooms
          </h2>

          <div className="flex flex-col gap-3">
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => navigate(`/room/active/${chat.roomCode}`)}
                className="flex flex-col p-3 bg-[#14151A] hover:bg-[#0F1014] border border-white/10 rounded-md transition-all text-left group relative"
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="text-white/90 font-semibold text-sm group-hover:text-[#E8A33D] transition-colors">
                    {chat.name}
                  </span>
                  {/* Timestamp of the latest message */}
                  <span className="text-xs text-white/35">
                    {chat.latestTime || "No messages"}
                  </span>
                </div>

                <div className="flex justify-between items-center w-full">
                  {/* Latest Message Preview (Truncated) */}
                  <span className="text-white/50 text-xs truncate max-w-[80%]">
                    {chat.latestSender ? `${chat.latestSender}: ${chat.latestMessage}` : "No messages yet"}
                  </span>

                  {/* Unread Message Badge */}
                  {chat.unreadCount > 0 && (
                    <span className="bg-[#4FD1C5] text-[#14151A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Room Code Section */}
        <div className="bg-[#0F1014] px-8 py-6 flex flex-col items-center justify-center border-t border-white/10">
          <label className="mb-2 text-white/60 font-medium tracking-widest text-xs uppercase self-start">
            Enter room code
          </label>
          <input
            type="text"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
            placeholder="e.g. 31234"
            className="w-full bg-[#14151A] h-11 mb-5 outline-none px-4 text-left font-['JetBrains_Mono'] text-sm text-white rounded-md shadow-inner border border-white/10 focus:border-[#E8A33D] focus:ring-1 focus:ring-[#E8A33D] transition-all placeholder:text-white/30 placeholder:font-['Inter']"
          />
          <button
            onClick={handleJoinRoom}
            className="w-full bg-[#E8A33D] hover:bg-[#f0b25c] text-[#14151A] font-medium py-2.5 rounded-md transition-colors text-base tracking-wider uppercase mb-3"
          >
            Join Room
          </button>
          <button
            onClick={handleCreateRoom}
            className="w-full bg-[#E8A33D] hover:bg-[#f0b25c] text-[#14151A] font-medium py-2.5 rounded-md transition-colors text-base tracking-wider uppercase"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}