import { registerEnumType } from '@nestjs/graphql';
import { BuildStatus } from '@amplication/build-types';
 
registerEnumType(BuildStatus, {
  name: 'BuildStatus'
});
