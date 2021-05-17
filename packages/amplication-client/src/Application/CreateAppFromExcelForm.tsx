import { Panel } from "@amplication/design-system";
import { Icon } from "@rmwc/icon";
import { Formik } from "formik";
import React from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import { DisplayNameField } from "../Components/DisplayNameField";
import { Form } from "../Components/Form";
import EntitiesDiagram, {
  EntitiesDiagramFormData,
} from "../EntitiesDiagram/EntitiesDiagram";
import { CLASS_NAME } from "./CreateAppFromExcel";

type Props = {
  initialValues: EntitiesDiagramFormData;
  fileName: string | null;
  loading: boolean;
  onSubmit: (data: EntitiesDiagramFormData) => void;
  onClearForm: () => void;
};
export const CreateAppFromExcelForm = ({
  initialValues,
  fileName,
  loading,
  onSubmit,
  onClearForm,
}: Props) => {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={onSubmit}
      render={({ values, handleSubmit }) => (
        <Form className={`${CLASS_NAME}__layout__body`}>
          <div className={`${CLASS_NAME}__layout__body__side`}>
            <h2>App Details</h2>
            <h3>{fileName}</h3>
            <DisplayNameField
              name="app.name"
              label="Give your app a descriptive name"
              required
            />
            <Panel className={`${CLASS_NAME}__notice`}>
              <div className={`${CLASS_NAME}__notice__title`}>
                <Icon icon={{ size: "xsmall", icon: "info_circle" }} />
                <span>Good to know</span>
              </div>
              <ul className={`${CLASS_NAME}__layout__body__side__message`}>
                <li>
                  All relations are created as one-to-many by default. You can
                  change that later if needed.
                </li>

                <li>
                  Once your app is ready, you can simply download the generated
                  code or push it directly to a GitHub repository.
                </li>
              </ul>
            </Panel>
            <Button
              buttonStyle={EnumButtonStyle.Primary}
              disabled={loading}
              onClick={handleSubmit}
              type="button"
            >
              Create App
            </Button>
          </div>

          <div className={`${CLASS_NAME}__layout__body__content`}>
            <div className={`${CLASS_NAME}__layout__body__content__toolbar`}>
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                disabled={loading}
                type="button"
                onClick={onClearForm}
                icon="arrow_left"
              >
                Back
              </Button>
            </div>
            <div className={`${CLASS_NAME}__entities`}>
              <EntitiesDiagram />
            </div>
          </div>
        </Form>
      )}
    />
  );
};
