import { RxCollectionCreator, TopLevelProperty } from "rxdb/dist/types/types";

import { Tag } from "../types";

const properties: Record<keyof Tag, TopLevelProperty> = {
  id: {
    type: "string",
    maxLength: 36,
  },
  name: {
    type: "string",
    // TODO
    maxLength: 1024,
  },
};

// Create a collection matching your Supabase table structure.
const schema = {
  title: "tasks schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties,
  required: ["id", "name"],
  indexes: ["name"],
};

export const tags: RxCollectionCreator = {
  schema,
  migrationStrategies: {},
};
