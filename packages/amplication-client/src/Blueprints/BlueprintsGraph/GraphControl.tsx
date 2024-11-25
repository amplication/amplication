import {
  Button,
  EnumButtonStyle,
  EnumIconPosition,
  Tooltip,
} from "@amplication/ui/design-system";
import classNames from "classnames";

const CLASS_NAME = "graph-control";

type Props = {
  tooltip: string;
  icon: string;
  onClick: () => void;
};

export default function GraphControl({ tooltip, icon, onClick }: Props) {
  return (
    <div className={classNames(`${CLASS_NAME}`)}>
      <Tooltip aria-label={tooltip} direction="e" noDelay>
        <Button
          icon={icon}
          iconSize="small"
          iconPosition={EnumIconPosition.None}
          buttonStyle={EnumButtonStyle.Text}
          onClick={onClick}
        ></Button>
      </Tooltip>
    </div>
  );
}
