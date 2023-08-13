import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { MessageTypeModuleBase } from "./base/messageType.module.base";
import { MessageTypeService } from "./messageType.service";
import { MessageTypeResolver } from "./messageType.resolver";

@Module({
  imports: [MessageTypeModuleBase, forwardRef(() => AuthModule)],
  providers: [MessageTypeService, MessageTypeResolver],
  exports: [MessageTypeService],
})
export class MessageTypeModule {}
