import { EnumDataType } from 'src/enums/EnumDataType';
import { EntityField } from 'src/models';
export const CURRENT_VERSION_NUMBER = 0;

export const INITIAL_ENTITY_FIELDS: Omit<
  EntityField,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  {
    dataType: EnumDataType.Id,
    name: 'id',
    displayName: 'ID',
    description: 'Auto-generated unique ID',
    required: true,
    searchable: true,
    properties: {}
  },
  {
    dataType: EnumDataType.CreatedAt,
    name: 'createdAt',
    displayName: 'Created At',
    description:
      'Auto-generated field to hold the date and time of the record creation',
    required: true,
    searchable: false,
    properties: {}
  },
  {
    dataType: EnumDataType.UpdatedAt,
    name: 'updatedAt',
    displayName: 'Updated At',
    description:
      'Auto-generated field to hold the date and time of the last update',
    required: true,
    searchable: false,
    properties: {}
  }
];
