'use client'
import { createContext, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

type Propstype = {
    children: ReactNode;
}
export const socket = io('http://192.168.0.38:3000')
export const webSocketContext = createContext<Socket>(socket)


export const WebSocketProvider =({children}:Propstype)=>{
    return (
        <webSocketContext.Provider value={socket}>
            {children}
        </webSocketContext.Provider>
    )
}