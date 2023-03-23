import React, { useCallback, useContext } from "react";
import { isEmpty } from "lodash";
import * as models from "../models";
import { Panel, EnumPanelStyle, Icon } from "@amplication/ui/design-system";
import { Link, useHistory } from "react-router-dom";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "./constants";
import { DeleteEntityField } from "./DeleteEntityField";
import "./EntityFieldListItem.scss";
import { AppContext } from "../context/appContext";
import { EntityFieldProperty } from "./EntityFieldProperty";
import classNames from "classnames";

type Props = {
  resourceId: string;
  entity: models.Entity;
  entityField: models.EntityField;
  entityIdToName: Record<string, string> | null;
  onDelete?: () => void;
  onError: (error: Error) => void;
};

const CLASS_NAME = "entity-field-list-item";

export const EntityFieldListItem = ({
  entityField,
  entity,
  resourceId,
  entityIdToName,
  onDelete,
  onError,
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const handleNavigateToRelatedEntity = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      history.push(
        `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${entityField.properties.relatedEntityId}`
      );
    },
    [history, resourceId, entityField, currentWorkspace, currentProject]
  );

  const handleRowClick = useCallback(() => {
    history.push(
      `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${entity.id}/fields/${entityField.id}`
    );
  }, [
    history,
    resourceId,
    entityField,
    entity,
    currentWorkspace,
    currentProject,
  ]);

  const fieldUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${entity.id}/fields/${entityField.id}`;

  return (
    <Panel
      className={CLASS_NAME}
      clickable
      onClick={handleRowClick}
      panelStyle={EnumPanelStyle.Bordered}
    >
      <div className={`${CLASS_NAME}__row`}>
        <Link
          className={`${CLASS_NAME}__title`}
          title={entityField.displayName}
          to={fieldUrl}
        >
          {entityField.displayName}
        </Link>
        <span className={`${CLASS_NAME}__subtitle`}>{entityField.name}</span>
        <span className="spacer" />
        <DeleteEntityField
          entityId={entity.id}
          entityField={entityField}
          onDelete={onDelete}
          onError={onError}
        />
      </div>
      {!isEmpty(entityField.description) && (
        <div
          className={classNames(
            `${CLASS_NAME}__row`,
            `${CLASS_NAME}__description-row`
          )}
        >
          <span className={`${CLASS_NAME}__description`}>
            {entityField.description}
          </span>
        </div>
      )}
      <div className={`${CLASS_NAME}__row`}>
        <span className={`${CLASS_NAME}__highlight`}>
          <Icon
            className="amp-data-grid-item__icon"
            icon={DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].icon}
            size="xsmall"
          />
          {entityField.dataType === models.EnumDataType.Lookup &&
          entityIdToName ? (
            <Link
              title={DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].label}
              to={`/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}/entities/${entityField.properties.relatedEntityId}`}
              onClick={handleNavigateToRelatedEntity}
            >
              {entityIdToName[entityField.properties.relatedEntityId]}{" "}
              <Icon icon="external_link" />
            </Link>
          ) : (
            DATA_TYPE_TO_LABEL_AND_ICON[entityField.dataType].label
          )}
        </span>
        {entityField.required && (
          <EntityFieldProperty property="Required" icon="alert_triangle" />
        )}
        {entityField.unique && (
          <EntityFieldProperty property="Unique" icon="star" />
        )}
        {entityField.searchable && (
          <EntityFieldProperty property="Searchable" icon="search" />
        )}
        <span className="spacer" />
      </div>
    </Panel>
  );
};
