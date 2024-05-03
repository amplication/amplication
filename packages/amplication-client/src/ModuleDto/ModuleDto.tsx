import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Panel,
  Snackbar,
  TabContentTitle,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useEffect } from "react";
import { match } from "react-router-dom";
import ModuleDtoEnumMemberList from "../ModuleDtoEnumMember/ModuleDtoEnumMemberList";
import ModuleDtoPropertyList from "../ModuleDtoProperty/ModuleDtoPropertyList";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import { DeleteModuleDto } from "./DeleteModuleDto";
import ModuleDtoForm from "./ModuleDtoForm";
import useModuleDto from "./hooks/useModuleDto";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    module: string;
    moduleDto: string;
  }>;
};

const DEFAULT_DTO_PROPERTIES_MESSAGE =
  "The properties for this DTO will be generated automatically based on the entity fields and relations.";

const DEFAULT_DTO_MESSAGE =
  "This DTO was created automatically with the entity for its default CRUD operations.";
const ModuleDto = ({ match }: Props) => {
  const { moduleDto: moduleDtoId } = match?.params ?? {};

  const {
    addEntity,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  } = useContext(AppContext);

  const {
    getModuleDto,
    getModuleDtoData: data,
    getModuleDtoError: error,
    getModuleDtoLoading: loading,
    getModuleDtoRefetch: refetch,
    updateModuleDto,
    updateModuleDtoError,
  } = useModuleDto();

  useEffect(() => {
    if (!moduleDtoId) return;
    getModuleDto({
      variables: {
        moduleDtoId,
      },
    }).catch(console.error);
  }, [moduleDtoId, getModuleDto]);

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;

    setResetPendingChangesIndicator(false);
    refetch();
  }, [resetPendingChangesIndicator, setResetPendingChangesIndicator, refetch]);

  const handleSubmit = useCallback(
    (data) => {
      updateModuleDto({
        onCompleted: () => {
          addEntity(moduleDtoId);
        },
        variables: {
          where: {
            id: moduleDtoId,
          },
          data: {
            displayName: data.displayName,
            enabled: data.enabled,
            name: data.name,
          },
        },
      }).catch(console.error);
    },
    [updateModuleDto, moduleDtoId, addEntity]
  );

  const onEnableChanged = useCallback(() => {
    if (!data?.moduleDto) return;
    handleSubmit({
      name: data.moduleDto.name,
      enabled: !data.moduleDto.enabled,
    });
  }, [data?.moduleDto, handleSubmit]);

  const onPropertyListChanged = useCallback(() => {
    refetch();
  }, [refetch]);

  const onEnumMemberListChanged = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasError = Boolean(error) || Boolean(updateModuleDtoError);

  const errorMessage = formatError(error) || formatError(updateModuleDtoError);

  const isCustomEnum =
    data?.moduleDto.dtoType === models.EnumModuleDtoType.CustomEnum;

  const isCustomDto =
    isCustomEnum || data?.moduleDto.dtoType === models.EnumModuleDtoType.Custom;

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.moduleDto?.name}
          subTitle={data?.moduleDto?.description}
        />
        <FlexItem.FlexEnd
          direction={EnumFlexDirection.Row}
          alignSelf={EnumContentAlign.Start}
        >
          {data?.moduleDto && isCustomDto && (
            <>
              <Toggle
                name={"enabled"}
                onValueChange={onEnableChanged}
                checked={data?.moduleDto?.enabled}
              ></Toggle>
              <DeleteModuleDto moduleDto={data?.moduleDto} />
            </>
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {data?.moduleDto && !isCustomDto && (
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <Text textStyle={EnumTextStyle.Tag}>{DEFAULT_DTO_MESSAGE}</Text>
        </Panel>
      )}

      {!loading && (
        <ModuleDtoForm
          isCustomDto={isCustomDto}
          onSubmit={handleSubmit}
          defaultValues={data?.moduleDto}
        />
      )}
      <HorizontalRule doubleSpacing />

      <TabContentTitle title={isCustomEnum ? "Members" : "Properties"} />
      {!isCustomDto ? (
        <Panel panelStyle={EnumPanelStyle.Bordered}>
          <Text textStyle={EnumTextStyle.Tag}>
            {DEFAULT_DTO_PROPERTIES_MESSAGE}
          </Text>
        </Panel>
      ) : isCustomEnum ? (
        <ModuleDtoEnumMemberList
          moduleDto={data?.moduleDto}
          onEnumMemberDelete={onEnumMemberListChanged}
          onEnumMemberAdd={onEnumMemberListChanged}
        />
      ) : (
        <ModuleDtoPropertyList
          moduleDto={data?.moduleDto}
          onPropertyDelete={onPropertyListChanged}
          onPropertyAdd={onPropertyListChanged}
        />
      )}

      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleDto;
