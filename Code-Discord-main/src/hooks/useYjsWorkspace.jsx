import { useState, useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { supabase } from "../supabaseClient";

const WS_URL = import.meta.env.VITE_WS_URL || "wss://disco-code-server.onrender.com";
const LANGS = ["java", "cpp", "python"];

const DEFAULT_CODE = {
  python: 'print("Hello, World!")',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!";\n  return 0;\n}',
};

const bytesToBase64 = (bytes) => {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
};
const base64ToBytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

const CURSOR_PALETTE = [
  "#f97316", "#22d3ee", "#a78bfa", "#f472b6",
  "#4ade80", "#facc15", "#60a5fa", "#fb7185",
];
const escapeCss = (str) => String(str).replace(/["\\]/g, "\\$&");

// Same fixed clientID on every client => identical ops => merging is idempotent (no duplicates)
const seedDefaults = (ydoc) => {
  const seed = new Y.Doc();
  seed.clientID = 1;
  seed.transact(() => {
    LANGS.forEach((l) => seed.getText(l).insert(0, DEFAULT_CODE[l]));
  });
  Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(seed));
};

export function useYjsWorkspace(roomId, currentUserEmail, language, editorRef, editorMounted) {
  const [activeEditors, setActiveEditors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const ydocRef = useRef(null);
  const providerRef = useRef(null);

  // Doc + provider + initial load
  useEffect(() => {
    if (!roomId) return;
    setIsReady(false);

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(WS_URL, roomId, ydoc);
    ydocRef.current = ydoc;
    providerRef.current = provider;
    const awareness = provider.awareness;

    let cancelled = false;
    let initialized = false;

    const initDoc = async () => {
      if (initialized) return;
      initialized = true;
      const isEmpty = () => LANGS.every((l) => ydoc.getText(l).length === 0);

      // If the server already has this room's content, it is the source of truth.
      // Only fall back to the Supabase snapshot when the shared doc is empty.
      if (isEmpty()) {
        const { data, error } = await supabase
          .from("rooms")
          .select("files_state")
          .eq("room_code", roomId)
          .single();
        if (cancelled) return;
        if (!error && data?.files_state?.yjsData && isEmpty()) {
          try {
            Y.applyUpdate(ydoc, base64ToBytes(data.files_state.yjsData));
          } catch (e) {
            console.error("Failed to decode Yjs update:", e);
          }
        }
        if (isEmpty()) seedDefaults(ydoc);
      }
      if (!cancelled) setIsReady(true);
    };
    const onSync = (synced) => {
      if (synced) initDoc();
    };
    provider.on("sync", onSync);

    // Awareness / cursors
    const username = currentUserEmail ? currentUserEmail.split("@")[0] : "Guest";
    const color = CURSOR_PALETTE[awareness.clientID % CURSOR_PALETTE.length];
    awareness.setLocalStateField("user", { name: username, color });

    const styleEl = document.createElement("style");
    styleEl.setAttribute("data-yjs-cursor-styles", roomId);
    document.head.appendChild(styleEl);

    const onAwareness = () => {
      const states = Array.from(awareness.getStates().values());
      const others = states
        .filter((s) => s.user && s.user.name !== username)
        .map((s) => s.user.name);
      setActiveEditors([...new Set(others)]);

      let css = "";
      awareness.getStates().forEach((state, clientId) => {
        if (clientId === awareness.clientID || !state.user) return;
        const { color: c, name } = state.user;
        css += `
          .yRemoteSelection-${clientId} { background-color: ${c}40; }
          .yRemoteSelectionHead-${clientId} { border-left-color: ${c} !important; }
          .yRemoteSelectionHead-${clientId}::after { content: "${escapeCss(name)}"; background-color: ${c}; }
        `;
      });
      styleEl.textContent = css;
    };
    awareness.on("change", onAwareness);
    onAwareness();

    return () => {
      cancelled = true;
      awareness.off("change", onAwareness);
      provider.off("sync", onSync);
      provider.destroy();
      ydoc.destroy();
      styleEl.remove();
    };
  }, [roomId, currentUserEmail]);

  // Bind editor <-> Y.Text only once the doc is ready
  useEffect(() => {
    if (!isReady || !editorMounted || !editorRef.current) return;
    const binding = new MonacoBinding(
      ydocRef.current.getText(language),
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      providerRef.current.awareness
    );
    return () => binding.destroy();
  }, [language, isReady, editorMounted]);

  const handleSaveCode = async () => {
    if (!isReady) return;
    setIsSaving(true);
    try {
      const yjsData = bytesToBase64(Y.encodeStateAsUpdate(ydocRef.current));
      const { error } = await supabase
        .from("rooms")
        .update({ files_state: { yjsData }, updated_at: new Date().toISOString() })
        .eq("room_code", roomId);
      if (error) console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return { activeEditors, isSaving, handleSaveCode };
}