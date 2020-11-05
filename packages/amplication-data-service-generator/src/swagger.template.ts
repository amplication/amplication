import { DocumentBuilder } from "@nestjs/swagger";

declare const TITLE: string;
declare const DESCRIPTION: string;
declare const VERSION: string;

export default new DocumentBuilder()
    .setTitle(TITLE)
    .setDescription(DESCRIPTION)
    .setVersion(VERSION)
    .addBasicAuth()
    .build();