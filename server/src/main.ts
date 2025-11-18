import { AppConfig, appConfig, CookieConfig, cookieConfig } from '@app/configs';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigResult = app.get<AppConfig>(appConfig.KEY);
  const cookieConfigResult = app.get<CookieConfig>(cookieConfig.KEY);
  const port = appConfigResult.port;
  const domain = appConfigResult.domain;
  const cookieSecret = cookieConfigResult.secret;

  app.enableCors({ credentials: true, origin: appConfigResult.client });
  app.use(cookieParser(cookieSecret));
  app.enableShutdownHooks();
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     exceptionFactory: (errors) => {
  //       const result = errors.map((error) => ({
  //         property: error.property,
  //         constraints: error.constraints,
  //       }));
  //       return new BadRequestException(result);
  //     },
  //     stopAtFirstError: true,
  //   }),
  // );
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  await app.listen(port);

  console.log(`Server in ${process.env.NODE_ENV} mode`);
  console.log(`Server is listening on :${port}/${globalPrefix}`);
  console.log(`Swagger: ${domain}/${globalPrefix}/docs`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
