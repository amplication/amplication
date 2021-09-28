import { DocumentBuilder } from "@nestjs/swagger";

declare const TITLE: string;
declare const DESCRIPTION: string;
declare const VERSION: string;

export const swaggerPath = "api";

//TODO dynamic auth by auth provider
export const swaggerDocumentOptions = new DocumentBuilder()
  .setTitle(TITLE)
  .setDescription(DESCRIPTION)
  .setVersion(VERSION)
  .addBasicAuth()
  .build();

export const swaggerSetupOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customCssUrl: "../swagger/swagger.css",
  customfavIcon: "../swagger/favicon.png",
  customSiteTitle: TITLE,
};
