import { TextField, useTagColorStyle } from "@amplication/ui/design-system";
import { useFormikContext } from "formik";
import "./CustomPropertyOptionForm.scss";

type Props = {
  disabled?: boolean;
};

const CLASS_NAME = "custom-property-option-value-field";
const FIELD_NAME = "value";

const CustomPropertyOptionValueField = ({ disabled }: Props) => {
  const formik = useFormikContext<{ color: string }>();
  const color = formik.values.color;

  const { style } = useTagColorStyle(color);

  return (
    <>
      <TextField
        style={style}
        className={CLASS_NAME}
        name={FIELD_NAME}
        disabled={disabled}
      />
    </>
  );
};

export default CustomPropertyOptionValueField;
