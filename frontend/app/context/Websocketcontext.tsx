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
    // Check for cookie and establish socket connection if present
    
    const cookie = Cookies.get('uid');
    console.log(cookie)
    if (cookie) {
      const newSocket = io("http://192.168.0.182:3000", { withCredentials: true });
      setSocket(newSocket);

      // Cleanup socket when the component unmounts
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  if (!socket) {
    // Optionally, you can show a loading indicator while the socket is being initialized
    return <div>Loading...</div>;
  }

  return (
    <webSocketContext.Provider value={socket}>
      {children}
    </webSocketContext.Provider>
  );
};
