import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server,Socket} from 'socket.io'
import * as cookie from 'cookie'

@WebSocketGateway({
  cors:{origin:'*',credentials:true},
})

export class EventGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server
  
  onModuleInit() {
      console.log('Gateway initialized')
  }

  handleConnection(client: Socket) {
    console.log(`${client.id} connected to the server`);
  
    // Emit the 'connection' event to the new client
    this.server.emit('connection', `${client.id} connected to the chat`);
  
    // Get session ID from the cookies in handshake headers
    const cookies = cookie.parse(client.handshake.headers.cookie || ''); // Parse cookies
    const uniqueId = cookies["uid"];
  
    if (!uniqueId) {
     
      console.log(`No uid found Signup`)
    }
    else{
      console.log(`${client.id}  has a connection to ${uniqueId}`)
      
    }
  }
  


  handleDisconnect(client:Socket){
    console.log(`${client.id} disconnected from the server`)
    this.server.emit('disconnection',`${client.id} disconnected to the chat`)


  }

  

  @SubscribeMessage('message')
  handleMessage(client:Socket,message:string):string{
    this.server.emit('message',{message,clientId:client.id})

    const cookies = client.handshake.headers.cookie ? cookie.parse(client.handshake.headers.cookie) : {}; 

    // const userUid  = cookies['uid']// Parse cookies
    const userUid  = client.handshake.address
    
    console.log(`Client with ip address ${userUid} and has ${client.id} said ${message}`)
    return "Hello world"
  }
 
}