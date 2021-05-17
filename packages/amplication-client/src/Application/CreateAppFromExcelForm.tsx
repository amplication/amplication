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
            <h3>{fileName}</h3>
            <div className={`${CLASS_NAME}__notice`}>
              <ul className={`${CLASS_NAME}__layout__body__side__message`}>
                <li>
                  You can change the name and the data type of your fields.
                </li>
                <li>
                  You can create additional entities and move fields between
                  entities to normalize your data model.
                </li>
                <li>
                  All relations are created as one-to-many by default. You can
                  change that later if needed.
                </li>
                <li>
                  Even after the app is created, you can always update your data
                  models.
                </li>
                <li>
                  Once your app is ready, you can simply download the generated
                  code or push it directly to a GitHub repository.
                </li>
                <li>
                  Give your app a descriptive name and click on "Create App"
                  below.
                </li>
              </ul>
            </div>

            <DisplayNameField
              name="app.name"
              label="Application Name"
              required
            />

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
