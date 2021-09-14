export function createBearerAuthorizationHeader(accessToken: string) {
  return `Bearer ${accessToken}`;
}
