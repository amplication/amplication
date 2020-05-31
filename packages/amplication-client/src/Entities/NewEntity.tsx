import React, { useCallback, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { useFormik } from "formik";
import { DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Snackbar } from "@rmwc/snackbar";
import "@rmwc/snackbar/styles";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { formatError } from "../errorUtil";

type Values = {
  name: string;
  displayName: string;
  pluralDisplayName: string;
  allowFeedback: boolean;
};

type Props = {
  application: string;
  onCreate: () => void;
};

const NewEntity = ({ application, onCreate }: Props) => {
  const [createEntity, { error, data }] = useMutation(CREATE_ENTITY);
  const history = useHistory();

  const handleSubmit = useCallback(
    (data) => {
      createEntity({
        variables: {
          data: {
            ...data,
            app: { connect: { id: application } },
          },
        },
      })
        .then(onCreate)
        .catch(console.error);
    },
    [createEntity, onCreate, application]
  );

  const formik = useFormik<Values>({
    initialValues: {
      name: "",
      displayName: "",
      pluralDisplayName: "",
      allowFeedback: false,
    },
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (data) {
      history.push(`/${application}/entities/`);
    }
  }, [history, data, application]);

  const errorMessage = formatError(error);

  return (
    <>
      <DrawerHeader>
        <DrawerTitle>New Entity</DrawerTitle>
      </DrawerHeader>

      <DrawerContent>
        <form onSubmit={formik.handleSubmit}>
          <p>
            <TextField
              label="Name"
              name="name"
              minLength={1}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </p>
          <p>
            <TextField
              label="Display Name"
              name="displayName"
              minLength={1}
              value={formik.values.displayName}
              onChange={formik.handleChange}
            />
          </p>
          <p>
            <TextField
              label="Plural Display Name"
              name="pluralDisplayName"
              minLength={1}
              value={formik.values.pluralDisplayName}
              onChange={formik.handleChange}
            />
          </p>
          <p>
            Allow Feedback{" "}
            <Switch
              name="allowFeedback"
              checked={formik.values.allowFeedback}
              onChange={formik.handleChange}
            />
          </p>
          <Button raised type="submit">
            Create
          </Button>
          <Link to={`/${application}/entities/`}>
            <Button type="button">Cancel</Button>
          </Link>
        </form>
      </DrawerContent>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default NewEntity;

const CREATE_ENTITY = gql`
  mutation createEntity($data: EntityCreateInput!) {
    createOneEntity(data: $data) {
      id
    }
  }
`;
