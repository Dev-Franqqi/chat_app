import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server,Socket} from 'socket.io'
import * as cookie from 'cookie'
import 'dotenv/config';
console.log(process.env.FRONTEND_URL)

@WebSocketGateway({
  cors:{origin:process.env.FRONTEND_URL,credentials :true}
})

export class EventGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server
  
  onModuleInit() {
      console.log('Gateway initialized')
  }

  handleConnection(client: Socket) {
    console.log(`${client.id} connected to the server`);
    const cookies = cookie.parse(client.handshake.headers.cookie || "");
    
    this.server.emit('connection',`${cookies.uid} connected to the chat`)
        console.log("Cookies received:", cookies);
        
        if (!cookies.uid) {
          console.log("No session cookie found. Disconnecting...");
          client.disconnect();
          this.server.emit('disconnection',`${client.id} disconnected to the chat`)

          return;
        }
    
        console.log(`Client connected with session ID: ${cookies.uid}`);
      
    }
    
  
  


  handleDisconnect(client:Socket){
    console.log(`${client.id} disconnected from the server`)
    this.server.emit('disconnection',`${client.id} disconnected to the chat`)


  }

  

  @SubscribeMessage('message')
  handleMessage(client:Socket,message:string):string{
    
    const cookies = client.handshake.headers.cookie;
    const parsedCookies = cookie.parse(cookies);
    const uid = parsedCookies['uid'];
    this.server.emit('message',{message,clientId:uid})

    console.log(`Received message from ${uid}: ${message}`);

    // const userUid  = cookies['uid']// Parse cookies
    
    console.log(`Client with uniqueId ${uid} and has ${client.id} said ${message}`)
    return "Hello world"
  }
 
}