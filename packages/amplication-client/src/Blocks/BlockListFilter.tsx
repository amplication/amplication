import React, { useCallback } from "react";
import * as types from "../types";
import { ChipSet } from "@rmwc/chip";
import BlockListFilterItem from "./BlockListFilterItem";

type Props = {
  blockTypes: types.EnumBlockType[];
  tags: string[];
  selectedBlockTypes: Set<types.EnumBlockType>;
  selectedTags: Set<string>;
  onBlockTypesChange: (selectedBlockTypes: Set<types.EnumBlockType>) => void;
  onTagsChange: (selectedTags: Set<string>) => void;
};

const BlockListFilter = ({
  blockTypes,
  tags,
  selectedBlockTypes,
  selectedTags,
  onBlockTypesChange,
  onTagsChange,
}: Props) => {
  const handleBlockTypeClick = useCallback(
    (blockType: types.EnumBlockType) => {
      let newSet = new Set([...selectedBlockTypes]);
      if (!newSet.delete(blockType)) {
        newSet.add(blockType);
      }
      onBlockTypesChange(newSet);
    },
    [onBlockTypesChange, selectedBlockTypes]
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      let newSet = new Set([...selectedTags]);
      if (!newSet.delete(tag)) {
        newSet.add(tag);
      }
      onTagsChange(newSet);
    },
    [onTagsChange, selectedTags]
  );

  return (
    <div className="block-list__filter">
      <div className="group">
        <h3>Types</h3>
        <ChipSet>
          {blockTypes.map((item) => (
            <BlockListFilterItem
              objectData={item}
              text={item}
              selected={selectedBlockTypes.has(item)}
              onSelectionChange={handleBlockTypeClick}
            />
          ))}
        </ChipSet>
      </div>
      <div className="group">
        <h3>Tags</h3>
        <ChipSet>
          {tags.map((item) => (
            <BlockListFilterItem
              objectData={item}
              text={item}
              selected={selectedTags.has(item)}
              onSelectionChange={handleTagClick}
            />
          ))}
        </ChipSet>
      </div>
    </div>
  );
};
export default BlockListFilter;
