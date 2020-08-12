import * as TypeGraphQL from 'type-graphql';

export enum EnumBuildStatus {
  Queued = 'Queued',
  Success = 'Success',
  Error = 'Error'
}
TypeGraphQL.registerEnumType(EnumBuildStatus, {
  name: 'EnumBuildStatus',
  description: undefined
});
