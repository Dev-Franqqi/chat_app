import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) {}   


   async getContacts(userId:number){
    const contacts = await this.prisma.contact.findMany({
        where:{
          userId,status:'accepted'
                
        }
    })
    if(contacts.length === 0){
        throw new BadRequestException("No contacts found")
    }

    return contacts
   }

   async createContact(userId:number,contactId:number){

    const contact = await this.prisma.contact.findFirst({
        where:{
            OR:[
                {
                    userId,
                    contactId
                },
                {
                    userId:contactId,
                    contactId:userId
                }
            ]
        }
    })

    

    if(!contact){
        await this.prisma.contact.create({
            data:{
                userId,
                contactId
            }
        })

        return "Message request sent"
    }
    throw new BadRequestException("Contact already exists")


    


   }

async acceptContactRequest(userId: number, contactId: number) {
  // Find the contact relationship
  const contact = await this.prisma.contact.findFirst({
    where: {
      OR: [
        { userId, contactId },
        { userId: contactId, contactId: userId },
      ],
    },
  });

  if (!contact) {
    throw new BadRequestException("Contact request not found");
  }

  // Update both directions of the contact status to 'accepted'
  await this.prisma.contact.updateMany({
    where: {
      OR: [
        { userId, contactId },
        { userId: contactId, contactId: userId },
      ],
    },
    data: {
      status: 'accepted',
    },
  });

  return "Contact request accepted";
}


async declineContactRequest(userId: number, contactId: number) {
 
  const contact = await this.prisma.contact.findFirst({
    where: {
      OR: [
        { userId, contactId },
        { userId: contactId, contactId: userId },
      ],
    },
  });

  if (!contact) {
   throw new BadRequestException("Contact request not found");
  }

  // Update both directions of the contact status to 'accepted'
  await this.prisma.contact.deleteMany({
    where: {
      OR: [
        { userId, contactId },
        { userId: contactId, contactId: userId },
      ],
    },
   
  });

  return "Request declined";
}

async blockContact(userId:number,contactId:number){
    const contact = await this.prisma.contact.findFirst({
        where:{

                userId,contactId},
        
    }

)

    if(!contact){
        throw new BadRequestException("Contact not found")
    }

    await this.prisma.contact.update({
        where:{
           
                id:contact.id
             
        },

        data:{
            status:'blocked'
        }
    })
    return "Contact blocked"

   
}

   
}
