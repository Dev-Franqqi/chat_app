import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Get ConfigService to access environment variables
    const configService = app.get(ConfigService);
    app.enableCors({
      origin: process.env.FRONTEND_URL, // Allow frontend to connect
      
      credentials: true, // Allow cookies and other credentials to be sent
    });
    
    app.use(cookieParser())

    // // app.use(
    // //   session({
    // //     secret: configService.get('SESSION_SECRET'),  // Use the session secret from .env
    // //     resave: false,
    // //     saveUninitialized: false,
    // //     cookie: {
    // //       httpOnly: true,
    // //       secure: false, // Set to true in production with HTTPS
    // //     },
    // //   }),)
  
    await app.listen(process.env.PORT || 4000, () => {
      console.log(`Listening on port ${process.env.PORT || 4000}`);
    });
    
}
bootstrap();
