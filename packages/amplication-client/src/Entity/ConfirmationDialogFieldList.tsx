import React from "react";
import * as models from "../models";
import "./ConfirmationDialogFieldList.scss";

type Props = {
  relatedEntities: models.Entity[];
};

const CLASS_NAME = "confirmation-dialog-field-list";
export default function ConfirmationDialogFieldList({
  relatedEntities,
}: Props) {
  return (
    <>
      This will also delete the related fields:
      <br />
      {relatedEntities.map((relentedEntity) => {
        return relentedEntity.fields.map((field) => (
          <>
            <br />
            <span>
              <span className={`${CLASS_NAME}__field-name`}>
                ∙ {field.displayName}
              </span>{" "}
              ({relentedEntity.displayName} entity)
            </span>
          </>
        ));
      })}
    </>
  );
}
