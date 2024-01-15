import { EnumSchemaNames } from "../../../models";

export type MonolithOption = {
  name: EnumSchemaNames;
  displayName: string;
  description: string;
  linkToRepository: string;
};

export const monolithOptions: MonolithOption[] = [
  {
    name: EnumSchemaNames.CalDotCom,
    displayName: "Cal.com",
    description: "Scheduling infrastructure for absolutely everyone.",
    linkToRepository: "https://github.com/calcom/cal.com",
  },
];
