import {
  CircleBadge,
  EnumTextColor,
  EnumTextStyle,
  EnumTextWeight,
  Text,
  ToggleField,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import "./ImageLabelToggle.scss";
import classNames from "classnames";

const className = "image-label-toggle";

export type Props = {
  name: string;
  image: string;
  label: string;
  value: boolean;
  onChange: (name: string, value: boolean) => void;
  disabled?: boolean;
};

export const ImageLabelToggle: React.FC<Props> = ({
  name,
  image,
  label,
  value,
  onChange,
  disabled,
}) => {
  const handleClick = useCallback(() => {
    !disabled && onChange(name, !value);
  }, [disabled, onChange, name, value]);

  return (
    <div
      tabIndex={0}
      className={classNames(className, { [`${className}--selected`]: value })}
      onClick={handleClick}
    >
      <CircleBadge
        color="#22273C"
        border="1px solid var(--border-color)"
        size="medium"
      >
        <img src={image} alt="" />
      </CircleBadge>
      <Text
        textStyle={EnumTextStyle.Normal}
        textWeight={EnumTextWeight.Bold}
        textColor={disabled ? EnumTextColor.Black20 : EnumTextColor.White}
      >
        {label}
      </Text>

      <ToggleField name={name} label="" disabled={disabled} />
    </div>
  );
};
