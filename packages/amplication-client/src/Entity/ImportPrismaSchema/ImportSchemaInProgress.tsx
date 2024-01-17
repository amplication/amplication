import { UploadSchemaStateProps } from "./uploadSchemaState";

export const ImportSchemaInProgress = ({
  className,
}: UploadSchemaStateProps) => (
  <div className={`${className}__header`}>
    <h2>Hold on!</h2>
    <div className={`${className}__message`}>
      We're adding a touch of magic to your DB schema upload...
    </div>
  </div>
);
