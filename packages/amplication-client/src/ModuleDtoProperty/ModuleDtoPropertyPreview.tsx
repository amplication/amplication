import { EnumGapSize, FlexItem } from "@amplication/ui/design-system";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";
import * as models from "../models";
import "./ModuleDtoPropertyPreview.scss";

type Props = {
  dtoProperty?: models.ModuleDtoProperty;
};

const CLASS_NAME = "module-dto-property-preview";
const UNAVAILABLE_DTO = "(Unavailable DTO)";

const ModuleDtoPropertyPreview = ({ dtoProperty }: Props) => {
  const isUnion = dtoProperty?.propertyTypes.length > 1;

  const { availableDtosDictionary } = useModuleDto();

  return (
    <FlexItem className={CLASS_NAME} gap={EnumGapSize.Small}>
      {dtoProperty.name}
      {dtoProperty.isOptional ? "?" : ""}:{" "}
      {isUnion && dtoProperty.isArray ? "(" : ""}
      {dtoProperty.propertyTypes.map((type, index) => (
        <div key={index}>
          {type.type === models.EnumModuleDtoPropertyType.Dto
            ? availableDtosDictionary[type.dtoId]?.name || UNAVAILABLE_DTO
            : type.type}
          {type.isArray ? "[]" : ""}
          {isUnion && index < dtoProperty.propertyTypes.length - 1 ? " | " : ""}
        </div>
      ))}
      {isUnion && dtoProperty.isArray ? ")" : ""}
      {dtoProperty.isArray ? "[]" : ""}
    </FlexItem>
  );
};

export default ModuleDtoPropertyPreview;
