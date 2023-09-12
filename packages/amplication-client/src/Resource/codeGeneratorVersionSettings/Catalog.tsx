import { Question } from "../../Purchase/Question";

const CLASS_NAME = "catalog";

type CatalogProps = {
  name: string;
  changelog: string;
};

export const DSGCatalog: React.FC<CatalogProps> = ({ name, changelog }) => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__item`}>
        <Question question={name} answer={changelog} />
      </div>
    </div>
  );
};
