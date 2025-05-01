import { BadRequestException, OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server,Socket} from 'socket.io'
import * as cookie from 'cookie'
import 'dotenv/config';
import { JwtService } from "@nestjs/jwt";

export type ValidToken = {
  uid:string,
  user?:{email:string,password:string}
}
console.log(process.env.FRONTEND_URL)

@WebSocketGateway({
  cors:{origin:process.env.NODE_ENV==='production'?process.env.FRONTEND_URL:process.env.DEV_FRONTEND_URL,credentials :true}
})

export class EventGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server
  constructor (private readonly jwt:JwtService){}
  
  onModuleInit() {
      console.log('Gateway initialized')
  }

  handleConnection(client: Socket) {
    const token =`${client.handshake.query.token}`
    // // console.log(token)
    try{
      const validToken:ValidToken = this.jwt.verify(token,{secret:process.env.JWT_SECRET})
      console.log('connected')
      
      console.log(`[Socket] ${validToken.uid} connected with id: ${client.id}`);


      this.server.emit('connection',`${validToken.uid} connected to the chat` )
    }
    catch(error){
      client.disconnect()
    }
    }
    
  
  


  handleDisconnect(client:Socket){
    console.log(`${client.id} disconnected from the server`)
    const token = client.handshake.query?.token as string || "";
  

    try{

      const validToken = this.jwt.verify(token,{secret:process.env.JWT_SECRET})
      this.server.emit('disconnection',`${validToken.uid} disconnected from the chat`)
    }catch(error){
      console.log("Invalid user disconnected")
    }
    

   



  }

  
  @SubscribeMessage('join_room')
  handleJoinRoom(client:Socket,room:string ) {
    client.join(room);
    console.log(`Socket ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('privateMessage')
  handleMessage(client:Socket,payload:{room:string,message:string}){
    
    const token = `${client.handshake.query.token}`;
    const {room ,message} = payload
    
    try{
      const validToken:ValidToken = this.jwt.verify(token,{secret:process.env.JWT_SECRET})
      this.server.to(room).emit('privateMessage',{message,clientId:validToken.uid})
      console.log(`Received message from {uid: ${validToken.uid}, clientId: ${client.id}}: ${message}`);
      console.log(`sending message to room ${room}`)
      
    }
    catch(error){
      console.log('Unauthenticated user cannot send message')
    }


    
  }
 
}