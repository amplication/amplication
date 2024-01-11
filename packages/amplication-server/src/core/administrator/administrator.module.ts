import { WorkspaceModule } from "../workspace/workspace.module";
import { AdministratorResolver } from "./administrator.resolver";
import { Module } from "@nestjs/common";

@Module({
  imports: [WorkspaceModule],
  providers: [AdministratorResolver],
  exports: [AdministratorResolver],
})
export class AdministratorModule {}
