import { NestFactory } from '@nestjs/core';
import { GitModule } from './git.module';
async function bootstrap() {
  const app = await NestFactory.create(GitModule);
  await app.listen(3000);
}
bootstrap();
