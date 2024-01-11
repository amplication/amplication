import grants from "../grants.json";
import { AccessControlModule, RolesBuilder } from "nest-access-control";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const ACLModule = AccessControlModule.forRoles(new RolesBuilder(grants));
