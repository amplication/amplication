import { registerEnumType } from '@nestjs/graphql';

export enum EnumEntityPagePageType {
  SingleRecord = 'SingleRecord',
  List = 'List',
  MasterDetails = 'MasterDetails'
}
registerEnumType(EnumEntityPagePageType, {
  name: 'EnumEntityPagePageType',
  description: undefined
});
