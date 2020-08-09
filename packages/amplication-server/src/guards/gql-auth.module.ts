import { Module } from '@nestjs/common';
import { PermissionsModule } from 'src/core/permissions/permissions.module';
import { GqlAuthGuard } from './gql-auth.guard';

@Module({
  imports: [PermissionsModule],
  providers: [GqlAuthGuard],
  exports: [GqlAuthGuard]
})
export class GqlAuthModule {}
