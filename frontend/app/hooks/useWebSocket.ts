'use client'
import { useContext } from "react";
import { webSocketContext } from "../context/Websocketcontext";

export default function useWebSocket() {
  const socketcontext = useContext(webSocketContext);

  if (!socketcontext) {
    
    throw new Error("WebSocket is not available yet."); 
  }
  return socketcontext
}
