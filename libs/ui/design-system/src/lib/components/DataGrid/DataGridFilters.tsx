import {
  DataGridColumn,
  DataGridRenderFilterProps,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
  Tooltip,
} from "@amplication/ui/design-system";
import {
  Fragment,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const CLASS_NAME = "data-grid-filters";

type Props<T> = {
  onChange: (filters: Record<string, string | string[] | null> | null) => void;
  columns: DataGridColumn<T>[];
  fixedFilters?: Record<string, string | string[] | null>;
  fixedFiltersKey: string; //this must be a unique key to describe the fixed filters (e.g. {currentProjectId})
};

export function DataGridFilters<T>({
  onChange,
  columns,
  fixedFilters = {},
  fixedFiltersKey,
}: Props<T>) {
  //the selected values for each filter
  const [selectedValues, setSelectedValues] = useState<
    Record<string, string | string[] | null>
  >({});
  //the filters that are currently visible
  const [visibleFilters, setVisibleFilters] = useState<string[]>([]);

  //set the selected value for a filter, recalculate the filters object, and call the onChange callback
  const setFilter = (propertyKey: string, value: string) => {
    setSelectedValues((prevValues) => {
      const newFilters = {
        ...prevValues,
        [propertyKey]: value,
      };

      onChange(newFilters);

      return newFilters;
    });
  };

  //add a filter to the visible filters
  const onAddFilter = useCallback(
    (propertyKey: string) => {
      setVisibleFilters((prevFilters) => [...prevFilters, propertyKey]);
      setSelectedValues((prevValues) => {
        const newFilters = {
          ...prevValues,
          [propertyKey]: null,
        };

        onChange(newFilters);

        return newFilters;
      });
    },
    [onChange]
  );

  const onRemoveFilter = useCallback(
    (propertyKey: string) => {
      if (fixedFilters[propertyKey]) {
        return;
      }

      setVisibleFilters((prevFilters) =>
        prevFilters.filter((key) => key !== propertyKey)
      );
      setSelectedValues((prevValues) => {
        const newFilters = { ...prevValues };
        delete newFilters[propertyKey];

        onChange(newFilters);

        return newFilters;
      });
    },
    [fixedFilters, onChange]
  );

  useEffect(() => {
    //reset the filters on first load

    setVisibleFilters(Object.keys(fixedFilters));
    setSelectedValues(() => {
      onChange(fixedFilters);

      return fixedFilters;
    });
    //do not other deps to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedFiltersKey]);

  //get the filterable properties that are not currently visible for the "add filter" menu
  const filterableColumns = useMemo(() => {
    return columns.filter(
      (column) =>
        column.filterable &&
        !visibleFilters.includes(column.key) &&
        !fixedFilters[column.key]
    );
  }, [columns, fixedFilters, visibleFilters]);

  const columnsMap = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.key] = column;
      return acc;
    }, {} as Record<string, DataGridColumn<T>>);
  }, [columns]);

  return (
    <FlexItem
      direction={EnumFlexDirection.Row}
      gap={EnumGapSize.Large}
      itemsAlign={EnumItemsAlign.Center}
      className={CLASS_NAME}
    >
      <Tooltip title="Filters" direction="s">
        <Icon icon="filter" color={EnumTextColor.Black20} />
      </Tooltip>
      {visibleFilters.map((key) => {
        const columnFilter = columnsMap[key]?.renderFilter;

        return (
          <Fragment key={key}>
            {columnFilter ? (
              <FilterComponent
                key={key}
                columnFilter={columnFilter}
                label={columnsMap[key].name}
                columnKey={key}
                selectedValue={selectedValues[key]}
                onChange={setFilter}
                onRemove={onRemoveFilter}
                disabled={!!fixedFilters[key]}
              />
            ) : (
              <Text
                textColor={EnumTextColor.ThemeRed}
                textStyle={EnumTextStyle.Tag}
              >
                filter is missing ({key})
              </Text>
            )}
          </Fragment>
        );
      })}

      {filterableColumns.length > 0 && (
        <SelectMenu
          title={
            <FlexItem
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Text
                textColor={EnumTextColor.Black20}
                textStyle={EnumTextStyle.Tag}
              >
                Add filter
              </Text>
            </FlexItem>
          }
          buttonStyle={EnumButtonStyle.Text}
        >
          <SelectMenuModal>
            <SelectMenuList>
              {filterableColumns.map((prop) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  key={prop.key}
                  itemData={prop.key}
                  onSelectionChange={onAddFilter}
                >
                  {prop.name}
                </SelectMenuItem>
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      )}
    </FlexItem>
  );
}

type FilterComponentProps = DataGridRenderFilterProps & {
  columnFilter: (props: DataGridRenderFilterProps) => ReactNode;
};

// Separate component to avoid conditional hooks rendering
const FilterComponent = ({
  columnFilter,
  key,
  columnKey,
  label,
  selectedValue,
  onChange,
  onRemove,
  disabled,
}: FilterComponentProps) => {
  return (
    <Fragment key={key}>
      {columnFilter({
        key,
        columnKey,
        label,
        selectedValue,
        onChange,
        onRemove,
        disabled,
      })}
    </Fragment>
  );
};
