import { pascalCase } from "pascal-case";
import { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { EnumButtonStyle } from "../Components/Button";
import NewModuleChild from "../Modules/NewModuleChild";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import useModuleDto from "./hooks/useModuleDto";

type Props = {
  resourceId: string;
  moduleId: string;
  onDtoCreated?: (moduleAction: models.ModuleDto) => void;
  buttonStyle?: EnumButtonStyle;
  onDismiss?: () => void;
  navigateToDtoOnCreate?: boolean;
};

const NewModuleDto = ({
  resourceId,
  moduleId,
  onDtoCreated,
  buttonStyle = EnumButtonStyle.Primary,
  onDismiss,
  navigateToDtoOnCreate = true,
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const {
    createModuleDto,
    createModuleDtoData: data,
    createModuleDtoError: error,
    createModuleDtoLoading: loading,
  } = useModuleDto();

  const handleSubmit = useCallback(
    (data, moduleId: string) => {
      const displayName = data.displayName.trim();
      const name = pascalCase(displayName);

      createModuleDto({
        variables: {
          data: {
            ...data,
            displayName,
            name,
            resource: { connect: { id: resourceId } },
            parentBlock: { connect: { id: moduleId } },
          },
        },
      })
        .catch(console.error)
        .then((result) => {
          if (result && result.data) {
            if (onDtoCreated && result && result.data) {
              onDtoCreated(result.data.createModuleDto);
            }
            if (navigateToDtoOnCreate) {
              history.push(
                `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/dtos/${result.data.createModuleDto.id}`
              );
            }
          }
        });
    },
    [
      createModuleDto,
      resourceId,
      onDtoCreated,
      history,
      currentWorkspace?.id,
      currentProject?.id,
      navigateToDtoOnCreate,
    ]
  );

  const errorMessage = formatError(error);

  return (
    <NewModuleChild
      resourceId={resourceId}
      moduleId={moduleId}
      loading={loading}
      errorMessage={errorMessage}
      typeName={"DTO"}
      description={
        <>
          Give your new DTO a descriptive name. <br />
          For example: CustomerCreateInput, OrderFindArgs
        </>
      }
      onCreate={handleSubmit}
      onDismiss={onDismiss}
    />
  );
};

export default NewModuleDto;
