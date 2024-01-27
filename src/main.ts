import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("apis")
  app.use(session({
    secret: new ConfigService().getOrThrow('JWT_SECRETKEY'),
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 300000
    }
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NestjsPractice')
    .setDescription('APIs calling')
    .setVersion('1.0')
    .addTag('example')
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis', app, document);
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
