import { createContext } from "react";

export type BreadcrumbItem = {
  name?: string | null;
  url: string;
};

export type ContextDataType = {
  breadcrumbsItems: BreadcrumbItem[];
  registerItem: (item: BreadcrumbItem) => void;
  unregisterItem: (url: string) => void;
};

const BreadcrumbsContext = createContext<ContextDataType>({
  breadcrumbsItems: [],
  registerItem: (item: BreadcrumbItem) => {
    throw new Error();
  },
  unregisterItem: (url: string) => {
    throw new Error();
  },
});

export default BreadcrumbsContext;
