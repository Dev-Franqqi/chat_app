import { Body, Controller, Get, Post ,Query,Res} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service';
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}


    @Get('getChatRooms')
    async getChatRooms(@Res() res:Response) {
        try{
            const chatRooms = await this.chatService.getChatRooms()
            res.status(200).json(chatRooms)
            
        }catch(error){
            res.status(400).json({message:error.message})
        }
    }

@Get('getChatRoomMessages')
async getChatRoomMessages(@Query('room') room: string, @Res() res: Response) {
  try {
    const messages = await this.chatService.getChatRoomMessages(room);
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}



    
    @Post('getOrCreateChatRoom')
    async getOrCreateChatRoom(@Body() body: { email1: string; email2: string },@Res() res:Response) {
        const { email1, email2 } = body;
        try{
            const chatRoom = await this.chatService.getOrCreateChatRoom(email1,email2)
           console.log(chatRoom)
            res.status(200).json(chatRoom)

        }catch(error){
            res.status(400).json({message:error.message})
        }
    }

    @Post('sendPrivateMessage')
    async sendPrivateMessage(@Body() body:{room:string,message:string,senderId:number},@Res() res:Response) {
        const { room, message, senderId } = body;
        try{
            const response = await this.chatService.sendPrivateMessage(room,message,senderId)
            res.status(200).json({message:'Message sent successfully',response})

        }catch(error){
            res.status(400).json({message:error.message})
        }
    }
}
