import { DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";

declare const TITLE: string;
declare const DESCRIPTION: string;
declare const VERSION: string;
export const swaggerPath = "api";

export const swaggerDocumentOptions = new DocumentBuilder()
  .setTitle(TITLE)
  .setDescription(DESCRIPTION)
  //@ts-ignore
  .AUTH_FUNCTION()
  .build();

export const swaggerSetupOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCssUrl: "../swagger/swagger.css",
  customfavIcon: "../swagger/favicon.png",
  customSiteTitle: TITLE,
};
