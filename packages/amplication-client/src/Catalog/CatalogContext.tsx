import { ApolloError } from "@apollo/client";
import React from "react";
import * as models from "../models";
import { Pagination, Sorting } from "../util/useQueryPagination";
import useCatalog from "./hooks/useCatalog";

export interface CatalogContextInterface {
  catalog: models.Resource[];
  loading: boolean;
  error: ApolloError | undefined;
  setSearchPhrase: (searchPhrase: string) => void;
  setFilter: (filters: Record<string, string>) => void;
  pagination: Pagination;
  sorting: Sorting<models.ResourceOrderByInput[]>;
  reloadCatalog: () => void;
  searchPhrase: string;
}

const initialContext: CatalogContextInterface = {
  catalog: [],
  loading: false,
  error: undefined,
  setSearchPhrase: () => {},
  setFilter: () => {},
  pagination: {
    pageNumber: 1,
    setPageNumber: () => {},
    pageSize: 20,
    setPageSize: () => {},
    pageCount: 1,
    recordCount: 0,
    triggerLoadMore: () => {},
  },
  sorting: {
    orderBy: [],
    setOrderBy: () => {},
  },
  reloadCatalog: () => {},
  searchPhrase: "",
};

export const CatalogContext =
  React.createContext<CatalogContextInterface>(initialContext);

export const CatalogContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {
    catalog,
    loading,
    error,
    setFilter,
    setSearchPhrase,
    pagination,
    sorting,
    reloadCatalog,
    searchPhrase,
  } = useCatalog();

  const contextValue: CatalogContextInterface = {
    catalog,
    loading,
    error,
    setFilter,
    setSearchPhrase,
    pagination,
    sorting,
    reloadCatalog,
    searchPhrase,
  };

  return (
    <CatalogContext.Provider value={contextValue}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalogContext = () => {
  const context = React.useContext(CatalogContext);
  if (context === undefined)
    throw Error(
      "useCatalogContext must be used within a CatalogContextProvider"
    );

  return context;
};
