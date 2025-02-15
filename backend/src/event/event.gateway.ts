import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server,Socket} from 'socket.io'

@WebSocketGateway({
  cors:{origin:['http://localhost:3001','http://192.168.1.182:3001','http://192.168.0.38:3001']}
})

export class EventGateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server
  onModuleInit() {
      console.log('Gateway initialized')
  }

  handleConnection(client:Socket){
    console.log(`${client.id} connected to the server`)

    this.server.emit('connection',`${client.id} connected to the chat`)

  }

  handleDisconnect(client:Socket){
    console.log(`${client.id} disconnected from the server`)
    this.server.emit('disconnection',`${client.id} disconnected to the chat`)


  }

  @SubscribeMessage('message')
  handleMessage(client:Socket,message:string):string{
    this.server.emit('message',{message,clientId:client.id})
    console.log(`${client.id} said ${message}`)
    return "Hello world"
  }
 
}