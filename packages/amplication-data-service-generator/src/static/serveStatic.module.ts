import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

export const ServeStaticFilesModule = ServeStaticModule.forRoot({
  rootPath: join(__dirname, "static"),
});
