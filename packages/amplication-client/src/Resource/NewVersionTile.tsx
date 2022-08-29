import {
  EnumPanelStyle,
  Panel,
  Icon,
  CircularProgress,
} from "@amplication/design-system";
import { useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useCallback, useContext, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { EnumImages, SvgThemeImage } from "../Components/SvgThemeImage";
import { AppContext } from "../context/appContext";
import { GET_LOOKUP_FIELDS } from "../Entity/RelatedFieldsMigrationFix";
import * as models from "../models";
import { Event as TrackEvent, useTracking } from "../util/analytics";
import "./NewVersionTile.scss";

type TData = {
  resource: models.Resource;
};

type Props = {
  resourceId: string;
};

const CLASS_NAME = "new-version-tile";

const EVENT_DATA: TrackEvent = {
  eventName: "newVersionTileClick-fixEntities",
};

function NewVersionTile({ resourceId }: Props) {
  const history = useHistory();
  const { currentWorkspace, currentProject } = useContext(AppContext);

  const { data, loading } = useQuery<TData>(GET_LOOKUP_FIELDS, {
    variables: {
      resourceId: resourceId,
    },
  });
  const { trackEvent } = useTracking();

  const handleClick = useCallback(
    (event) => {
      trackEvent(EVENT_DATA);
      history.push(`/${currentWorkspace?.id}/${currentProject?.id}${resourceId}/fix-related-entities`);
    },
    [history, trackEvent, resourceId,currentWorkspace,currentProject]
  );

  const requiredFixesCount = useMemo(() => {
    if (!data) return 0;

    return data.resource.entities.reduce((accumulator, entity) => {
      const sum =
        entity.fields?.filter((field) =>
          isEmpty(field.properties.relatedFieldId)
        ).length || 0;
      return accumulator + sum;
    }, 0);
  }, [data]);

  if (requiredFixesCount === 0) return null;

  return (
    <>
      <div className={`${CLASS_NAME}__gap`} />
      <div className={`${CLASS_NAME}__wrapper`}>
        <div className={`${CLASS_NAME}__new-release`}>New Release!</div>
        <Panel
          className={`${CLASS_NAME}`}
          clickable
          onClick={handleClick}
          panelStyle={EnumPanelStyle.Bordered}
        >
          <div className={`${CLASS_NAME}__content`}>
            <div className={`${CLASS_NAME}__content__details`}>
              <h2>Improved Relation Fields</h2>
              Version 0.3.2 includes big improvements in how we manage related
              entities. The changes require your attention.
              {loading ? (
                <CircularProgress />
              ) : (
                <span className={`${CLASS_NAME}__content__details__summary`}>
                  <Icon icon="info_circle" size="medium" />
                  {requiredFixesCount}
                  {requiredFixesCount > 1
                    ? " relation needs "
                    : " relations need "}
                  your attention
                </span>
              )}
            </div>
            <SvgThemeImage image={EnumImages.Relations} />
          </div>
        </Panel>
      </div>
    </>
  );
}

export default NewVersionTile;
