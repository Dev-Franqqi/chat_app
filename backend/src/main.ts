import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Get ConfigService to access environment variables
    const configService = app.get(ConfigService);

    app.use(cookieParser())

    app.use(
      session({
        secret: configService.get('SESSION_SECRET'),  // Use the session secret from .env
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: false, // Set to true in production with HTTPS
        },
      }),)
  

  await app.listen(3000);
}
bootstrap();
