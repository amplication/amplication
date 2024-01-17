import { UploadSchemaStateProps } from "./uploadSchemaState";

export const ImportSchemaFailure = ({
  className,
  message,
}: UploadSchemaStateProps) => (
  <div className={`${className}__header`}>
    <h2>Schema import failed</h2>
    <div className={`${className}__message`}>{message}</div>
  </div>
);
