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

  useEffect(() => {
    const checkCookieAndConnect = () => {
      console.log('checking')
      const token = Cookies.get('token');

      if (token && !socket) {
        const newSocket = io(process.env.NEXT_PUBLIC_SERVER_URL, {query:{token:token} ,withCredentials: true });

        newSocket.on("connect", () => {});
        newSocket.on("disconnect", () => {});

        setSocket(newSocket);
      } else if (!token && socket) {
        // User logged out, disconnect socket
        socket.disconnect();
        setSocket(null);
        
      }
    };

    // Run check immediately and then at intervals
    checkCookieAndConnect();


  }, [socket]); // Re-run effect when `socket` changes

  return (
    <webSocketContext.Provider value={socket}>
      {!socket ? <div>Connecting...</div> : children}
    </webSocketContext.Provider>
  );
};
