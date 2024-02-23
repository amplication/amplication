import { EnumSchemaNames } from "../../models";

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
    name: EnumSchemaNames.Formbricks,
    displayName: "Formbricks",
    description:
      "Formbricks provides a free and open source surveying platform. Gather feedback at every point in the user journey with beautiful in-app, website, link and email surveys. Build on top of Formbricks or leverage prebuilt data analysis capabilities",
    linkToRepository: "https://github.com/formbricks/formbricks",
  },
  {
    name: EnumSchemaNames.Abby,
    displayName: "Abby",
    description: "an open source feature management and A/B testing platform",
    linkToRepository: "https://github.com/tryabby/abby",
  },
  {
    name: EnumSchemaNames.Papermark,
    displayName: "Papermark",
    description:
      "Papermark is the open-source DocSend alternative with built-in analytics and custom domains.",
    linkToRepository: "https://github.com/mfts/papermark",
  },
];
