import { PanelCollapsible } from "@amplication/ui/design-system";

const CLASS_NAME = "catalog";

type CatalogProps = {
  name: string;
  changelog: string;
};

export const DSGCatalog: React.FC<CatalogProps> = ({ name, changelog }) => {
  return (
    <div className={CLASS_NAME}>
      <PanelCollapsible headerContent={name}>
        <div className={`${CLASS_NAME}__separator`}></div>
        <div className={`${CLASS_NAME}__changelog`}>{changelog}</div>
      </PanelCollapsible>
    </div>
  );
};
