import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    session({
      name: process.env.SESSION_NAME || 'sid',
      secret: process.env.SESSION_SECRET || 'session-secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: process.env.COOKIE_HTTPONLY == 'true' ? true : false,
        secure: process.env.COOKIE_SECURE == 'true' ? true : false,
        maxAge: parseInt(process.env.COOKIE_MAXAGE) || 1000 * 60 * 60 * 24 * 7, //1 week
      },
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
