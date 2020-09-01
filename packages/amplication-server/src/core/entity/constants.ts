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
    description: 'An automatically created unique identifier of the entity',
    required: true,
    searchable: true,
    properties: {}
  },
  {
    dataType: EnumDataType.CreatedAt,
    name: 'createdAt',
    displayName: 'Created At',
    description:
      'An automatically created field of the time the entity created at',
    required: true,
    searchable: false,
    properties: {}
  },
  {
    dataType: EnumDataType.UpdatedAt,
    name: 'updatedAt',
    displayName: 'Updated At',
    description:
      'An automatically created field of the last time the entity updated at',
    required: true,
    searchable: false,
    properties: {}
  }
];
