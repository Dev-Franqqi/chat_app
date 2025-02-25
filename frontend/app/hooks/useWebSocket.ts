'use client'
import { useContext } from "react";
import { webSocketContext } from "../context/Websocketcontext";

export default function useWebSocket() {
  const socket = useContext(webSocketContext);

  if (!socket) {
    // Optionally, you could return null or show a loading spinner or fallback UI
    // for cases where the socket isn't initialized yet.
    console.warn("WebSocket is not available yet.");
    return null; // Or you can throw an error if that's your desired behavior
  }

  return socket;
}
