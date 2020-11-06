import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

export const ServeStaticFilesModule = ServeStaticModule.forRoot({
  rootPath: path.join(__dirname, "static"),
});
