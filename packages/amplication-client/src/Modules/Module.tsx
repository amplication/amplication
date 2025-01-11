import {
  EnumFlexItemMargin,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import { useCallback, useContext, useEffect } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../context/appContext";
import { formatError } from "../util/error";
import { DeleteModule } from "./DeleteModule";
import "./Module.scss";
import ModuleForm from "./ModuleForm";
import useModule from "./hooks/useModule";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

const Module = () => {
  const match = useRouteMatch<{
    resource: string;
    module: string;
  }>("/:workspace/:project/:resource/modules/:module");

  const { module: moduleId } = match?.params ?? {};
  const { resetPendingChangesIndicator, setResetPendingChangesIndicator } =
    useContext(AppContext);
  const history = useHistory();
  const { baseUrl } = useResourceBaseUrl();

  const {
    getModuleData: data,
    getModuleError: error,
    getModuleLoading: loading,
    getModuleRefetch: refetch,
    updateModule,
    updateModuleError,
  } = useModule(moduleId);

  useEffect(() => {
    if (!resetPendingChangesIndicator) return;

    setResetPendingChangesIndicator(false);
    refetch();
  }, [resetPendingChangesIndicator, setResetPendingChangesIndicator, refetch]);

  const handleSubmit = useCallback(
    (data) => {
      const { name, description } = data;
      updateModule({
        variables: {
          where: {
            id: moduleId,
          },
          data: {
            name,
            displayName: name,
            description,
          },
        },
      }).catch(console.error);
    },
    [updateModule, moduleId]
  );

  const hasError = Boolean(error) || Boolean(updateModuleError);

  const errorMessage = formatError(error) || formatError(updateModuleError);

  const handleDeleteModule = useCallback(() => {
    history.push(`${baseUrl}/modules`);
  }, [history, baseUrl]);

  const isEntityModule =
    data?.module && !isEmpty(data.module.entityId) ? true : false;

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.module?.displayName}
          subTitle={data?.module?.description}
        />
        <FlexItem.FlexEnd>
          {data?.module && !isEntityModule && (
            <DeleteModule module={data?.module} onDelete={handleDeleteModule} />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {data?.module && isEntityModule && (
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text textStyle={EnumTextStyle.Description}>
            This modules was created automatically with the{" "}
            <Link to={`${baseUrl}/entities/${data?.module.entityId}`}>
              <Text
                textStyle={EnumTextStyle.Description}
                textColor={EnumTextColor.White}
              >
                {data.module.name} entity
              </Text>
            </Link>
          </Text>
        </FlexItem>
      )}

      {!loading && (
        <ModuleForm
          disabled={isEntityModule}
          onSubmit={handleSubmit}
          defaultValues={data?.module}
        />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Module;
