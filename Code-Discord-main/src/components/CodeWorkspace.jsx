// import React from "react";
// import Editor from "@monaco-editor/react";

// export default function CodeWorkspace({
//   language,
//   setLanguage,
//   isCompiling,
//   handleRunCode,
//   terminalOutput,
//   handleEditorDidMount,
//   handleEditorChange,
//   value,
//   headerStatus,
//   handleSaveCode,
//   isSaving
// }) {
//   return (
//     <div className="w-2/3 flex flex-col border-r border-slate-800 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
//       {/* Top Navigation */}
//       <div className="flex justify-between items-center bg-slate-900 p-2.5 border-b border-slate-800">
//         <div className="flex items-center gap-3 ml-6">
//           <span className="text-lg font-semibold tracking-wide text-slate-400">
//             Main.{language === "java" ? "java" : language}
//           </span>
//           {headerStatus}
//         </div>

//         <div className="flex items-center gap-3 pr-4">
//           <select
//             className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md px-3 py-1.5 outline-none focus:border-blue-500 transition-colors cursor-pointer"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option value="java">Java</option>
//             <option value="cpp">C++</option>
//             <option value="python">Python</option>
//           </select>
//           {handleSaveCode && (
//             <button
//               onClick={handleSaveCode}
//               disabled={isSaving}
//               className={`${
//                 isSaving ? "bg-indigo-800 text-indigo-300" : "bg-indigo-600 hover:bg-indigo-500 text-white"
//               } text-sm font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-2`}
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </button>
//           )}

//           <button
//             onClick={handleRunCode}
//             disabled={isCompiling}
//             className={`${
//               isCompiling ? "bg-emerald-800" : "bg-emerald-600 hover:bg-emerald-500"
//             } text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-2`}
//           >
//             {isCompiling ? "Running..." : "Run"}
//           </button>
//         </div>
//       </div>
//       {/* Monaco Editor */}
//       <div className="flex-grow bg-[#1e1e1e]">
//         <Editor
//           height="100%"
//           language={language}
//           theme="vs-dark"
//           onMount={handleEditorDidMount}
//           options={{
//             minimap: { enabled: false },
//             fontSize: 15,
//             padding: { top: 16 },
//           }}
//           // THE MAGIC TRICK: 
//           // If handleEditorChange is provided (JoinRoom), pass the value and onChange props.
//           // If it is NOT provided (ActiveRoom), pass nothing and let Yjs take over.
//           {...(handleEditorChange ? { value: value, onChange: handleEditorChange } : {})}
//         />
//       </div>

//       {/* Terminal Area */}
//       <div className="h-[28%] bg-[#0d1117] flex flex-col border-t border-slate-800">
//         <div className="flex items-center justify-center bg-slate-900 border-b border-slate-800 px-4 py-1.5">
//           <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
//             Terminal...
//           </span>
//         </div>
//         <div className="flex-grow p-4 font-mono text-sm text-green-400 overflow-y-auto whitespace-pre-wrap">
//           {terminalOutput}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";

export default function CodeWorkspace({
  language,
  setLanguage,
  isCompiling,
  handleRunCode,
  terminalOutput,
  handleEditorDidMount,
  handleEditorChange,
  value,
  headerStatus,
  handleSaveCode,
  isSaving
}) {
  const [activeTab, setActiveTab] = useState("output");
  const [stdinInput, setStdinInput] = useState("");

  const onRunClick = () => {
    setActiveTab("output");
    handleRunCode(stdinInput);
  };

  // Match the editor background to the rest of the page
  const handleBeforeMount = (monaco) => {
    monaco.editor.defineTheme("devcord", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#14151A",
        "editorGutter.background": "#14151A",
      },
    });
  };

  return (
    <div className="flex-1 min-w-0 min-h-0 flex flex-col border-r border-white/10 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)] font-['Inter']">
      {/* Top Navigation */}
      <div className="flex flex-wrap justify-between items-center gap-2 bg-[#1C1E26] p-2.5 border-b border-white/10">
        <div className="flex items-center gap-3 ml-6">
          <span className="text-lg font-semibold tracking-wide text-white/60 font-['Space_Grotesk']">
            Main.{language === "java" ? "java" : language}
          </span>
          {headerStatus}
        </div>

        <div className="flex flex-wrap items-center gap-3 pr-4">
          <select
            className="bg-[#14151A] border border-white/10 text-white/80 text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#E8A33D] transition-colors cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
          {handleSaveCode && (
            <button
              onClick={handleSaveCode}
              disabled={isSaving}
              className={`${
                isSaving
                  ? "bg-white/5 text-white/30"
                  : "bg-white/10 hover:bg-white/15 text-white"
              } text-sm font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-2`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}

          <button
            onClick={onRunClick}
            disabled={isCompiling}
            className={`${
              isCompiling ? "bg-[#E8A33D]/50" : "bg-[#E8A33D] hover:bg-[#f0b25c]"
            } text-[#14151A] text-sm font-medium px-4 py-1.5 rounded-md transition-colors flex items-center gap-2`}
          >
            {isCompiling ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-grow bg-[#14151A]">
        <Editor
          height="100%"
          language={language}
          theme="devcord"
          beforeMount={handleBeforeMount}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: "'JetBrains Mono', monospace",
            padding: { top: 16 },
          }}
          // THE MAGIC TRICK:
          // If handleEditorChange is provided (JoinRoom), pass the value and onChange props.
          // If it is NOT provided (ActiveRoom), pass nothing and let Yjs take over.
          {...(handleEditorChange ? { value: value, onChange: handleEditorChange } : {})}
        />
      </div>

      {/* Terminal & Input Area */}
      <div className="h-[32%] bg-[#0F1014] flex flex-col border-t border-white/10">
        <div className="flex items-center justify-between bg-[#1C1E26] border-b border-white/10 px-4 py-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("output")}
              className={`text-xs font-['JetBrains_Mono'] uppercase tracking-wider px-2.5 py-1 rounded transition-colors ${
                activeTab === "output"
                  ? "bg-white/10 text-[#E8A33D] font-semibold"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Output
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("input")}
              className={`text-xs font-['JetBrains_Mono'] uppercase tracking-wider px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === "input"
                  ? "bg-white/10 text-[#E8A33D] font-semibold"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Input (stdin)
              {stdinInput.trim().length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#4FD1C5]" title="Input provided" />
              )}
            </button>
          </div>
          <span className="text-[11px] font-['JetBrains_Mono'] text-white/30 hidden sm:inline">
            {activeTab === "input" ? "Custom program input" : "Terminal output"}
          </span>
        </div>

        <div className="flex-grow overflow-hidden relative">
          {activeTab === "output" ? (
            <div className="h-full p-4 font-['JetBrains_Mono'] text-sm text-[#D6D8E0] overflow-y-auto whitespace-pre-wrap">
              {terminalOutput}
            </div>
          ) : (
            <textarea
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              placeholder="Enter input for your program here (e.g. for Scanner, cin >>, or input())..."
              className="w-full h-full p-4 font-['JetBrains_Mono'] text-sm text-[#D6D8E0] bg-transparent resize-none outline-none placeholder:text-white/20"
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}