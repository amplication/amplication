import React, { useCallback } from "react";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";
import { Entity } from "../models";
import { REACT_APP_SERVER_URL } from "../env";

type Props = {
  resourceId: string;
};

const PrismaSchemaUpload = ({ resourceId }: Props) => {
  const url = `${REACT_APP_SERVER_URL}/file/upload-schema`;
  const [createEntitiesFormSchema, { data }] = useMutation<Entity[]>(
    CREATE_ENTITIES_FORM_SCHEMA
  );
  const onFileChange = useCallback((event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceId", resourceId);
    axios
      // TODO: use env variable
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const filePath = response.data;
        createEntitiesFormSchema({
          variables: {
            data: {
              filePath,
              resourceId,
            },
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <input type="file" onChange={onFileChange} />
    </div>
  );
};

export default PrismaSchemaUpload;

const CREATE_ENTITIES_FORM_SCHEMA = gql`
  mutation createEntitiesFromSchema($data: FileUploadInput!) {
    createEntitiesFromSchema(data: $data) {
      name
      displayName
      pluralDisplayName
      description
      fields {
        name
        displayName
        dataType
      }
    }
  }
`;
