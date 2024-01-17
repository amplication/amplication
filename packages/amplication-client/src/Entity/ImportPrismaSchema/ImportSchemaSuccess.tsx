import { Button } from "@amplication/ui/design-system";
import { UploadSchemaStateProps } from "./uploadSchemaState";

export const ImportSchemaSuccess = ({ className }: UploadSchemaStateProps) => (
  <div className={`${className}__header`}>
    <h2>Schema import completed successfully!</h2>
    <div className={`${className}__message`}>
      Ready to take the next step? Choose your action.
    </div>
    <div>
      <Button>sadd</Button>
      <Button>dsds</Button>
    </div>
  </div>
);
