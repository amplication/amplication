import { AccessControlModule, RolesBuilder } from "nest-access-control";
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import grants from "../grants.json";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ACLModule = AccessControlModule.forRoles(new RolesBuilder(grants));
