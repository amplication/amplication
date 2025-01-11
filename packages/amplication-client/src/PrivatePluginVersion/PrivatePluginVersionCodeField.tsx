import {
  CodeEditor,
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Text,
} from "@amplication/ui/design-system";
import { JsonFormatting, isValidJSON } from "@amplication/util/json";
import { useField } from "formik";
import { useCallback } from "react";

type Props = {
  name: string;
  label: string;
  initialValue: string;
};

const CLASS_NAME = "private-plugin-version-code-field";

const PrivatePluginVersionCodeField = ({
  name,
  label,
  initialValue,
}: Props) => {
  const [field, meta, { setValue, setError }] = useField({
    name: name,
  });
  const handleChange = useCallback(
    (value: string) => {
      const validateChange = isValidJSON(value);

      if (validateChange) {
        const jsonValue = JsonFormatting(value);
        setValue(JSON.parse(jsonValue));
        setError(undefined);
      } else {
        setError("Invalid JSON");
      }
    },
    [setError, setValue]
  );

  const formattedValue = JsonFormatting(initialValue);

  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Column}
      contentAlign={EnumContentAlign.Center}
      itemsAlign={EnumItemsAlign.Stretch}
    >
      <Text textStyle={EnumTextStyle.Label}>{label}</Text>
      <CodeEditor
        height={"100px"}
        width="100%"
        defaultValue={formattedValue}
        onChange={handleChange}
        defaultLanguage={"json"}
        options={{
          selectOnLineNumbers: false,
          readOnly: false,
          renderLineHighlight: "none",
        }}
      />
    </FlexItem>
  );
};

export default PrivatePluginVersionCodeField;
