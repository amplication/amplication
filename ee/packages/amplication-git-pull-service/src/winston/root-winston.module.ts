import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { WinstonConfigService } from "./winston-config.service";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RootWinstonModule = WinstonModule.forRootAsync({
  imports: [ConfigModule],
  useClass: WinstonConfigService,
});
