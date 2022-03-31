import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    credentials: true,
    origin: [
      /**
       * localhost on all ports
       */
      /^http:\/\/localhost:?[0-9]*$/,
      /**
       * any subdomain of ivan0313.tk
       */
      /\.ivan0313\.tk$/,
      /**
       * free domain given by netlify
       */
      'artist-crm.netlify.app',
      /**
       * netlify PR previews
       */
      /https:\/\/deploy-preview-[0-9]*--artist-crm\.netlify\.app/,
    ],
  });
  app.use(cookieParser());

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
