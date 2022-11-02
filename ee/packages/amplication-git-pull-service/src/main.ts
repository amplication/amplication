import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function main() {
  const app = await NestFactory.create(AppModule);
  await app.startAllMicroservices();
  await app.listen(3333);

  return app;
}

module.exports = main();
