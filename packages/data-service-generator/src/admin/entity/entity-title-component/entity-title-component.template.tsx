declare const RESOURCE: string;
declare interface ENTITY {
  [key: string]: any;
}
declare const ENTITY_TITLE_FIELD_NAME = "title";

export const ENTITY_TITLE_FIELD_NAME_ID = ENTITY_TITLE_FIELD_NAME;

export const ENTITY_TITLE = (record: ENTITY): string => {
  return typeof record[ENTITY_TITLE_FIELD_NAME] === "string"
    ? record[ENTITY_TITLE_FIELD_NAME]
    : record[ENTITY_TITLE_FIELD_NAME].toString();
};
