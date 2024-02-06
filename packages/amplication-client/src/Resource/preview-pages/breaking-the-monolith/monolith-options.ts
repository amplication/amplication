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
    description: "The open-source Calendly successor.",
    linkToRepository: "https://github.com/calcom/cal.com",
  },
  {
    name: EnumSchemaNames.NextCrmApp,
    displayName: "Next CRM App",
    description:
      "NextCRM is a CRM build on top of the Next.JS 14 using TypeScript, great UI library shadcn, Prisma and MongoDB as a database",
    linkToRepository: "https://github.com/pdovhomilja/nextcrm-app",
  },
  {
    name: EnumSchemaNames.Abby,
    displayName: "Abby",
    description: "an open source feature management and A/B testing platform",
    linkToRepository: "https://github.com/tryabby/abby",
  },
  {
    name: EnumSchemaNames.WebStudio,
    displayName: "Web Studio",
    description:
      "Webstudio is an Open Source Visual Development Platform for developers, designers, and cross-functional teams.",
    linkToRepository: "https://github.com/webstudio-is/webstudio",
  },
];
