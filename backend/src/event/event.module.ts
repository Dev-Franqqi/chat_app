import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Secret key for signing tokens
      signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
    }),
],
  providers: [EventGateway]
})
export class EventModule {}
