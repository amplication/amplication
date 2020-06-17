import { registerEnumType } from '@nestjs/graphql';

export enum EnumEntityPageType {
  SingleRecord = 'SingleRecord',
  List = 'List',
  MasterDetails = 'MasterDetails'
}

registerEnumType(EnumEntityPageType, {
  name: 'EnumEntityPageType',
  description: undefined
});
