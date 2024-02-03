import {
  Button,
  EnumButtonStyle,
  Tooltip,
} from "@amplication/ui/design-system";
import classNames from "classnames";

const CLASS_NAME = "model-organizer-control";

type Props = {
  tooltip: string;
  icon: string;
  onClick: () => void;
};

export default function ModelOrganizerControl({
  tooltip,
  icon,
  onClick,
}: Props) {
  return (
    <div className={classNames(`${CLASS_NAME}`)}>
      <Tooltip aria-label={tooltip} direction="e" noDelay>
        <Button
          icon={icon}
          iconSize="small"
          buttonStyle={EnumButtonStyle.Text}
          onClick={onClick}
        ></Button>
      </Tooltip>
    </div>
  );
}
