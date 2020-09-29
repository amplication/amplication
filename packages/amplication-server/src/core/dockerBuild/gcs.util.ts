const PATH_DELIMITER = '/';

export const parseGCSAuthenticatedURL = (
  authenticatedURL: string
): { bucket: string; object: string } => {
  const url = new URL(authenticatedURL);
  const [bucket, ...rest] = url.pathname.split(PATH_DELIMITER);
  return { bucket, object: rest.join(PATH_DELIMITER) };
};
