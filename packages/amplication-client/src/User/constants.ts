import { PageContent } from "../Layout/WelcomePage";
import amplicationLogo from "../assets/logo-amplication-white.svg";

type PageContentOptions = {
  [key: string]: PageContent;
};

export const DEFAULT_PAGE_SOURCE = "default";

export const SIGN_IN_PAGE_CONTENT: PageContentOptions = {
  [DEFAULT_PAGE_SOURCE]: {
    name: "Amplication",
    title: "Instantly generate quality Node.js services",
    subTitle: "Just code what matters.",
    logo: amplicationLogo,
    message: "",
  },
};
