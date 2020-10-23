import { JsonObject } from 'type-fest';
import { EnumDataType } from 'src/enums/EnumDataType';
import { EntityField, Entity } from 'src/models';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';
import { EnumEntityPermissionType } from 'src/enums/EnumEntityPermissionType';
import { EntityPermissionCreateWithoutEntityVersionInput } from '@prisma/client';

export const CURRENT_VERSION_NUMBER = 0;

type EntityFieldData = Omit<
  EntityField,
  'id' | 'createdAt' | 'updatedAt' | 'permanentId' | 'properties'
> & { properties: JsonObject };

export const USER_ENTITY_NAME = 'User';
export const USER_ENTITY_FIELDS = ['password', 'username'];

export const DEFAULT_PERMISSIONS: EntityPermissionCreateWithoutEntityVersionInput[] = [
  {
    action: EnumEntityAction.Create,
    type: EnumEntityPermissionType.AllRoles
  },
  {
    action: EnumEntityAction.Update,
    type: EnumEntityPermissionType.AllRoles
  },
  {
    action: EnumEntityAction.View,
    type: EnumEntityPermissionType.AllRoles
  },
  {
    action: EnumEntityAction.Delete,
    type: EnumEntityPermissionType.AllRoles
  },
  {
    action: EnumEntityAction.Search,
    type: EnumEntityPermissionType.AllRoles
  }
];

export const INITIAL_ENTITY_FIELDS: EntityFieldData[] = [
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

type EntityData = Omit<
  Entity,
  'id' | 'createdAt' | 'updatedAt' | 'app' | 'appId' | 'fields'
> & {
  fields: EntityFieldData[];
};

export const DEFAULT_SINGLE_LINE_TEXT_MAX_LENGTH = 256;

export const DEFAULT_ENTITIES: EntityData[] = [
  {
    name: USER_ENTITY_NAME,
    displayName: 'User',
    pluralDisplayName: 'Users',
    description:
      'An automatically created entity to manage users in the application',
    fields: [
      ...INITIAL_ENTITY_FIELDS,
      {
        dataType: EnumDataType.SingleLineText,
        name: 'firstName',
        displayName: 'First Name',
        description:
          'An automatically created field of the first name of the user',
        required: false,
        searchable: true,
        properties: {
          maxLength: DEFAULT_SINGLE_LINE_TEXT_MAX_LENGTH
        }
      },
      {
        dataType: EnumDataType.SingleLineText,
        name: 'lastName',
        displayName: 'Last Name',
        description:
          'An automatically created field of the last name of the user',
        required: false,
        searchable: true,
        properties: {
          maxLength: DEFAULT_SINGLE_LINE_TEXT_MAX_LENGTH
        }
      }
    ]
  }
];
