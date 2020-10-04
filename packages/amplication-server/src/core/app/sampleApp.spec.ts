import cuid from 'cuid';
import {
  createSampleAppEntities,
  PROJECT_ENTITY,
  PROJECT_OWNER_FIELD,
  TASK_ASSIGNED_TO_FIELD,
  TASK_ENTITY,
  TASK_PROJECT_FIELD
} from './sampleApp';

const EXAMPLE_USER_ENTITY_ID = 'EXAMPLE_USER_ENTITY_ID';

const EXAMPLE_CUID = 'EXAMPLE_CUID';

jest.mock('cuid');
// eslint-disable-next-line
// @ts-ignore
cuid.mockImplementation(() => EXAMPLE_CUID);

describe('createSampleAppEntities', () => {
  test('creates sample app entities', () => {
    expect(createSampleAppEntities(EXAMPLE_USER_ENTITY_ID)).toEqual([
      {
        ...PROJECT_ENTITY,
        id: EXAMPLE_CUID,
        fields: [
          ...PROJECT_ENTITY.fields,
          {
            ...PROJECT_OWNER_FIELD,
            properties: {
              ...PROJECT_OWNER_FIELD.properties,
              relatedEntityId: EXAMPLE_USER_ENTITY_ID
            }
          }
        ]
      },
      {
        ...TASK_ENTITY,
        fields: [
          ...TASK_ENTITY.fields,
          {
            ...TASK_PROJECT_FIELD,
            properties: {
              ...TASK_PROJECT_FIELD.properties,
              relatedEntityId: EXAMPLE_CUID
            }
          },
          {
            ...TASK_ASSIGNED_TO_FIELD,
            properties: {
              ...TASK_ASSIGNED_TO_FIELD.properties,
              relatedEntityId: EXAMPLE_USER_ENTITY_ID
            }
          }
        ]
      }
    ]);
  });
});
