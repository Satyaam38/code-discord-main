
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  return (
    <div className="h-screen w-full">
      <Editor
        height="100%"
        defaultLanguage="Java"
        defaultValue={`public class Main {
           public static void main(String[] args) {
            System.out.println();
         }
     }`}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: true,
          },
          fontSize: 14,
        }}
      />
    </div>
  );
}

