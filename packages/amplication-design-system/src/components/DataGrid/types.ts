export enum SortOrder {
  Ascending = 0,
  Descending = 1,
}

export type SortData = {
  field: string | null;
  order: SortOrder | null;
};

export type FilterItem = {
  value: string;
  label: string;
};

export type FilterChangeData = {
  filterName: string;
  value: string;
};

export type DataFilter = {
  name: string;
  title: string;
  selected: Set<string>;
  filterItems: FilterItem[];
};

export type DataField = {
  name: string;
  title: string;
  icon?: string;
  sortable?: boolean;
  minWidth?: boolean;
};
