import { Entity, EntityField } from 'src/models';

type EntityFieldData = Omit<
  EntityField,
  'id' | 'createdAt' | 'updatedAt' | 'permanentId'
>;

type EntityData = Omit<
  Entity,
  'id' | 'createdAt' | 'updatedAt' | 'app' | 'appId' | 'fields'
> & {
  fields: EntityFieldData[];
};

export const INITIAL_APP_COMMIT_MESSAGE = 'Commit Sample App Entities';

//List of entities to be created in the sample app.
//The list includes references between entities. We use [entityName] notation to allow the bulkCreate operation to map the name to the actual ID.
export const INITIAL_APP_ENTITIES: EntityData[] = [
  {
    name: 'Project',
    displayName: 'Project',
    pluralDisplayName: 'Projects',
    description: 'Stores the data for a project with relation to tasks',
    fields: [
      {
        displayName: 'ID',
        name: 'id',
        dataType: 'Id',
        required: true,
        searchable: true,
        description: 'An automatically created unique identifier of the entity',
        properties: {}
      },
      {
        displayName: 'Description',
        name: 'description',
        dataType: 'MultiLineText',
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
        dataType: 'SingleLineText',
        required: false,
        searchable: false,
        description: '',
        properties: {
          maxLength: 256
        }
      },
      {
        displayName: 'Created At',
        name: 'createdAt',
        dataType: 'CreatedAt',
        required: true,
        searchable: false,
        description:
          'An automatically created field of the time the entity created at',
        properties: {}
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        dataType: 'DateTime',
        required: false,
        searchable: false,
        description: '',
        properties: {
          dateOnly: true,
          timeZone: 'localTime'
        }
      },
      {
        displayName: 'Updated At',
        name: 'updatedAt',
        dataType: 'UpdatedAt',
        required: true,
        searchable: false,
        description:
          'An automatically created field of the last time the entity updated at',
        properties: {}
      },
      {
        displayName: 'Owner',
        name: 'owner',
        dataType: 'Lookup',
        required: true,
        searchable: false,
        description: '',
        properties: {
          relatedEntityId: '[user]',
          allowMultipleSelection: false
        }
      },
      {
        displayName: 'Due Date',
        name: 'dueDate',
        dataType: 'DateTime',
        required: false,
        searchable: false,
        description: '',
        properties: {
          dateOnly: true,
          timeZone: 'localTime'
        }
      }
    ]
  },
  {
    name: 'Task',
    displayName: 'Task',
    pluralDisplayName: 'Tasks',
    description: 'Stores the data for specific tasks',

    fields: [
      {
        displayName: 'Created At',
        name: 'createdAt',
        dataType: 'CreatedAt',
        required: true,
        searchable: false,
        description:
          'An automatically created field of the time the entity created at',
        properties: {}
      },
      {
        displayName: 'Updated At',
        name: 'updatedAt',
        dataType: 'UpdatedAt',
        required: true,
        searchable: false,
        description:
          'An automatically created field of the last time the entity updated at',
        properties: {}
      },
      {
        displayName: 'ID',
        name: 'id',
        dataType: 'Id',
        required: true,
        searchable: true,
        description: 'An automatically created unique identifier of the entity',
        properties: {}
      },
      {
        displayName: 'Estimation (days)',
        name: 'estimation',
        dataType: 'WholeNumber',
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
        dataType: 'DateTime',
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
        dataType: 'OptionSet',
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
        displayName: 'Project',
        name: 'project',
        dataType: 'Lookup',
        required: true,
        searchable: true,
        description: '',
        properties: {
          relatedEntityId: '[project]',
          allowMultipleSelection: false
        }
      },
      {
        displayName: 'Assigned To',
        name: 'assignedTo',
        dataType: 'Lookup',
        required: false,
        searchable: false,
        description: 'The user who is currently assigned to this task',
        properties: {
          relatedEntityId: '[user]',
          allowMultipleSelection: false
        }
      },
      {
        displayName: 'Title',
        name: 'title',
        dataType: 'SingleLineText',
        required: true,
        searchable: true,
        description: '',
        properties: {
          maxLength: 256
        }
      }
    ]
  }
];
