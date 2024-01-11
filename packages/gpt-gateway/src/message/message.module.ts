import { AuthModule } from "../auth/auth.module";
import { MessageModuleBase } from "./base/message.module.base";
import { MessageResolver } from "./message.resolver";
import { MessageService } from "./message.service";
import { Module, forwardRef } from "@nestjs/common";

@Module({
  imports: [MessageModuleBase, forwardRef(() => AuthModule)],
  providers: [MessageService, MessageResolver],
  exports: [MessageService],
})
export class MessageModule {}
