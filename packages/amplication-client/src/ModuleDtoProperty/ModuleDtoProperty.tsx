import {
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useContext, useEffect } from "react";
import { match, useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import { formatError } from "../util/error";
import { DeleteModuleDtoProperty } from "./DeleteModuleDtoProperty";
import ModuleDtoPropertyForm from "./ModuleDtoPropertyForm";
import useModuleDtoProperty from "./hooks/useModuleDtoProperty";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
    resource: string;
    module: string;
    moduleDtoProperty: string;
  }>;
};

const ModuleDtoProperty = ({ match }: Props) => {
  const { moduleDtoProperty: moduleDtoPropertyId } = match?.params ?? {};

  const {
    addEntity,
    resetPendingChangesIndicator,
    setResetPendingChangesIndicator,
  } = useContext(AppContext);
  const history = useHistory();

  const {
    getModuleDtoProperty,
    getModuleDtoPropertyData: data,
    getModuleDtoPropertyError: error,
    getModuleDtoPropertyLoading: loading,
    getModuleDtoPropertyRefetch: refetch,
    updateModuleDtoProperty,
    updateModuleDtoPropertyError,
  } = useModuleDtoProperty();

  useEffect(() => {
    if (!moduleDtoPropertyId) return;
    getModuleDtoProperty({
      variables: {
        moduleDtoPropertyId,
      },
    }).catch(console.error);
  }, [moduleDtoPropertyId, getModuleDtoProperty]);

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;

    setResetPendingChangesIndicator(false);
    refetch();
  }, [resetPendingChangesIndicator, setResetPendingChangesIndicator]);

  const handleSubmit = useCallback(
    (data) => {
      updateModuleDtoProperty({
        onCompleted: () => {
          addEntity(moduleDtoPropertyId);
        },
        variables: {
          where: {
            id: moduleDtoPropertyId,
          },
          data: {
            ...data,
          },
        },
      }).catch(console.error);
    },
    [updateModuleDtoProperty, moduleDtoPropertyId]
  );

  const hasError = Boolean(error) || Boolean(updateModuleDtoPropertyError);

  const errorMessage =
    formatError(error) || formatError(updateModuleDtoPropertyError);

  const isCustomDto = false;

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.ModuleDtoProperty?.name}
          subTitle={data?.ModuleDtoProperty?.description}
        />
        <FlexItem.FlexEnd>
          {data?.ModuleDtoProperty && isCustomDto && (
            <DeleteModuleDtoProperty
              moduleDtoProperty={data?.ModuleDtoProperty}
            />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {data?.ModuleDtoProperty && !isCustomDto && (
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Description}>
            This is a default dto that was created automatically with the
            entity. It cannot be deleted, and its name cannot be changed.
          </Text>
        </FlexItem>
      )}

      {!loading && (
        <ModuleDtoPropertyForm
          isCustomDto={isCustomDto}
          onSubmit={handleSubmit}
          defaultValues={data?.ModuleDtoProperty}
        />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ModuleDtoProperty;
