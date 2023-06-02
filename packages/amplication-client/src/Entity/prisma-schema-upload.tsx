import React, { useCallback, useContext } from "react";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";
import { Entity } from "../models";

type Props = {
  resourceId: string;
};

const PrismaSchemaUpload = ({ resourceId }: Props) => {
  const [createEntitiesFormSchema, { data }] = useMutation<Entity[]>(
    CREATE_ENTITIES_FORM_SCHEMA
  );
  const onFileChange = useCallback((event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceId", resourceId);
    axios
      .post("http://localhost:3000/file/upload-schema", formData, {
        // TODO: use env variable
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

// call the create entity form schema from entity resolver
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
