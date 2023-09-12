declare const RESOURCE: string;
declare interface ENTITY {
  [key: string]: any;
}
declare const ENTITY_TITLE_FIELD_NAME = "title";

export const ENTITY_TITLE_FIELD_NAME_ID = ENTITY_TITLE_FIELD_NAME;

export const ENTITY_TITLE = (record: ENTITY): string => {
  return Object.prototype.toString.call(record.ENTITY_TITLE_FIELD_NAME) ===
    "[object String]"
    ? record.ENTITY_TITLE_FIELD_NAME
    : record.ENTITY_TITLE_FIELD_NAME.toString();
};
