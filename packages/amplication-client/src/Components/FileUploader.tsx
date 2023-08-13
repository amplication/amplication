import classNames from "classnames";
import { useCallback } from "react";
import { Accept as AcceptedFileTypes, useDropzone } from "react-dropzone";
import "./FileUploader.scss";

export const CLASS_NAME = "file-uploader";

type Props = {
  maxFiles?: number;
  acceptedFileTypes: AcceptedFileTypes;
  onFilesSelected: (files: File[]) => void;
};

export function FileUploader({
  maxFiles,
  acceptedFileTypes,
  onFilesSelected,
}: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedFileTypes,
    maxFiles: maxFiles,
    onDrop,
  });

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__select-file`}>
        <div
          {...getRootProps()}
          className={classNames(`${CLASS_NAME}__dropzone`, {
            [`${CLASS_NAME}__dropzone--active`]: isDragActive,
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag and drop a file here, or click to select a file</p>
          )}
        </div>
      </div>
    </div>
  );
}
