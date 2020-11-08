import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ServeStaticFilesModule = ServeStaticModule.forRoot({
  rootPath: path.join(__dirname, "static"),
});
