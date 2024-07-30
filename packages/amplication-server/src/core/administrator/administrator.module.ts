import { Module } from "@nestjs/common";
import { AdministratorResolver } from "./administrator.resolver";
import { WorkspaceModule } from "../workspace/workspace.module";

@Module({
  imports: [WorkspaceModule],
  providers: [AdministratorResolver],
  exports: [AdministratorResolver],
})
export class AdministratorModule {}
