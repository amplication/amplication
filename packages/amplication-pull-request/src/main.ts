import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  // Cors
  if (process.env.CORS_ENABLE === "1") {
    app.enableCors();
  }

  await app.listen(process.env.PORT || 3000);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
