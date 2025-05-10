import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {} 
    
    async getChatRooms() {
        const chatRooms = await this.prisma.chatRoom.findMany();

        if (chatRooms.length < 1) {
          throw new NotFoundException('No chat rooms found');
        }
        return chatRooms;
      }
      


   async getOrCreateChatRoom(email1:string,email2:string){
    console.log('getOrCreateChatRoom')

    if(!email1 || !email2){
        throw new BadRequestException('Email is required')
    }   


    const sortedMail = [email1,email2].sort()
    const chatRoomName = sortedMail.join('-')
    try{

        const chatRoom = await this.prisma.chatRoom.findUnique({
            where:{
                name:chatRoomName
            }
        })

        if(chatRoom){
            console.log('Chat room already exists')
            return chatRoom

    }else{
        console.log('Creating new chat room')
        const newChatRoom = await this.prisma.chatRoom.create({
            data:{
                name:chatRoomName,
                users:{
                    connect:[
                        {email:email1},
                        {email:email2}
                    ]
                }
            }
        })
        return newChatRoom
    }
   }
   catch(error){
    throw new BadRequestException('Error creating chat room')
   }
}

async getChatRoomMessages(room:string){
    if(!room){
        throw new BadRequestException('Room is required')
    }

    const chatRoom = await this.prisma.chatRoom.findUnique({
        where:{
            name:room
        }
    })

    if(!chatRoom){
        throw new NotFoundException('Chat room not found')
    }
    const messages = await this.prisma.message.findMany({
        where:{
            chatRoomId:chatRoom.id
        },
        include:{
            sender:{
                select:{
                    id:true,
                    email:true
                }
            }
        },
        orderBy:{
            createdAt:'asc'
        }
    })
    if(messages.length < 1){
        
        throw new NotFoundException('No messages found')
    }
    return messages


}


async sendPrivateMessage(room:string,message:string,senderId:number){
    if(!room || !message){
        throw new BadRequestException('Room and message are required')
    }   
    console.log('sendPrivateMessage')
    try{
        const chatRoom = await this.prisma.chatRoom.findUnique({
            where:{
                name:room
            }
        })
        if(!chatRoom){
            throw new NotFoundException('Chat room not found')
        }
        const user = await this.prisma.user.findUnique({
            where:{
                id:senderId
            }
        })

        if(!user){
            throw new NotFoundException('You are unable to send messages')
        }
        const newMessage = await this.prisma.message.create({
            data:{
                content:message,
                senderId,
                chatRoomId:chatRoom.id
            }
        })
        console.log('Message sent successfully')
        return newMessage
    }catch(error){
        throw new BadRequestException('Error sending message')
    }
}

}
