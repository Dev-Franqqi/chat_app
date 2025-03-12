'use client'
import { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

type Propstype = {
  children: ReactNode;
};

export const webSocketContext = createContext<Socket | null>(null);

export const WebSocketProvider = ({ children }: Propstype) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkCookieAndConnect = () => {
      console.log('checking')
      const cookie = Cookies.get('uid');

      if (cookie && !socket) {
        const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, { withCredentials: true });

        newSocket.on("connect", () => setIsConnected(true));
        newSocket.on("disconnect", () => setIsConnected(false));

        setSocket(newSocket);
      } else if (!cookie && socket) {
        // User logged out, disconnect socket
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };

    // Run check immediately and then at intervals
    checkCookieAndConnect();
    const interval = setInterval(checkCookieAndConnect, 5000); // Check every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [socket]); // Re-run effect when `socket` changes

  return (
    <webSocketContext.Provider value={socket}>
      {!socket ? <div>Connecting...</div> : children}
    </webSocketContext.Provider>
  );
};
