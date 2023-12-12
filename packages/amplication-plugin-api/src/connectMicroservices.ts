import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export async function connectMicroservices(app: INestApplication) {
  const configService = app.get(ConfigService);
}
