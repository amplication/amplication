import { AccessControlModule, RolesBuilder } from "nest-access-control";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import grants from "../grants.json";

export const ACLModule = AccessControlModule.forRoles(new RolesBuilder(grants));
