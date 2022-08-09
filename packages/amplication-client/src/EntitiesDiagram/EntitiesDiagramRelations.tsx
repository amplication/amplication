import React, { useMemo } from "react";
import Xarrow from "react-xarrows";
import * as models from "../models";

const ARROW_PROPS = {
  color: "white",
  strokeWidth: 2,
  headSize: 5,
  curveness: 0.7,
};

type EntityRelationsProps = {
  entities: models.ResourceCreateWithEntitiesEntityInput[];
};

export function EntitiesDiagramRelations({ entities }: EntityRelationsProps) {
  const relations = useMemo(() => {
    return entities.flatMap((entity, index) => {
      if (!entity.relationsToEntityIndex) return [];
      return entity.relationsToEntityIndex.map((relation) => ({
        key: `${index}_${relation}`,
        start: `entity${index}`,
        end: `entity${relation}`,
      }));
    });
  }, [entities]);

  return (
    <div>
      {relations.map((relation) => (
        <Xarrow {...relation} key={relation.key} {...ARROW_PROPS} />
      ))}
    </div>
  );
}
