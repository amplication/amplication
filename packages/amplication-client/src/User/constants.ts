import { PageContent } from "../Layout/WelcomePage";
import amplicationLogo from "../assets/logo-amplication-white.svg";
import recastLogo from "../assets/logo-recast.svg";

type PageContentOptions = {
  [key: string]: PageContent;
};

export const DEFAULT_PAGE_SOURCE = "default";

export const SIGN_IN_PAGE_CONTENT: PageContentOptions = {
  rc: {
    name: "Recast",
    title: "Convert your excel sheet into Node.js resource",
    subTitle: "",
    logo: recastLogo,
    message: "Recast is built on and powered by Amplication.",
  },
  [DEFAULT_PAGE_SOURCE]: {
    name: "Amplication",
    title: "Instantly generate quality Node.js resources",
    subTitle: "Just code what matters.",
    logo: amplicationLogo,
    message: "",
  },
};
