import {
  Dialog,
  EnumTextAlign,
  Snackbar,
  Text,
  TextField,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { pascalCase } from "pascal-case";
import { useCallback, useContext, useState } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { useHistory } from "react-router-dom";
import { Button, EnumButtonStyle } from "../Components/Button";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { validate } from "../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../util/hotkeys";
import useModuleDto from "./hooks/useModuleDto";
import { useModulesContext } from "../Modules/modulesContext";

type Props = {
  resourceId: string;
  moduleId: string;
  onDtoCreated?: (moduleAction: models.ModuleDto) => void;
  buttonStyle?: EnumButtonStyle;
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

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewModuleDto = ({
  resourceId,
  moduleId,
  onDtoCreated,
  buttonStyle = EnumButtonStyle.Primary,
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { customActionsLicenseEnabled } = useModulesContext();

  const {
    createModuleDto,
    createModuleDtoData: data,
    createModuleDtoError: error,
    createModuleDtoLoading: loading,
  } = useModuleDto();

  const handleDialogStateChange = useCallback(() => {
    setDialogOpen(!dialogOpen);
  }, [dialogOpen, setDialogOpen]);

  const handleSubmit = useCallback(
    (data) => {
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
            history.push(
              `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/modules/${moduleId}/dtos/${result.data.createModuleDto.id}`
            );
          }
        });
      setDialogOpen(false);
    },
    [createModuleDto, resourceId, moduleId]
  );

  const errorMessage = formatError(error);

  return (
    <div>
      <Dialog
        isOpen={dialogOpen}
        onDismiss={handleDialogStateChange}
        title="New Dto"
      >
        <SvgThemeImage image={EnumImages.Entities} />
        <Text textAlign={EnumTextAlign.Center}>
          Give your new Dto a descriptive name. <br />
          For example: Get Customer, Find Orders, Create Ticket...
        </Text>

        <Formik
          initialValues={INITIAL_VALUES}
          validate={(values) => validate(values, FORM_SCHEMA)}
          onSubmit={handleSubmit}
          validateOnMount
        >
          {(formik) => {
            const handlers = {
              SUBMIT: formik.submitForm,
            };
            return (
              <Form>
                <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
                <TextField
                  name="displayName"
                  label="New Dto Name"
                  disabled={loading}
                  autoFocus
                  hideLabel
                  placeholder="Type New Dto Name"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  buttonStyle={EnumButtonStyle.Primary}
                  disabled={!formik.isValid || loading}
                >
                  Create Dto
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Dialog>
      <Button
        buttonStyle={buttonStyle}
        onClick={handleDialogStateChange}
        disabled={!customActionsLicenseEnabled}
        icon="zap"
      >
        Add Dto
      </Button>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewModuleDto;
