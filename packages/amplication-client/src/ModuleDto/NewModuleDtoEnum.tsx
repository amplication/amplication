import { pascalCase } from "pascal-case";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { EnumButtonStyle } from "../Components/Button";
import NewModuleChild from "../Modules/NewModuleChild";
import * as models from "../models";
import { formatError } from "../util/error";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";
import useModuleDto from "./hooks/useModuleDto";

type Props = {
  resourceId: string;
  moduleId: string;
  onDtoCreated?: (moduleAction: models.ModuleDto) => void;
  onDismiss?: () => void;
  buttonStyle?: EnumButtonStyle;
  navigateToDtoOnCreate?: boolean;
};

const NewModuleDtoEnum = ({
  resourceId,
  moduleId,
  onDtoCreated,
  onDismiss,
  navigateToDtoOnCreate,
}: Props) => {
  const history = useHistory();
  const { baseUrl } = useResourceBaseUrl({ overrideResourceId: resourceId });

  const {
    createModuleDtoEnum,
    createModuleDtoEnumData: data,
    createModuleDtoEnumError: error,
    createModuleDtoEnumLoading: loading,
  } = useModuleDto();

  const handleSubmit = useCallback(
    (data, moduleId: string) => {
      const displayName = data.displayName.trim();
      const name = pascalCase(displayName);

      createModuleDtoEnum({
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
              onDtoCreated(result.data.createModuleDtoEnum);
            }
            if (navigateToDtoOnCreate) {
              history.push(
                `${baseUrl}/modules/${moduleId}/dtos/${result.data.createModuleDtoEnum.id}`
              );
            }
          }
        });
    },
    [
      createModuleDtoEnum,
      resourceId,
      onDtoCreated,
      history,
      baseUrl,
      navigateToDtoOnCreate,
    ]
  );

  const errorMessage = formatError(error);

  return (
    <div>
      <NewModuleChild
        resourceId={resourceId}
        moduleId={moduleId}
        loading={loading}
        errorMessage={errorMessage}
        typeName={"Enum"}
        description={
          <>
            Give your new Enum a descriptive name. <br />
            For example: EnumCustomerLevel, EnumOrderStatus
          </>
        }
        onCreate={handleSubmit}
        onDismiss={onDismiss}
      />
    </div>
  );
};

export default NewModuleDtoEnum;
