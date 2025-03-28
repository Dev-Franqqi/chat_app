import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.NODE_ENV==='production'?process.env.FRONTEND_URL:"http://192.168.0.178:3000",
    credentials: true,
  });

  app.use(cookieParser());

  const port = process.env.PORT || 4000; // Ensure Render picks up the PORT variable
  await app.listen(port, '0.0.0.0'); // IMPORTANT: Bind to '0.0.0.0' for Render
  console.log(`Listening on port ${port}`);
}

bootstrap();
