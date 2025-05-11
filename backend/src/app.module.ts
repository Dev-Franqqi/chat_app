import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),EventModule, AuthModule, UsersModule, ChatModule, ContactModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
