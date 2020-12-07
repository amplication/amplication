import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from "path";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ServeSwaggerStaticModule = ServeStaticModule.forRoot({
  serveRoot: "/swagger",
  rootPath: path.join(__dirname, "swagger"),
});
