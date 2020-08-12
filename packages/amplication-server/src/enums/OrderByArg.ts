import { registerEnumType } from '@nestjs/graphql';

/**@todo: check whether we should rename OrderByArg to SortOrder (as in prisma) */
export enum OrderByArg {
  asc = 'asc',
  desc = 'desc'
}
registerEnumType(OrderByArg, {
  name: 'OrderByArg',
  description: undefined
});
