import { Module } from "@nestjs/common";
// @ts-ignore: Cannot find module '../prisma/prisma.module' or its corresponding type declarations.
import { PrismaModule } from "../prisma/prisma.module";

declare class CONTROLLER {}
declare class SERVICE {}

@Module({
  imports: [PrismaModule],
  controllers: [CONTROLLER],
  providers: [SERVICE],
})
export class MODULE {}
