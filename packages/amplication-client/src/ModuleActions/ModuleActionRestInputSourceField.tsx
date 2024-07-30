import {
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  OptionItem,
  Panel,
  SelectField,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { useField, useFormikContext } from "formik";
import { useMemo } from "react";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import * as models from "../models";

type Props = {
  disabled?: boolean;
  isCustomAction: boolean;
};

export const REST_INPUT_SOURCE_MAP: {
  [key in models.EnumModuleActionRestInputSource]: {
    label: string;
  };
} = {
  [models.EnumModuleActionRestInputSource.Body]: {
    label: "Body",
  },
  [models.EnumModuleActionRestInputSource.Query]: {
    label: "Query",
  },
  [models.EnumModuleActionRestInputSource.Params]: {
    label: "Params",
  },
  [models.EnumModuleActionRestInputSource.Split]: {
    label: "Split",
  },
};

export const REST_INPUT_SOURCE_OPTIONS = Object.entries(
  REST_INPUT_SOURCE_MAP
).map(([value, content]) => ({
  value,
  label: content.label,
}));

const ModuleActionForm = ({ disabled, isCustomAction }: Props) => {
  const formik = useFormikContext<models.ModuleAction>();

  const { availableDtosDictionary } = useModuleDto();

  const [, meta] = useField("restInputSource");

  const selectedTypeData = useMemo((): {
    allowSplit: boolean;
    options: OptionItem[];
    selectedDto: models.ModuleDto | undefined;
    message: string;
  } => {
    const inputType = formik.values.inputType;
    let options: OptionItem[] = [];
    let selectedDto: models.ModuleDto | undefined;
    let message = null;

    if (meta.value !== models.EnumModuleActionRestInputSource.Split) {
      return {
        allowSplit: false,
        message: null,
        options,
        selectedDto,
      };
    }

    if (
      inputType.type === models.EnumModuleDtoPropertyType.Dto &&
      !!inputType.dtoId
    ) {
      selectedDto = availableDtosDictionary[inputType.dtoId];
      const properties = selectedDto?.properties;
      if (properties && properties.length > 0) {
        options = properties?.map((property) => ({
          label: property.name,
          value: property.name,
        }));
        options.splice(0, 0, {
          label: "[None]",
          value: null,
        });
      } else {
        message = "No properties available on the selected DTO";
      }
    } else {
      message = "Split input source can only be used with DTO input type";
    }

    return {
      allowSplit: true,
      options,
      selectedDto,
      message,
    };
  }, [availableDtosDictionary, formik.values.inputType, meta.value]);

  return (
    <>
      {!(disabled || !isCustomAction) && (
        <>
          <SelectField
            label="Input Source"
            name="restInputSource"
            options={REST_INPUT_SOURCE_OPTIONS}
            inputToolTip={{
              content: (
                <span>
                  Select where the input should be taken from. Choose between
                  Body, Query, or Params. <br />
                  When using a DTO with multiple properties for the action
                  input, you can also choose Split to accept different
                  properties from different sources.
                </span>
              ),
            }}
          />

          {selectedTypeData.message && (
            <Panel panelStyle={EnumPanelStyle.Error}>
              <Text
                textColor={EnumTextColor.White}
                textStyle={EnumTextStyle.Description}
              >
                {selectedTypeData.message}
              </Text>
            </Panel>
          )}
          {selectedTypeData.allowSplit && (
            <>
              <Panel panelStyle={EnumPanelStyle.Transparent}>
                <TabContentTitle
                  title="REST API Input Source Mapping"
                  subTitle={""}
                />
                <SelectField
                  label="Map Property to Body"
                  name="restInputBodyPropertyName"
                  options={selectedTypeData.options}
                />
                <SelectField
                  label="Map Property to Params"
                  name="restInputParamsPropertyName"
                  options={selectedTypeData.options}
                />
                <SelectField
                  label="Map Property to Query"
                  name="restInputQueryPropertyName"
                  options={selectedTypeData.options}
                />
              </Panel>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ModuleActionForm;
