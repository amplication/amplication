import { ServeStaticModule } from "@nestjs/serve-static";

export const ServeStaticFilesModule = ServeStaticModule.forRoot({
  rootPath: "static",
});
