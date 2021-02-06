import cuid from 'cuid';
import {
  createSampleAppEntities,
  PROJECT_ENTITY,
  PROJECT_OWNER_FIELD,
  PROJECT_TASKS_FIELD,
  TASK_ASSIGNED_TO_FIELD,
  TASK_ENTITY,
  TASK_PROJECT_FIELD,
  USER_PROJECTS_FIELD,
  USER_TASKS_FIELD
} from './sampleApp';

const EXAMPLE_USER_ENTITY_ID = 'EXAMPLE_USER_ENTITY_ID';

const EXAMPLE_CUID = 'EXAMPLE_CUID';

jest.mock('cuid');
// eslint-disable-next-line
// @ts-ignore
cuid.mockImplementation(() => EXAMPLE_CUID);

describe('createSampleAppEntities', () => {
  test('creates sample app entities', () => {
    expect(createSampleAppEntities(EXAMPLE_USER_ENTITY_ID)).toEqual({
      entities: [
        {
          ...PROJECT_ENTITY,
          id: EXAMPLE_CUID,
          fields: [
            ...PROJECT_ENTITY.fields,
            {
              ...PROJECT_OWNER_FIELD,
              permanentId: EXAMPLE_CUID,
              properties: {
                ...PROJECT_OWNER_FIELD.properties,
                relatedEntityId: EXAMPLE_USER_ENTITY_ID,
                relatedFieldId: EXAMPLE_CUID
              }
            },
            {
              ...PROJECT_TASKS_FIELD,
              permanentId: EXAMPLE_CUID,
              properties: {
                ...PROJECT_TASKS_FIELD.properties,
                relatedEntityId: EXAMPLE_CUID,
                relatedFieldId: EXAMPLE_CUID
              }
            }
          ]
        },
        {
          ...TASK_ENTITY,
          id: EXAMPLE_CUID,
          fields: [
            ...TASK_ENTITY.fields,
            {
              ...TASK_PROJECT_FIELD,
              permanentId: EXAMPLE_CUID,
              properties: {
                ...TASK_PROJECT_FIELD.properties,
                relatedEntityId: EXAMPLE_CUID,
                relatedFieldId: EXAMPLE_CUID
              }
            },
            {
              ...TASK_ASSIGNED_TO_FIELD,
              permanentId: EXAMPLE_CUID,
              properties: {
                ...TASK_ASSIGNED_TO_FIELD.properties,
                relatedEntityId: EXAMPLE_USER_ENTITY_ID,
                relatedFieldId: EXAMPLE_CUID
              }
            }
          ]
        }
      ],
      userEntityFields: [
        {
          ...USER_PROJECTS_FIELD,
          permanentId: EXAMPLE_CUID,
          properties: {
            ...USER_PROJECTS_FIELD.properties,
            relatedEntityId: EXAMPLE_CUID,
            relatedFieldId: EXAMPLE_CUID
          }
        },
        {
          ...USER_TASKS_FIELD,
          permanentId: EXAMPLE_CUID,
          properties: {
            ...USER_TASKS_FIELD.properties,
            relatedEntityId: EXAMPLE_CUID,
            relatedFieldId: EXAMPLE_CUID
          }
        }
      ]
    });
  });
});
