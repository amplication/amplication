import * as TypeGraphQL from 'type-graphql';

export enum EnumBuildStatus {
  Completed = 'Completed',
  Waiting = 'Waiting',
  Active = 'Active',
  Delayed = 'Delayed',
  Failed = 'Failed',
  Paused = 'Paused'
}

TypeGraphQL.registerEnumType(EnumBuildStatus, {
  name: 'EnumBuildStatus'
});
