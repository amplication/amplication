import { EnumResourceType } from "../models";

export const resourceThemeMap: {
  [key in EnumResourceType]: {
    icon: string;
    color: string;
  };
} = {
  [EnumResourceType.ProjectConfiguration]: {
    icon: "app-settings",
    color: "#FFBD70",
  },
  [EnumResourceType.Service]: {
    icon: "services",
    color: "#A787FF",
  },
};
