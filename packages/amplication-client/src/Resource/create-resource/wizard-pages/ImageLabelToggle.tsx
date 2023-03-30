import { CircleBadge, ToggleField } from "@amplication/ui/design-system";
import { useCallback, useRef } from "react";
import "./ImageLabelToggle.scss";

const className = "image-label-toggle";

export type Props = {
  name: string;
  image: string;
  label: string;
  disabled?: boolean;
};

export const ImageLabelToggle: React.FC<Props> = ({
  name,
  image,
  label,
  disabled,
}) => {
  const toggleRef = useRef<HTMLInputElement>(null);
  const handleContainerClick = useCallback(() => {
    toggleRef.current.click();
  }, [toggleRef]);

  return (
    <div className={className} onClick={handleContainerClick}>
      <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
        <img src={image} alt="" />
      </CircleBadge>
      <label>{label}</label>
      <ToggleField
        name={name}
        label=""
        disabled={disabled}
        forwardRef={toggleRef}
      />
    </div>
  );
};
