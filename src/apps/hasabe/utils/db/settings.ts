import { RxCollectionCreator, TopLevelProperty } from "rxdb/dist/types/types";

import { SettingsItem } from "../types";

const properties: Record<keyof SettingsItem, TopLevelProperty> = {
  id: {
    type: "string",
    maxLength: 36,
  },
  name: {
    type: "string",
    // TODO
    maxLength: 1024,
  },
  value: {
    type: "object",
  },
};

// Create a collection matching your Supabase table structure.
const schema = {
  title: "settings schema",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties,
  required: ["id", "name", "value"],
  indexes: ["name"],
};

export const settings: RxCollectionCreator = {
  schema,
  migrationStrategies: {},
};
