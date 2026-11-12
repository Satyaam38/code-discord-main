import { useState } from "react";

export function useCompiler(editorRef, language) {
  const [terminalOutput, setTerminalOutput] = useState("$ Ready to compile...");
  const [isCompiling, setIsCompiling] = useState(false);

  const handleRunCode = async (stdin = "") => {
    if (!editorRef.current) return;
    const currentCode = editorRef.current.getValue();
    
    setIsCompiling(true);
    setTerminalOutput(`$ Running ${language}...\n> Please wait...`);

    try {
      const compilerUrl = import.meta.env.VITE_COMPILER_URL || "http://localhost:8080/execute";
      const response = await fetch(compilerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code: currentCode, stdin: typeof stdin === "string" ? stdin : "" }),
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

  return { terminalOutput, isCompiling, handleRunCode };
}