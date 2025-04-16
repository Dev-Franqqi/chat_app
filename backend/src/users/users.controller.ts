import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('getUserByEmail')
    async getUserByEmail(@Body() body: { email: string }) {
        try {
            const user = await this.usersService.getUserByEmail(body.email);
            return { message: 'User found', user };
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
