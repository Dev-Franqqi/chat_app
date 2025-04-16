import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserByEmail(email: string): Promise<string> {
        if (!email) {
            throw new BadRequestException("Email is required");
        }

        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new BadRequestException("User not found");
        }

        return user.email;
    }
}
