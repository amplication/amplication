import { parseGCSAuthenticatedURL } from './gcs.util';

const EXAMPLE_AUTHENTICATED_URL =
  'https://storage.cloud.google.com/amplication-artifacts/generated-applications/ckfc6hu0s31030ws6kz1cm5wc.zip';
const EXAMPLE_BUCKET = 'amplication-artifacts';
const EXAMPLE_OBJECT = 'generated-applications/ckfc6hu0s31030ws6kz1cm5wc.zip';

describe('parseGCSAuthenticatedURL', () => {
  test('parses authenticated URL correctly', () => {
    expect(parseGCSAuthenticatedURL(EXAMPLE_AUTHENTICATED_URL)).toEqual({
      bucket: EXAMPLE_BUCKET,
      object: EXAMPLE_OBJECT
    });
  });
});
