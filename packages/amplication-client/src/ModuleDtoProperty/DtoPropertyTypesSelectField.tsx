import {
  EnumButtonStyle,
  EnumItemsAlign,
  FlexItem,
  Icon,
  Label,
  MultiStateToggle,
  SearchField,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  ToggleField,
} from "@amplication/ui/design-system";
import { useField } from "formik";
import React, { useCallback, useContext, useMemo, useState } from "react";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import { AppContext } from "../context/appContext";
import {
  EnumModuleDtoPropertyType,
  EnumModuleDtoType,
  EnumResourceType,
  ModuleDto,
  Resource,
} from "../models";

import ProgressBar from "../Components/ProgressBar";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import "./DtoPropertyTypesSelectField.scss";

type PrimitiveTypes = Exclude<
  EnumModuleDtoPropertyType,
  EnumModuleDtoPropertyType.Dto | EnumModuleDtoPropertyType.Enum
>;

export const typeMapping: {
  [key in PrimitiveTypes]: {
    label: string;
  };
} = {
  [EnumModuleDtoPropertyType.Boolean]: {
    label: "Boolean",
  },
  [EnumModuleDtoPropertyType.DateTime]: {
    label: "DateTime",
  },
  [EnumModuleDtoPropertyType.Float]: {
    label: "Float",
  },
  [EnumModuleDtoPropertyType.Integer]: {
    label: "Integer",
  },
  [EnumModuleDtoPropertyType.Json]: {
    label: "Json",
  },
  [EnumModuleDtoPropertyType.String]: {
    label: "String",
  },
  [EnumModuleDtoPropertyType.Null]: {
    label: "Null",
  },
  [EnumModuleDtoPropertyType.Undefined]: {
    label: "Undefined",
  },
};

export const TYPE_OPTIONS = Object.values(EnumModuleDtoPropertyType)
  .filter(
    (value) =>
      ![EnumModuleDtoPropertyType.Dto, EnumModuleDtoPropertyType.Enum].includes(
        value
      )
  )
  .map((value) => ({
    label: typeMapping[value].label,
    value,
  }));

type Props = {
  name: string;
  label: string;
};

type DtoListGroupedByResourceAndModule = {
  //resource id
  [key: string]: {
    resource: Resource;
    modules: {
      //module name
      [key: string]: {
        moduleName: string;
        dtos: ModuleDto[];
      };
    };
  };
};

export enum EnumTypeGroup {
  Primitive = "Primitive",
  DTO = "DTO",
  Enum = "Enum",
}

const OPTIONS: { value: EnumTypeGroup; label: string }[] = [
  { value: EnumTypeGroup.Primitive, label: "Primitive" },
  { value: EnumTypeGroup.DTO, label: "DTO" },
  { value: EnumTypeGroup.Enum, label: "Enum" },
];

const CLASS_NAME = "dto-property-types-select-field";

