import React, { useState, useCallback, useMemo } from "react";
import { sortBy } from "lodash";
import BreadcrumbsContext, { BreadcrumbItem } from "./BreadcrumbsContext";

type Props = {
  children: React.ReactNode;
};

function BreadcrumbsProvider({ children }: Props) {
  const [breadcrumbsItems, setBreadcrumbsItems] = useState<BreadcrumbItem[]>(
    []
  );

  const registerBreadcrumbItem = useCallback(
    (addItem: BreadcrumbItem) => {
      setBreadcrumbsItems((items) => {
        return sortBy(
          [...items.filter((item) => item.url !== addItem.url), addItem],
          (sortItem) => sortItem.url
        );
      });
    },
    [setBreadcrumbsItems]
  );

  const unregisterBreadcrumbItem = useCallback(
    (url: string) => {
      setBreadcrumbsItems((items) => {
        return sortBy(
          items.filter((item) => item.url !== url),
          (sortItem) => sortItem.url
        );
      });
    },
    [setBreadcrumbsItems]
  );

  const breadcrumbsContextValue = useMemo(
    () => ({
      breadcrumbsItems,
      registerItem: registerBreadcrumbItem,
      unregisterItem: unregisterBreadcrumbItem,
    }),
    [breadcrumbsItems, registerBreadcrumbItem, unregisterBreadcrumbItem]
  );

  return (
    <BreadcrumbsContext.Provider value={breadcrumbsContextValue}>
      {children}
    </BreadcrumbsContext.Provider>
  );
}

export default BreadcrumbsProvider;
