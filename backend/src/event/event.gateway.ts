import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server,Socket} from 'socket.io'
import * as cookie from 'cookie'

@WebSocketGateway({
  cors:{origin:['http://localhost:3001','http://192.168.1.182:3001','http://192.168.0.38:3001']}
})

export class EventGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server
  generateRandomNumber(min:number,max:number):number{

    const num = Math.floor(Math.random() * (max-min)) +min
    return num;
  }

  generateUniqueUserId():string{
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const numbers = "0123456789"
    //each unique Id should contain a letter in its first index and a number in its second index and max length should be 8 
   let uid = ""
   uid+= alphabets.charAt(this.generateRandomNumber(0,alphabets.length))
   uid+= numbers.charAt(this.generateRandomNumber(0,numbers.length))

   for(let i = 2; i<=8;i++){
    const fullCharacters = alphabets+numbers
    uid+=fullCharacters.charAt(this.generateRandomNumber(0,fullCharacters.length))

   }
   return uid

    

  } 
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
      const uid = this.generateUniqueUserId();
      // Emit the private event to the connected client
      this.server.to(client.id).emit('uniqueId', uid);
      console.log(`${client.id} connects to ${uid}`)
    }
    else{
      console.log(`${client.id} already has a connection to ${uniqueId}`)
      
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

    const userUid  = cookies['uid']// Parse cookies
    
    console.log(`Client with uniqueId: ${userUid} and has ${client.id} said ${message}`)
    return "Hello world"
  }
 
}