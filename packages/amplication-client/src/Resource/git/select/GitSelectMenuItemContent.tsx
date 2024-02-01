const CLASS_NAME = "item-content";

type Props = {
  logo: string;
  name: string;
};

export const GitSelectMenuItemContent = ({ logo, name }: Props) => {
  return (
    <div className={CLASS_NAME}>
      {logo && <img src={logo} alt="" />}
      <div className={`${CLASS_NAME}__text`}>{name}</div>
    </div>
  );
};
