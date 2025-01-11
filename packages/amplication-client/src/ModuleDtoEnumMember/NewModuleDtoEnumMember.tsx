import { Snackbar, TextField } from "@amplication/ui/design-system";
import { camelCase } from "camel-case";
import classNames from "classnames";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { Button, EnumButtonStyle } from "../Components/Button";
import * as models from "../models";
import { formatError } from "../util/error";
import "./NewModuleDtoEnumMember.scss";
import useModuleDtoEnumMember from "./hooks/useModuleDtoEnumMember";

type Props = {
  moduleDto: models.ModuleDto;
  onEnumMemberAdd?: (member: models.ModuleDto) => void;
};

const INITIAL_VALUES: Partial<models.ModuleDtoEnumMember> = {
  name: "",
  value: "",
};

const CLASS_NAME = "new-dto-enum-member";

const NewModuleDtoEnumMember = ({ moduleDto, onEnumMemberAdd }: Props) => {
  const {
    createModuleDtoEnumMember,
    createModuleDtoEnumMemberError: error,
    createModuleDtoEnumMemberLoading: loading,
  } = useModuleDtoEnumMember();

  const [autoFocus, setAutoFocus] = useState<boolean>(false);

  const handleSubmit = useCallback(
    (data, actions) => {
      setAutoFocus(false);
      const name = camelCase(data.name.trim());

      createModuleDtoEnumMember({
        variables: {
          data: {
            name,
            moduleDto: { connect: { id: moduleDto.id } },
          },
        },
      })
        .catch(console.error)
        .then(() => {
          actions.resetForm(INITIAL_VALUES);
          setAutoFocus(true);

          if (onEnumMemberAdd) {
            onEnumMemberAdd(moduleDto);
          }
        });
    },
    [createModuleDtoEnumMember, moduleDto, onEnumMemberAdd]
  );

  const errorMessage = formatError(error);

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={INITIAL_VALUES}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form className={`${CLASS_NAME}__add-field`}>
            <TextField
              required
              name="name"
              label="New Enum Member Name"
              disabled={loading}
              placeholder="Add member"
              autoComplete="off"
              autoFocus={autoFocus}
              hideLabel
            />
            <Button
              buttonStyle={EnumButtonStyle.Text}
              icon="plus"
              className={classNames(`${CLASS_NAME}__add-field__button`, {
                [`${CLASS_NAME}__add-field__button--show`]:
                  formik.values.name.length > 0,
              })}
            />
          </Form>
        )}
      </Formik>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
};

export default NewModuleDtoEnumMember;
