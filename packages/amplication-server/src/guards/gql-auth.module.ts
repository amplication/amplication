import { PermissionsModule } from "../core/permissions/permissions.module";
import { GqlAuthGuard } from "./gql-auth.guard";
import { Module } from "@nestjs/common";

@Module({
  imports: [PermissionsModule],
  providers: [GqlAuthGuard],
  exports: [GqlAuthGuard],
})
export class GqlAuthModule {}
