export const GCS_HOST = "storage.googleapis.com";
export const NO_BUCKET_ERROR_MESSAGE =
  "Google Cloud Storage object URL pathname first part must be a name of a bucket";
export const NO_OBJECT_ERROR_MESSAGE =
  "Google Cloud Storage object URL pathname second part must be a path of an object";
const PATH_DELIMITER = "/";

export class InvalidHostError extends Error {
  constructor(host: string) {
    super(
      `Google Cloud Storage object URL host must be: ${GCS_HOST} instead received ${host}`
    );
  }
}

export const parseGCSObjectURL = (
  objectURL: string
): { bucket: string; object: string } => {
  const url = new URL(objectURL);
  if (url.host !== GCS_HOST) {
    throw new InvalidHostError(url.host);
  }
  const [, bucket, ...rest] = url.pathname.split(PATH_DELIMITER);
  if (!bucket) {
    throw new Error(NO_BUCKET_ERROR_MESSAGE);
  }
  const object = rest.join(PATH_DELIMITER);
  if (!object) {
    throw new Error(NO_OBJECT_ERROR_MESSAGE);
  }
  return { bucket, object };
};
