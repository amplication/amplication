import React from "react";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";
import { EntityFieldDataType, EntityField } from "./types";

type Props = {
  submitButtonTitle: string;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  actions?: React.ReactNode;
  defaultValues?: Partial<EntityField>;
};

const DATA_TYPE_OPTIONS = [
  { value: EntityFieldDataType.singleLineText, label: "Single Line Text" },
  { value: EntityFieldDataType.multiLineText, label: "Multi Line Text" },
  { value: EntityFieldDataType.email, label: "Email" },
  { value: EntityFieldDataType.numbers, label: "Numbers" },
  { value: EntityFieldDataType.autoNumber, label: "Auto Number" },
];

const EntityFieldForm = ({
  submitButtonTitle,
  onSubmit,
  onCancel,
  actions = null,
  defaultValues = {},
}: Props) => {
  return (
    <form onSubmit={onSubmit}>
      <p>
        <TextField
          label="Name"
          name="name"
          minLength={1}
          defaultValue={defaultValues.name}
        />
      </p>
      <p>
        <TextField
          label="Display Name"
          name="displayName"
          minLength={1}
          defaultValue={defaultValues.displayName}
        />
      </p>
      <p>
        <Select
          options={DATA_TYPE_OPTIONS}
          defaultValue={defaultValues.dataType || DATA_TYPE_OPTIONS[0].value}
          name="dataType"
        />
      </p>
      <p>
        Required{" "}
        <Switch name="required" checked={defaultValues.required || false} />
      </p>
      <p>
        Searchable{" "}
        <Switch name="searchable" checked={defaultValues.searchable || false} />
      </p>
      <TextField
        textarea
        outlined
        fullwidth
        label="Description"
        rows={3}
        name="description"
        defaultValue={defaultValues.description}
      />
      <Button raised type="submit">
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
