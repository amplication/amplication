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
  onDismiss?: () => void;
  buttonStyle?: EnumButtonStyle;
  navigateToDtoOnCreate?: boolean;
};

const FORM_SCHEMA = {
  required: ["displayName"],
  properties: {
    displayName: {
      type: "string",
      minLength: 2,
    },
  },
};

const INITIAL_VALUES: Partial<models.ModuleDto> = {
  name: "",
  displayName: "",
  description: "",
};

const NewModuleDtoEnum = ({
  resourceId,
  moduleId,
  onDtoCreated,
  onDismiss,
  navigateToDtoOnCreate,
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

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
                `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/dtos/${result.data.createModuleDtoEnum.id}`
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
      currentWorkspace?.id,
      currentProject?.id,
    ]
  );

  const errorMessage = formatError(error);

  return (
    <div>
      <NewModuleChild<models.ModuleDto>
        resourceId={resourceId}
        moduleId={moduleId}
        validationSchema={FORM_SCHEMA}
        initialValues={INITIAL_VALUES}
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