const DtoPropertyTypesSelectField = ({ name, label }: Props) => {
  const { resources } = useContext(AppContext);

  const [selectedGroup, setSelectedGroup] = React.useState<EnumTypeGroup>(
    EnumTypeGroup.DTO
  );

  const [field, meta] = useField(name);

  const resourceDictionary = useMemo(() => {
    if (!resources) return {};
    return resources.reduce((acc, resource) => {
      acc[resource.id] = resource;
      return acc;
    }, {});
  }, [resources]);

  const {
    availableDtosForCurrentResource: data,
    availableDtosForCurrentResourceError: error,
    availableDtosForCurrentResourceLoading: loading,
  } = useModuleDto();

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const filteredDtos = useMemo(() => {
    if (data && data.moduleDtos) {
      return data.moduleDtos.filter((dto) => {
        return dto.name.toLowerCase().includes(searchPhrase.toLowerCase());
      });
    }
    return [];
  }, [data, searchPhrase]);

  const dtoList = useMemo((): {
    groups: DtoListGroupedByResourceAndModule;
    count: number;
  } => {
    if (data && data.moduleDtos) {
      const filteredList = filteredDtos.filter(
        (dto) =>
          ![EnumModuleDtoType.Enum, EnumModuleDtoType.CustomEnum].includes(
            dto.dtoType
          )
      );

      const group = filteredList.reduce((acc, dto) => {
        if (!acc[dto.resourceId]) {
          acc[dto.resourceId] = {
            resource: resourceDictionary[dto.resourceId],
            modules: {},
          };
        }
        if (!acc[dto.resourceId].modules[dto.parentBlock.displayName]) {
          acc[dto.resourceId].modules[dto.parentBlock.displayName] = {
            moduleName: dto.parentBlock.displayName,
            dtos: [],
          };
        }
        acc[dto.resourceId].modules[dto.parentBlock.displayName].dtos.push(dto);
        return acc;
      }, {} as DtoListGroupedByResourceAndModule);

      return {
        groups: group,
        count: filteredList.length,
      };
    }
    return undefined;
  }, [data, filteredDtos, resourceDictionary]);

  const enumList = useMemo((): {
    groups: DtoListGroupedByResourceAndModule;
    count: number;
  } => {
    if (data && data.moduleDtos) {
      const filteredList = filteredDtos.filter((dto) =>
        [EnumModuleDtoType.Enum, EnumModuleDtoType.CustomEnum].includes(
          dto.dtoType
        )
      );

      const groups = filteredList
        .filter((dto) =>
          [EnumModuleDtoType.Enum, EnumModuleDtoType.CustomEnum].includes(
            dto.dtoType
          )
        )
        .reduce((acc, dto) => {
          if (!acc[dto.resourceId]) {
            acc[dto.resourceId] = {
              resource: resourceDictionary[dto.resourceId],
              modules: {},
            };
          }
          if (!acc[dto.resourceId].modules[dto.parentBlock.displayName]) {
            acc[dto.resourceId].modules[dto.parentBlock.displayName] = {
              moduleName: dto.parentBlock.displayName,
              dtos: [],
            };
          }
          acc[dto.resourceId].modules[dto.parentBlock.displayName].dtos.push(
            dto
          );
          return acc;
        }, {} as DtoListGroupedByResourceAndModule);

      return {
        groups,
        count: filteredList.length,
      };
    }
    return undefined;
  }, [data, filteredDtos, resourceDictionary]);

  const optionsWithCount = useMemo(() => {
    return OPTIONS.map((option) => {
      switch (option.value) {
        case EnumTypeGroup.Primitive:
          return {
            ...option,
            label: `${option.label} (${TYPE_OPTIONS.length})`,
          };
        case EnumTypeGroup.DTO:
          return {
            ...option,
            label: `${option.label} (${dtoList?.count || 0})`,
          };
        case EnumTypeGroup.Enum:
          return {
            ...option,
            label: `${option.label} (${enumList?.count || 0})`,
          };
      }
    });
  }, [dtoList?.count, enumList?.count]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const onDtoSelected = useCallback(
    (dto: ModuleDto) => {
      field.onChange({
        target: {
          name: name,
          value: {
            type: EnumModuleDtoPropertyType.Dto,
            isArray: field.value.isArray,
            dtoId: dto.id,
          },
        },
      });
    },
    [field, name]
  );

  const selectedValue = useMemo(() => {
    if (meta.value?.type === EnumModuleDtoPropertyType.Dto) {
      const dto = data?.moduleDtos.find((dto) => dto.id === meta.value?.dtoId);
      return field.value.isArray ? `${dto?.name}[]` : dto?.name;
    } else {
      return field.value.isArray ? `${meta.value?.type}[]` : meta.value?.type;
    }
  }, [meta.value, data?.moduleDtos, field.value?.isArray]);

  return (
    <div className={CLASS_NAME}>
      <SelectMenu
        title={selectedValue}
        buttonStyle={EnumButtonStyle.Outline}
        className={`${CLASS_NAME}__menu`}
        icon="chevron_down"
        buttonAsTextBox
        buttonAsTextBoxLabel={label}
      >
        <SelectMenuModal>
          <SelectMenuList className={`${CLASS_NAME}__modal-wrapper`}>
            <div className={`${CLASS_NAME}__header`}>
              <SearchField
                label="search"
                placeholder="Search"
                onChange={handleSearchChange}
                value={searchPhrase}
              />

              <MultiStateToggle
                label=""
                name="action_"
                options={optionsWithCount}
                onChange={(group) => {
                  setSelectedGroup(EnumTypeGroup[group]);
                }}
                selectedValue={selectedGroup}
              />
            </div>
            <div className={`${CLASS_NAME}__sub_header`}>
              <ToggleField name={`${name}.isArray`} label="Array" />
            </div>
            <div className={`${CLASS_NAME}__container`}>
              {selectedGroup === EnumTypeGroup.Primitive && (
                <>
                  {TYPE_OPTIONS.map((option) => (
                    <SelectMenuItem
                      closeAfterSelectionChange
                      key={option.value}
                      onSelectionChange={() => {
                        field.onChange({
                          target: {
                            name: `${name}.type`,
                            value: option.value,
                          },
                        });
                      }}
                      selected={option.value === meta.value?.type}
                    >
                      {option.label}
                    </SelectMenuItem>
                  ))}
                </>
              )}
              {selectedGroup === EnumTypeGroup.DTO && dtoList && (
                <TypeGroup
                  group={dtoList?.groups}
                  onSelectionChange={onDtoSelected}
                  selectedDtoId={meta.value?.dtoId}
                  loading={loading}
                />
              )}
              {selectedGroup === EnumTypeGroup.Enum && enumList && (
                <TypeGroup
                  group={enumList.groups}
                  onSelectionChange={onDtoSelected}
                  selectedDtoId={meta.value?.dtoId}
                  loading={loading}
                />
              )}
            </div>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
};

export default DtoPropertyTypesSelectField;

type TypeGroupProps = {
  group: DtoListGroupedByResourceAndModule;
  onSelectionChange?: (dto: ModuleDto) => void;
  selectedDtoId: string;
  loading: boolean;
};

const TypeGroup = ({
  group,
  onSelectionChange,
  selectedDtoId,
  loading,
}: TypeGroupProps) => {
  return (
    <>
      {loading && <ProgressBar />}
      {Object.values(group).map((resourceGroup) => (
        <div className={`${CLASS_NAME}__group`}>
          <div className={`${CLASS_NAME}__group-name`}>
            <ResourceCircleBadge type={EnumResourceType.Service} size="small" />

            {resourceGroup.resource.name}
          </div>
          {Object.values(resourceGroup.modules).map((moduleGroup) => (
            <div className={`${CLASS_NAME}__group`}>
              <div className={`${CLASS_NAME}__group-name`}>
                <Icon icon="box" />
                {moduleGroup.moduleName}
              </div>

              {Object.values(moduleGroup.dtos).map((dto) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  key={dto.id}
                  itemData={dto}
                  onSelectionChange={onSelectionChange}
                  selected={dto.id === selectedDtoId}
                >
                  <FlexItem>
                    <Icon icon="zap" />

                    <FlexItem
                      itemsAlign={EnumItemsAlign.Center}
                      singeChildWithEllipsis
                    >
                      {dto.name}
                    </FlexItem>
                  </FlexItem>
                </SelectMenuItem>
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
