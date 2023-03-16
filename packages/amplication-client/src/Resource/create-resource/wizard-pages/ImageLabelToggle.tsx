import { CircleBadge, ToggleField } from "@amplication/design-system";
import "./ImageLabelToggle.scss";

const className = "image-label-toggle";

export type Props = {
  name: string;
  image: string;
  label: string;
};

export const ImageLabelToggle: React.FC<Props> = ({ name, image, label }) => {
  return (
    <div className={className}>
      <CircleBadge color="#22273C" border="1px solid #373D57" size="medium">
        <img src={image} alt="" />
      </CircleBadge>
      <label>{label}</label>
      <ToggleField name={name} label="" />
    </div>
  );
};
