import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Module({
  imports:[JwtModule.register({
    secret: process.env.JWT_SECRET, // Secret key for signing tokens
    signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
  })],
  controllers: [UsersController],
  providers: [UsersService,PrismaService]
})
export class UsersModule {}
