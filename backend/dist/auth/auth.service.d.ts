import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    private hashpassword;
    private comparePassword;
    private generateRandomNumber;
    generateUniqueUserId(): string;
    anonymousSignin(): {
        message: string;
        token: string;
    };
    signup(email: string, password: string): Promise<{
        user: {
            id: number;
            email: string;
            password: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: {
            id: number;
            email: string;
            password: string;
            createdAt: Date;
        };
        token: string;
    }>;
}
