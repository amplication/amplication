import React from "react";
import { TextField } from "@rmwc/textfield";
import "@rmwc/textfield/styles";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { Switch } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { Select } from "@rmwc/select";
import "@rmwc/select/styles";
import { EntityFieldDataType } from "./types";

type Props = {
  submitButtonTitle: string;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const DATA_TYPE_OPTIONS = [
  { value: EntityFieldDataType.singleLineText, label: "Single Line Text" },
  { value: EntityFieldDataType.multiLineText, label: "Multi Line Text" },
  { value: EntityFieldDataType.email, label: "Email" },
  { value: EntityFieldDataType.numbers, label: "Numbers" },
  { value: EntityFieldDataType.autoNumber, label: "Auto Number" },
];

const EntityFieldForm = ({ submitButtonTitle, onSubmit, onCancel }: Props) => {
  return (
    <form onSubmit={onSubmit}>
      <p>
        <TextField label="Name" name="name" minLength={1} />
      </p>
      <p>
        <TextField label="Display Name" name="displayName" minLength={1} />
      </p>
      <p>
        <Select
          options={DATA_TYPE_OPTIONS}
          defaultValue={DATA_TYPE_OPTIONS[0].value}
          name="dataType"
        />
      </p>
      <p>
        Required <Switch name="required" checked={false} />
      </p>
      <p>
        Searchable <Switch name="searchable" checked={false} />
      </p>
      <TextField
        textarea
        outlined
        fullwidth
        label="Description"
        rows={3}
        name="description"
      />
      <Button raised type="submit">
        {submitButtonTitle}
      </Button>
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default EntityFieldForm;
