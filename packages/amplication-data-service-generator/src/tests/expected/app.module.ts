import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { CustomerModule } from "./customer/customer.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";

@Module({
  controllers: [AppController],
  imports: [CustomerModule, AuthModule, PrismaModule, UsersModule],
})
export class AppModule {}
