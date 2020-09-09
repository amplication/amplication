import { useEffect, useContext } from "react";
import BreadcrumbsContext, {
  BreadcrumbItem,
} from "../Layout/BreadcrumbsContext";

export default function useBreadcrumbs(name: string, url: string) {
  const breadcrumbsContext = useContext(BreadcrumbsContext);

  useEffect(() => {
    console.log("useBC item ", name, url);
    breadcrumbsContext.registerItem({
      name: name,
      url: url,
    });
    return () => {
      breadcrumbsContext.unregisterItem(url);
    };
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, [
    name,
    url,
    breadcrumbsContext.registerItem,
    breadcrumbsContext.unregisterItem,
  ]);

  return null;
}
