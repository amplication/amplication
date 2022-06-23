import { EnumResourceType } from '@amplication/prisma-db';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(EnumResourceType, {
  name: 'EnumResourceType'
});
