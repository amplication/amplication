import { applyDecorators, SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

// eslint-disable-next-line @typescript-eslint/naming-convention
const PublicAuthMiddleware = SetMetadata(IS_PUBLIC_KEY, true);
// eslint-disable-next-line @typescript-eslint/naming-convention
const PublicAuthSwagger = SetMetadata("swagger/apiSecurity", ["isPublic"]);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Public = () =>
  applyDecorators(PublicAuthMiddleware, PublicAuthSwagger);
