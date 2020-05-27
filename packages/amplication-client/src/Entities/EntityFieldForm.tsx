import React from "react";
import { useFormik } from "formik";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";
import * as types from "./types";

type Values = {
  name: string;
  displayName: string;
  dataType: types.EntityFieldDataType;
  required: boolean;
  searchable: boolean;
  description: string;
};

type Props = {
  submitButtonTitle: string;
  onCancel: () => void;
  onSubmit: (values: Values) => void;
  actions?: React.ReactNode;
  defaultValues?: Partial<types.EntityField>;
};

const DATA_TYPE_OPTIONS = [
  {
    value: types.EntityFieldDataType.singleLineText,
    label: "Single Line Text",
  },
  { value: types.EntityFieldDataType.multiLineText, label: "Multi Line Text" },
  { value: types.EntityFieldDataType.email, label: "Email" },
  { value: types.EntityFieldDataType.numbers, label: "Numbers" },
  { value: types.EntityFieldDataType.autoNumber, label: "Auto Number" },
];

const INITIAL_VALUES: Values = {
  name: "",
  displayName: "",
  dataType: DATA_TYPE_OPTIONS[0].value,
  required: false,
  searchable: false,
  description: "",
};

const EntityFieldForm = ({
  submitButtonTitle,
  onSubmit,
  onCancel,
  actions = null,
  defaultValues = {},
}: Props) => {
  const formik = useFormik<Values>({
    initialValues: {
      ...INITIAL_VALUES,
      ...defaultValues,
    },
    onSubmit,
  });
  return (
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
        <Select
          options={DATA_TYPE_OPTIONS}
          name="dataType"
          value={formik.values.dataType}
          onChange={formik.handleChange}
        />
      </p>
      <p>
        Required <Switch name="required" checked={formik.values.required} />
      </p>
      <p>
        Searchable{" "}
        <Switch name="searchable" checked={formik.values.searchable} />
      </p>
      <TextField
        textarea
        outlined
        fullwidth
        label="Description"
        rows={3}
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
      />
      <Button type="submit" raised>
        {submitButtonTitle}
      </Button>
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
      {actions}
    </form>
  );
};

export default EntityFieldForm;
