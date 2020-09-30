import {
  GCS_HOST,
  InvalidHostError,
  NO_BUCKET_ERROR_MESSAGE,
  NO_OBJECT_ERROR_MESSAGE,
  parseGCSAuthenticatedURL
} from './gcs.util';

const EXAMPLE_BUCKET = 'example-bucket';
const EXAMPLE_OBJECT = 'example-directory/example-filename';
const EXAMPLE_AUTHENTICATED_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}/${EXAMPLE_OBJECT}`;
const EXAMPLE_INVALID_HOST = 'example.com';
const EXAMPLE_INVALID_HOST_URL = `https://${EXAMPLE_INVALID_HOST}`;
const EXAMPLE_MISSING_BUCKET_URL = `https://${GCS_HOST}`;
const EXAMPLE_MISSING_OBJECT_URL = `https://${GCS_HOST}/${EXAMPLE_BUCKET}`;

describe('parseGCSAuthenticatedURL', () => {
  test('parses authenticated URL correctly', () => {
    expect(parseGCSAuthenticatedURL(EXAMPLE_AUTHENTICATED_URL)).toEqual({
      bucket: EXAMPLE_BUCKET,
      object: EXAMPLE_OBJECT
    });
  });
  test('fails for invalid host', () => {
    expect(() => parseGCSAuthenticatedURL(EXAMPLE_INVALID_HOST_URL)).toThrow(
      new InvalidHostError(EXAMPLE_INVALID_HOST)
    );
  });
  test('fails for missing bucket', () => {
    expect(() => parseGCSAuthenticatedURL(EXAMPLE_MISSING_BUCKET_URL)).toThrow(
      NO_BUCKET_ERROR_MESSAGE
    );
  });
  test('fails for missing object', () => {
    expect(() => parseGCSAuthenticatedURL(EXAMPLE_MISSING_OBJECT_URL)).toThrow(
      NO_OBJECT_ERROR_MESSAGE
    );
  });
});
