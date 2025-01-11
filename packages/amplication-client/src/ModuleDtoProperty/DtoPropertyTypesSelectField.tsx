import {
  EnumButtonStyle,
  EnumItemsAlign,
  EnumTextColor,
  FlexItem,
  Icon,
  MultiStateToggle,
  SearchField,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  ToggleField,
  Tooltip,
} from "@amplication/ui/design-system";
import { FieldMetaProps, useField } from "formik";
import React, { useCallback, useContext, useMemo, useState } from "react";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import { AppContext } from "../context/appContext";
import {
  EnumModuleDtoPropertyType,
  EnumModuleDtoType,
  ModuleDto,
  PropertyTypeDef,
  Resource,
} from "../models";

import { Link, useRouteMatch } from "react-router-dom";
import ProgressBar from "../Components/ProgressBar";
import ResourceTypeBadge from "../Components/ResourceTypeBadge";
import NewModuleDtoButton from "../ModuleDto/NewModuleDtoButton";
import NewModuleDtoEnumButton from "../ModuleDto/NewModuleDtoEnumButton";
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
      ![
        EnumModuleDtoPropertyType.Dto,
        EnumModuleDtoPropertyType.Enum,
        EnumModuleDtoPropertyType.Undefined,
        EnumModuleDtoPropertyType.Null,
      ].includes(value)
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
  const moduleMatch = useRouteMatch<{
    module: string;
  }>("/:workspace/:project/:resource/modules/:module");

  const { module: moduleId } = moduleMatch?.params ?? {};

  const [field, meta] = useField<PropertyTypeDef>(name);

  const {
    availableDtosForCurrentResource: data,
    availableDtosForCurrentResourceError: error,
    availableDtosForCurrentResourceLoading: loading,
    getModuleDtoUrl,
  } = useModuleDto();

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

  const onPrimitiveSelected = useCallback(
    (type: EnumModuleDtoPropertyType) => {
      field.onChange({
        target: {
          name: name,
          value: {
            type,
            isArray: field.value.isArray,
          },
        },
      });
    },
    [field, name]
  );

  const selectedValue = useMemo(() => {
    if (meta.value?.type === EnumModuleDtoPropertyType.Dto) {
      const dto = data?.moduleDtos.find((dto) => dto.id === meta.value?.dtoId);
      return field.value?.isArray ? `${dto?.name}[]` : dto?.name;
    } else {
      return field.value?.isArray ? `${meta.value?.type}[]` : meta.value?.type;
    }
  }, [meta.value, data?.moduleDtos, field.value?.isArray]);

  const selectedDtoUrl = useMemo(() => {
    if (meta.value?.type === EnumModuleDtoPropertyType.Dto) {
      const dto = data?.moduleDtos.find((dto) => dto.id === meta.value?.dtoId);
      return dto && getModuleDtoUrl(dto);
    }
  }, [data?.moduleDtos, getModuleDtoUrl, meta.value?.dtoId, meta.value?.type]);

  return (
    <FlexItem className={CLASS_NAME} itemsAlign={EnumItemsAlign.End}>
      <SelectMenu
        title={selectedValue}
        buttonStyle={EnumButtonStyle.Outline}
        className={`${CLASS_NAME}__menu`}
        icon="chevron_down"
        buttonAsTextBox
        buttonAsTextBoxLabel={label}
      >
        <ModalContent
          meta={meta}
          name={name}
          moduleId={moduleId}
          moduleDtos={data?.moduleDtos}
          loading={loading}
          onDtoSelected={onDtoSelected}
          onPrimitiveSelected={onPrimitiveSelected}
        />
      </SelectMenu>
      {selectedDtoUrl && (
        <Link to={selectedDtoUrl} className={`${CLASS_NAME}__go-to`}>
          <Tooltip aria-label="Go to DTO" direction="n" noDelay>
            <Icon icon="arrow-right-circle" color={EnumTextColor.Black20} />
          </Tooltip>
        </Link>
      )}
    </FlexItem>
  );
};

type ModalContentProps = {
  meta: FieldMetaProps<PropertyTypeDef>;
  name: string;
  moduleId: string;
  moduleDtos: ModuleDto[];
  loading: boolean;
  onDtoSelected: (dto: ModuleDto) => void;
  onPrimitiveSelected: (type: EnumModuleDtoPropertyType) => void;
};

const ModalContent = ({
  meta,
  name,
  moduleDtos,
  moduleId,
  loading,
  onDtoSelected,
  onPrimitiveSelected,
}: ModalContentProps) => {
  const [selectedGroup, setSelectedGroup] = React.useState<EnumTypeGroup>(
    EnumTypeGroup.DTO
  );
  const { resources, currentResource } = useContext(AppContext);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const resourceDictionary = useMemo(() => {
    if (!resources) return {};
    return resources.reduce((acc, resource) => {
      acc[resource.id] = resource;
      return acc;
    }, {});
  }, [resources]);

  const filteredDtos = useMemo(() => {
    if (moduleDtos) {
      return moduleDtos.filter((dto) => {
        return dto.name.toLowerCase().includes(searchPhrase.toLowerCase());
      });
    }
    return [];
  }, [moduleDtos, searchPhrase]);

  const dtoList = useMemo((): {
    groups: DtoListGroupedByResourceAndModule;
    count: number;
  } => {
    if (moduleDtos) {
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
  }, [moduleDtos, filteredDtos, resourceDictionary]);

  const enumList = useMemo((): {
    groups: DtoListGroupedByResourceAndModule;
    count: number;
  } => {
    if (moduleDtos) {
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
  }, [moduleDtos, filteredDtos, resourceDictionary]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

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

  return (
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
          <FlexItem itemsAlign={EnumItemsAlign.Center}>
            <NewModuleDtoButton
              resourceId={currentResource?.id}
              moduleId={moduleId}
              navigateToDtoOnCreate={false}
              onDtoCreated={onDtoSelected}
            />
            |
            <NewModuleDtoEnumButton
              resourceId={currentResource?.id}
              moduleId={moduleId}
              navigateToDtoOnCreate={false}
              onDtoCreated={onDtoSelected}
            />
          </FlexItem>
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
                  itemData={option.value}
                  onSelectionChange={onPrimitiveSelected}
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
  );
};

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
        <div className={`${CLASS_NAME}__group`} key={resourceGroup.resource.id}>
          <div className={`${CLASS_NAME}__group-name`}>
            <ResourceTypeBadge resource={resourceGroup.resource} size="small" />

            {resourceGroup.resource.name}
          </div>
          {Object.values(resourceGroup.modules).map((moduleGroup) => (
            <div
              className={`${CLASS_NAME}__group`}
              key={moduleGroup.moduleName}
            >
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

export default DtoPropertyTypesSelectField;
