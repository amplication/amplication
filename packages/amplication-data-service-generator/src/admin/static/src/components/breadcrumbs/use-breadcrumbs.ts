import { useEffect, useContext } from "react";
import BreadcrumbsContext from "./BreadcrumbsContext";

export default function useBreadcrumbs(url: string, name?: string | null) {
  const breadcrumbsContext = useContext(BreadcrumbsContext);

  useEffect(() => {
    breadcrumbsContext.registerItem({
      name,
      url,
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
}
