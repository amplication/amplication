import { WinstonModule } from "nest-winston";
import { winstonConfigFactory } from "./winstonConfig.factory";

export const RootWinstonModule = WinstonModule.forRootAsync({
  useFactory: () => winstonConfigFactory(process.env.NODE_ENV === "production"),
});
