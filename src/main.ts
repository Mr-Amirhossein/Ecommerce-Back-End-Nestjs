import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api/v1');
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // to remove all non-whitelist propertise
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API') // corrected title spelling
    .setDescription('The Ecommerce API description') // corrected description spelling
    .setVersion('0.1') // corrected version number format
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
