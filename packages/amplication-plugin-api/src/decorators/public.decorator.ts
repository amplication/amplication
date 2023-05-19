import { applyDecorators, SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

const PublicAuthMiddleware = SetMetadata(IS_PUBLIC_KEY, true);
const PublicAuthSwagger = SetMetadata("swagger/apiSecurity", ["isPublic"]);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const Public = () =>
  applyDecorators(PublicAuthMiddleware, PublicAuthSwagger);
