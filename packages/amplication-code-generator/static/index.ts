import { NestFactory } from "@nestjs/core";
import { AppModule } from "../templates/app.module";

const { PORT = 3000 } = process.env;

async function main() {
  const app = await NestFactory.create(AppModule, {});

  app.listen(PORT);
}

main();
