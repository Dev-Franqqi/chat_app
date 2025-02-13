import { useContext } from "react";
import { webSocketContext } from "../context/Websocketcontest";


export default function useWebSocket(){
    const socket = useContext(webSocketContext);

    if(!socket){
        throw new Error("Module does not have permission to access web socket");
    }
    return socket
}