import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useEffect } from "react";
import { match } from "react-router-dom";
import ModuleDtoPropertyList from "../ModuleDtoProperty/ModuleDtoPropertyList";
import NewModuleDtoProperty from "../ModuleDtoProperty/NewModuleDtoProperty";
import { AppContext } from "../context/appContext";
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
            ...data,
          },
        },
      }).catch(console.error);
    },
    [updateModuleDto, moduleDtoId, addEntity]
  );

  const onPropertyListChanged = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasError = Boolean(error) || Boolean(updateModuleDtoError);

  const errorMessage = formatError(error) || formatError(updateModuleDtoError);

  const isCustomDto = true;

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.ModuleDto?.name}
          subTitle={data?.ModuleDto?.description}
        />
        <FlexItem.FlexEnd>
          {data?.ModuleDto && isCustomDto && (
            <DeleteModuleDto moduleDto={data?.ModuleDto} />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {data?.ModuleDto && !isCustomDto && (
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Description}>
            This is a default dto that was created automatically with the
            entity. It cannot be deleted, and its name cannot be changed.
          </Text>
        </FlexItem>
      )}

      {!loading && (
        <ModuleDtoForm
          isCustomDto={isCustomDto}
          onSubmit={handleSubmit}
          defaultValues={data?.ModuleDto}
        />
      )}

      <TabContentTitle title="Properties" />
      <NewModuleDtoProperty
        moduleDto={data?.ModuleDto}
        onPropertyAdd={onPropertyListChanged}
      />
      <ModuleDtoPropertyList
        moduleDtoId={moduleDtoId}
        onPropertyDelete={onPropertyListChanged}
      />

      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleDto;
