import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Server} from 'socket.io'

@WebSocketGateway({
  cors:{origin:['http://localhost:3001','http://192.168.1.182:3001']}
})
export class EventGateway  implements OnModuleInit {

  @WebSocketServer()
 server:Server
  onModuleInit() {

    this.server.on('connection',(socket)=>{
      console.log('Client connected');
      console.log(socket.id)
    })

  }
  
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('message',{
      msg:"New message",
      content:payload
    })
    console.log(payload)
    return 'Hello world!';
  }
}
