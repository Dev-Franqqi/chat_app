import { Body, Controller, Get, Post ,Res} from '@nestjs/common';
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
}
