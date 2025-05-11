import { Body, Controller, Get, Post ,Res} from '@nestjs/common'
import { Response } from 'express';
import { ContactService } from './contact.service';
@Controller('contact')
export class ContactController {
    constructor(private contactService: ContactService) {}
    @Get()
    async getContacts(@Body() body: { userId: number },@Res() res: Response) {
        const { userId } = body;
        try{

            const response = await this.contactService.getContacts(userId);
            res.status(200).json({ message: response });
            

        }catch(error){
            res.status(500).json({ message: error.message });

        }

    }

    @Post('sendMessageRequest')
    async sendMessageRequest(@Body() body: { userId: number, contactId: number },@Res() res: Response) {
        const { userId, contactId } = body;
        try{

            const response = await this.contactService.createContact(userId, contactId);
            res.status(200).json({ message: response });
            

        }catch(error){
            res.status(500).json({ message: error.message });

        }

    }


    @Post('acceptContactRequest')
    async acceptContactRequest(@Body() body: { userId: number, contactId: number },@Res() res: Response) {
        const { userId, contactId } = body;
         try{

            const response = await this.contactService.createContact(userId, contactId);
            res.status(200).json({ message: response });
            

        }catch(error){
            res.status(500).json({ message: error.message });

        }
    }

    @Post('blockContact')
    async blockContact(@Body() body: { userId: number, contactId: number },@Res() res: Response) {
        const { userId, contactId } = body;
         try{

            const response = await this.contactService.blockContact(userId, contactId);
            res.status(200).json({ message: response });
            

        }catch(error){
            res.status(500).json({ message: error.message });

        }
    }
}
