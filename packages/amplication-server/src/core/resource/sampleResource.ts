/**
 * This module defines creating a sample resource.
 * When a workspace is created it is provided with one.
 */

import { EnumResourceType } from '@amplication/prisma-db';
import cuid from 'cuid';
import { EnumDataType } from 'src/enums/EnumDataType';
import {
  DEFAULT_SINGLE_LINE_TEXT_MAX_LENGTH,
  INITIAL_ENTITY_FIELDS
} from '../entity/constants';
import { BulkEntityData, BulkEntityFieldData } from '../entity/entity.service';
import { ResourceCreateInput } from './dto';

export const SAMPLE_SERVICE_DATA: ResourceCreateInput = {
  description: 'Sample Service for task management',
  name: 'My sample service',
  type: EnumResourceType.Service
};

export const CREATE_SAMPLE_ENTITIES_COMMIT_MESSAGE = 'Create sample entities';

export const PROJECT_OWNER_FIELD: BulkEntityFieldData = {
  displayName: 'Owner',
  name: 'owner',
  dataType: EnumDataType.Lookup,
  required: true,
  unique: false,
  searchable: false,
  description: '',
  properties: {
    allowMultipleSelection: false
  }
};

export const USER_PROJECTS_FIELD: BulkEntityFieldData = {
  displayName: 'Projects',
  name: 'projects',
  dataType: EnumDataType.Lookup,
  unique: false,
  required: false,
  searchable: false,
  description: 'The list of projects owned by the user',
  properties: {
    allowMultipleSelection: true
  }
};

export const PROJECT_ENTITY: BulkEntityData = {
  name: 'Project',
  displayName: 'Project',
  pluralDisplayName: 'Projects',
  description: 'Stores the data for a project with relation to tasks',
  fields: [
    ...INITIAL_ENTITY_FIELDS,
    {
      displayName: 'Description',
      name: 'description',
      dataType: EnumDataType.MultiLineText,
      unique: false,
      required: false,
      searchable: false,
      description: '',
      properties: {
        maxLength: 2000
      }
    },
    {
      displayName: 'Name',
      name: 'name',
      dataType: EnumDataType.SingleLineText,
      unique: false,
      required: false,
      searchable: false,
      description: '',
      properties: {
        maxLength: DEFAULT_SINGLE_LINE_TEXT_MAX_LENGTH
      }
    },
    {
      displayName: 'Start Date',
      name: 'startDate',
      dataType: EnumDataType.DateTime,
      unique: false,
      required: false,
      searchable: false,
      description: '',
      properties: {
        dateOnly: true,
        timeZone: 'localTime'
      }
    },
    {
      displayName: 'Due Date',
      name: 'dueDate',
      dataType: EnumDataType.DateTime,
      unique: false,
      required: false,
      searchable: false,
      description: '',
      properties: {
        dateOnly: true,
        timeZone: 'localTime'
      }
    }
  ]
};

export const TASK_PROJECT_FIELD: BulkEntityFieldData = {
  displayName: 'Project',
  name: 'project',
  dataType: EnumDataType.Lookup,
  unique: false,
  required: true,
  searchable: true,
  description: '',
  properties: {
    allowMultipleSelection: false
  }
};

export const PROJECT_TASKS_FIELD: BulkEntityFieldData = {
  displayName: 'Tasks',
  name: 'tasks',
  dataType: EnumDataType.Lookup,
  unique: false,
  required: false,
  searchable: false,
  description: 'The list of tasks in this project',
  properties: {
    allowMultipleSelection: true
  }
};

export const TASK_ASSIGNED_TO_FIELD: BulkEntityFieldData = {
  displayName: 'Assigned To',
  name: 'assignedTo',
  dataType: EnumDataType.Lookup,
  unique: false,
  required: false,
  searchable: false,
  description: 'The user who is currently assigned to this task',
  properties: {
    allowMultipleSelection: false
  }
};

export const USER_TASKS_FIELD: BulkEntityFieldData = {
  displayName: 'Tasks',
  name: 'tasks',
  dataType: EnumDataType.Lookup,
  unique: false,
  required: false,
  searchable: false,
  description: 'The list of tasks assigned to the user',
  properties: {
    allowMultipleSelection: true
  }
};

