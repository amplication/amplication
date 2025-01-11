import "./GraphToolbar.scss";

export const CLASS_NAME = "graph-toolbar__item";

type Props = {
  children?: React.ReactNode;
};

export default function GraphToolbarItem({ children }: Props) {
  return (
    <>
      <div className="graph-toolbar__divider"></div>
      <div className={CLASS_NAME}>{children}</div>
    </>
  );
}
