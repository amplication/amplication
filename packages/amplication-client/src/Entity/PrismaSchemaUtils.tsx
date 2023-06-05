import React, { useCallback } from "react";
import axios from "axios";
import { gql, useMutation } from "@apollo/client";
import { Entity } from "../models";
import { REACT_APP_SERVER_URL } from "../env";
import { Button, EnumButtonStyle, Icon } from "@amplication/ui/design-system";
import "./PrismaSchemaUpload.scss";

type Props = {
  resourceId: string;
};

const CLASS_NAME = "prisma-schema-upload";

const PrismaSchemaUtils = ({ resourceId }: Props) => {
  const url = `${REACT_APP_SERVER_URL}/file/upload-prisma-schema`;
  const [createEntitiesFormSchema, { data }] = useMutation<Entity[]>(
    CREATE_ENTITIES_FORM_SCHEMA
  );
  const onFileChange = useCallback((event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("resourceId", resourceId);
    axios
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
    <Button type="button" buttonStyle={EnumButtonStyle.Outline}>
      <label htmlFor="fileInput" className={`${CLASS_NAME}__label`}>
        Upload Prisma Schema
        <Icon icon="upload1" size="small" className={`${CLASS_NAME}__icon`} />
      </label>
      <input
        id="fileInput"
        type="file"
        onChange={onFileChange}
        className={`${CLASS_NAME}__input`}
      />
    </Button>
  );
};

export default PrismaSchemaUtils;

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
