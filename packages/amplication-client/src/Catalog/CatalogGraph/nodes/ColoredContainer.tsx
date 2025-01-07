import { useTagColorStyle } from "@amplication/ui/design-system";
import { type FC } from "react";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  color: string;
};

const ColoredContainer: FC<Props> = ({
  className,
  style = {},
  children,
  color,
}) => {
  const { borderColor } = useTagColorStyle(color);

  style = {
    ...style,
    borderTopColor: borderColor,
  };

  return (
    <div className={className} tabIndex={0} style={style}>
      {children}
    </div>
  );
};

export default ColoredContainer;
