import {
  EnumFlexItemMargin,
  FlexItem,
  Snackbar,
  Text,
  TextField,
  EnumTextAlign,
  EnumFlexDirection,
} from "@amplication/ui/design-system";
import { Form, Formik } from "formik";
import { useCallback, useContext } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { Button, EnumButtonStyle } from "../../Components/Button";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import { AppContext } from "../../context/appContext";
import { formatError } from "../../util/error";
import { validate } from "../../util/formikValidateJsonSchema";
import { CROSS_OS_CTRL_ENTER } from "../../util/hotkeys";
import usePackage from "../hooks/usePackage";

type Props = {
  onSuccess: () => void;
};

type packageInputData = {
  displayName: string;
};

const INITIAL_VALUES: packageInputData = {
  displayName: "",
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

const keyMap = {
  SUBMIT: CROSS_OS_CTRL_ENTER,
};

const NewPackage = ({ onSuccess }: Props) => {
  const { currentResource } = useContext(AppContext);

  const {
    createPackage,
    createPackageError,
    createPackageLoading,
    findPackagesRefetch,
  } = usePackage();

  const handleSubmit = useCallback(
    (data: packageInputData) => {
      const displayName = data.displayName.trim();

      createPackage({
        variables: {
          data: {
            ...data,
            displayName,
            summary: "update your summary here",
            resource: { connect: { id: currentResource?.id } },
          },
        },
      })
        .then(() => {
          findPackagesRefetch();
          onSuccess();
        })
        .catch(console.error);
    },
    [createPackage, currentResource, onSuccess, findPackagesRefetch]
  );

  const errorMessage = formatError(createPackageError);

  return (
    <>
      <SvgThemeImage image={EnumImages.Entities} />
      <Text textAlign={EnumTextAlign.Center}>
        Give your new package a descriptive name. <br />
      </Text>
      <Formik
        initialValues={INITIAL_VALUES}
        validate={(values: packageInputData) => validate(values, FORM_SCHEMA)}
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
              <FlexItem
                direction={EnumFlexDirection.Column}
                margin={EnumFlexItemMargin.Top}
              >
                <TextField
                  name="displayName"
                  label="New Package Name"
                  disabled={createPackageLoading}
                  autoFocus
                  hideLabel
                  placeholder="Type New Package Name"
                  autoComplete="off"
                />

                <Button
                  type="submit"
                  buttonStyle={EnumButtonStyle.Primary}
                  disabled={!formik.isValid || createPackageLoading}
                >
                  Create Package
                </Button>
              </FlexItem>
            </Form>
          );
        }}
      </Formik>
      <Snackbar open={Boolean(createPackageError)} message={errorMessage} />
    </>
  );
};

export default NewPackage;
