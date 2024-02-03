import "./ModelOrganizerConfirmation.scss";
import { CopiedEntity, ModelGroupResource } from "./types";
export const CLASS_NAME = "model-organizer-confirmation";

type Props = {
  newService: ModelGroupResource;
  movedEntities: CopiedEntity[];
};

export default function TempServiceView({ newService, movedEntities }: Props) {
  return (
    <div className={`${CLASS_NAME}__newServiceItem`}>
      <span
        style={{ color: newService.color }}
        className={`${CLASS_NAME}__serviceIcon`}
      />
      <span>{newService.name}</span>{" "}
      {movedEntities.length > 0 && (
        <span
          className={`${CLASS_NAME}__entities`}
        >{`${movedEntities.length.toString()} Entities`}</span>
      )}
    </div>
  );
}
