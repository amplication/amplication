import { CircleBadge, ToggleField } from "@amplication/ui/design-system";
import { useCallback } from "react";
import "./ImageLabelToggle.scss";

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
    onChange(name, !value);
  }, [value, onChange]);

  return (
    <div tabIndex={0} className={className} onClick={handleClick}>
      <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
        <img src={image} alt="" />
      </CircleBadge>
      <label>{label}</label>
      <ToggleField name={name} label="" disabled={disabled} />
    </div>
  );
};
