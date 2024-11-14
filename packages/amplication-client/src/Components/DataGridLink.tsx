import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import "./DataGridLink.scss";

type Props = {
  to: string;
  text: string;
};

const CLASS_NAME = "data-grid-link";

function DataGridLink({ to, text }: Props) {
  return (
    <Link className={CLASS_NAME} to={to}>
      <Text textStyle={EnumTextStyle.Tag}>{text}</Text>
    </Link>
  );
}

export default DataGridLink;
