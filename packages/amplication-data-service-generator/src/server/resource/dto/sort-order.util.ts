import { builders } from "ast-types";

export const SORT_ORDER_MODULE = "../../util/SortOrder";
export const SORT_ORDER_ID = builders.identifier("SortOrder");
export const SORT_ORDER_ASC_LITERAL = builders.literal("Asc");
export const SORT_ORDER_DESC_LITERAL = builders.literal("Desc");
