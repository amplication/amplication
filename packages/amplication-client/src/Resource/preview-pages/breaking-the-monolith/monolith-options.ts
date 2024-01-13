import { EnumSchemaNames } from "../../../models";

export type MonolithOption = {
  name: EnumSchemaNames;
  displayName: string;
  description: string;
  linkToRepository: string;
  linkToPrismaSchema: string;
  pathToPrismaSchema: string;
};

export const monolithOptions: MonolithOption[] = [
  {
    name: EnumSchemaNames.CalDotCom,
    displayName: "Cal.com",
    description: "Scheduling infrastructure for absolutely everyone.",
    linkToRepository: "https://github.com/calcom/cal.com",
    linkToPrismaSchema:
      "https://github.com/calcom/cal.com/blob/main/packages/prisma/schema.prisma",
    pathToPrismaSchema:
      "packages/amplication-client/src/Resource/preview-pages/breaking-the-monolith/schemas/cal.com.prisma",
  },
];
