import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './shared/config/config.service';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import * as apm from 'swagger-stats';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Initialize the cookieParser
  app.use(cookieParser());

  // Initialize middleware functions that set security-related HTTP headers from helmet
  app.use(helmet());

  // Initialize the Cross-site request blocker
  // app.use(csurf({ cookie: true }));

  const paths = ['/users/', '/categories/', '/entries/', '/products/'];

  // Configure the brute-force defender [values will change for production]
  for (const path of paths) {
    app.use(path,
      rateLimit({
        windowMs: 60 * 1000,
        max: 100,
      }),
    );
  }

  app.use('/auth/',
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    }),
  );

  // Initialize the APM
  app.use(apm.getMiddleware());

  await app.listen(configService.getPort());
}
bootstrap();
