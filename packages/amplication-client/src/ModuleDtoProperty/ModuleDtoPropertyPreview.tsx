import {
  Button,
  EnumButtonStyle,
  EnumGapSize,
  FlexItem,
} from "@amplication/ui/design-system";
import * as models from "../models";
import "./ModuleDtoPropertyPreview.scss";
import useModuleDto from "../ModuleDto/hooks/useModuleDto";

type Props = {
  onEdit: (values: models.ModuleDtoProperty) => void;
  dtoProperty?: models.ModuleDtoProperty;
};

const CLASS_NAME = "module-dto-property-preview";
const UNAVAILABLE_DTO = "(Unavailable DTO)";

const ModuleDtoPropertyPreview = ({ onEdit, dtoProperty }: Props) => {
  const isUnion = dtoProperty?.propertyTypes.length > 1;

  const { availableDtosDictionary } = useModuleDto();

  return (
    <FlexItem
      className={CLASS_NAME}
      gap={EnumGapSize.Small}
      end={
        <Button
          buttonStyle={EnumButtonStyle.Text}
          onClick={() => onEdit(dtoProperty)}
          icon="edit"
        />
      }
    >
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
