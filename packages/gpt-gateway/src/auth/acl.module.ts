import { AccessControlModule, RolesBuilder } from "nest-access-control";
import grants from "../grants.json";
export const ACLModule = AccessControlModule.forRoles(new RolesBuilder(grants));
