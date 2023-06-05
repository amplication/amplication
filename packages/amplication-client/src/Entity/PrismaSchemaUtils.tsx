import React, { useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import { Entity } from "../models";
import { Button, EnumButtonStyle, Icon } from "@amplication/ui/design-system";
import "./PrismaSchemaUpload.scss";

type Props = {
  resourceId: string;
};

const CLASS_NAME = "prisma-schema-upload";

const PrismaSchemaUtils = ({ resourceId }: Props) => {
  const [createEntitiesFormSchema] = useMutation<Entity[]>(
    CREATE_ENTITIES_FORM_SCHEMA
  );
  const onFileChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      createEntitiesFormSchema({
        variables: {
          data: {
            resourceId,
          },
          file,
        },
        context: {
          hasUpload: true, // This line
        },
      });
    },
    [createEntitiesFormSchema, resourceId]
  );

  return (
    <Button type="button" buttonStyle={EnumButtonStyle.Outline}>
      <label htmlFor="fileInput" className={`${CLASS_NAME}__label`}>
        Upload Prisma Schema
        <Icon icon="upload1" size="small" className={`${CLASS_NAME}__icon`} />
      </label>
      <input
        id="fileInput"
        type="file"
        accept=".prisma"
        onChange={onFileChange}
        className={`${CLASS_NAME}__input`}
      />
    </Button>
  );
};

export default PrismaSchemaUtils;

const CREATE_ENTITIES_FORM_SCHEMA = gql`
  mutation createEntitiesFromSchema(
    $data: CreateEntitiesFromPrismaSchemaInput!
    $file: Upload!
  ) {
    createEntitiesFromSchema(data: $data, file: $file) {
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