export const TASK_ENTITY: BulkEntityData = {
  name: 'Task',
  displayName: 'Task',
  pluralDisplayName: 'Tasks',
  description: 'Stores the data for specific tasks',
  fields: [
    ...INITIAL_ENTITY_FIELDS,
    {
      displayName: 'Estimation (days)',
      name: 'estimation',
      dataType: EnumDataType.WholeNumber,
      unique: false,
      required: false,
      searchable: false,
      description: 'The estimated time in days',
      properties: {
        maximumValue: 9999999,
        minimumValue: 0
      }
    },
    {
      displayName: 'Start Date',
      name: 'startDate',
      dataType: EnumDataType.DateTime,
      unique: false,
      required: true,
      searchable: false,
      description: '',
      properties: {
        dateOnly: true,
        timeZone: 'localTime'
      }
    },
    {
      displayName: 'Status',
      name: 'status',
      dataType: EnumDataType.OptionSet,
      unique: false,
      required: true,
      searchable: false,
      description: '',
      properties: {
        options: [
          {
            label: 'New',
            value: 'new'
          },
          {
            label: 'Pending',
            value: 'pending'
          },
          {
            label: 'On Hold',
            value: 'onHold'
          },
          {
            label: 'Ongoing',
            value: 'ongoing'
          },
          {
            label: 'Done',
            value: 'done'
          }
        ]
      }
    },
    {
      displayName: 'Title',
      name: 'title',
      dataType: EnumDataType.SingleLineText,
      unique: false,
      required: true,
      searchable: true,
      description: '',
      properties: {
        maxLength: DEFAULT_SINGLE_LINE_TEXT_MAX_LENGTH
      }
    }
  ]
};

/**
 * For given existing user entity ID creates sample resource entities
 * @param userEntityId the ID of the user entity in the database
 * @returns entities to create for the sample resource
 */
export function createSampleResourceEntities(
  userEntityId: string
): {
  entities: BulkEntityData[];
  userEntityFields: (BulkEntityFieldData & { permanentId: string })[];
} {
  // Predefine the project entity ID so it can be used for links.
  const projectEntityId = cuid();
  const taskEntityId = cuid();

  const taskAssignedToFieldId = cuid();
  const userTasksFieldId = cuid();

  const taskProjectFieldId = cuid();
  const projectTasksFieldId = cuid();

  const projectOwnerFieldId = cuid();
  const userProjectsFieldId = cuid();

  return {
    userEntityFields: [
      {
        ...USER_PROJECTS_FIELD,
        permanentId: userProjectsFieldId,
        properties: {
          ...USER_PROJECTS_FIELD.properties,
          relatedEntityId: projectEntityId,
          relatedFieldId: projectOwnerFieldId
        }
      },
      {
        ...USER_TASKS_FIELD,
        permanentId: userTasksFieldId,
        properties: {
          ...USER_TASKS_FIELD.properties,
          relatedEntityId: taskEntityId,
          relatedFieldId: taskAssignedToFieldId
        }
      }
    ],
    entities: [
      {
        ...PROJECT_ENTITY,
        id: projectEntityId,
        fields: [
          ...PROJECT_ENTITY.fields,
          {
            ...PROJECT_OWNER_FIELD,
            permanentId: projectOwnerFieldId,
            properties: {
              ...PROJECT_OWNER_FIELD.properties,
              relatedEntityId: userEntityId,
              relatedFieldId: userProjectsFieldId
            }
          },
          {
            ...PROJECT_TASKS_FIELD,
            permanentId: projectTasksFieldId,
            properties: {
              ...PROJECT_TASKS_FIELD.properties,
              relatedEntityId: taskEntityId,
              relatedFieldId: taskProjectFieldId
            }
          }
        ]
      },
      {
        ...TASK_ENTITY,
        id: taskEntityId,
        fields: [
          ...TASK_ENTITY.fields,
          {
            ...TASK_PROJECT_FIELD,
            permanentId: taskProjectFieldId,
            properties: {
              ...TASK_PROJECT_FIELD.properties,
              relatedEntityId: projectEntityId,
              relatedFieldId: projectTasksFieldId
            }
          },
          {
            ...TASK_ASSIGNED_TO_FIELD,
            permanentId: taskAssignedToFieldId,
            properties: {
              ...TASK_ASSIGNED_TO_FIELD.properties,
              relatedEntityId: userEntityId,
              relatedFieldId: userTasksFieldId
            }
          }
        ]
      }
    ]
  };
}
