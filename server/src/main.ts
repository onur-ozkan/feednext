import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Initialize the cookieParser
  app.use(cookieParser());

  // Initialize middleware functions that set security-related HTTP headers from helmet
  app.use(helmet());

  // Initialize the Cross-site request blocker
  app.use(csurf({ cookie: true }));

  // Configure the brute-force defender
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  await app.listen(3000);
}
bootstrap();
