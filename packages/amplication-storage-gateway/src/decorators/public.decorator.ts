import { applyDecorators, SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

const publicAuthMiddleware = SetMetadata(IS_PUBLIC_KEY, true);
const publicAuthSwagger = SetMetadata("swagger/apiSecurity", ["isPublic"]);

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Public = () =>
  applyDecorators(publicAuthMiddleware, publicAuthSwagger);
