import { PrismaService } from "./prisma.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
