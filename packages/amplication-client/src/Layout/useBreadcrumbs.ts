import { useEffect, useContext } from "react";
import BreadcrumbsContext from "../Layout/BreadcrumbsContext";

export default function useBreadcrumbs(name: string, url: string) {
  const breadcrumbsContext = useContext(BreadcrumbsContext);

  useEffect(() => {
    breadcrumbsContext.registerItem({
      name: name,
      url: url,
    });
    return () => {
      breadcrumbsContext.unregisterItem(url);
    };
  }, [
    name,
    url,
    breadcrumbsContext.registerItem,
    breadcrumbsContext.unregisterItem,
  ]);

  return null;
}
