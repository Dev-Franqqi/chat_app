import { createContext, ReactNode, useMemo, useState } from "react";
import { Socket } from "socket.io-client";

type Propstype = {
  children: ReactNode;
};

type SocketContextType = {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
};

export const webSocketContext = createContext<SocketContextType>({
  socket: null,
  setSocket: () => {},
});

export const WebSocketProvider = ({ children }: Propstype) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const value = useMemo(() => ({ socket, setSocket }), [socket]);

  return (
    <webSocketContext.Provider value={value}>
      {children}
    </webSocketContext.Provider>
  );
};
