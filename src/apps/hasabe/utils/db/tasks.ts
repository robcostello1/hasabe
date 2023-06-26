import { RxCollectionCreator, TopLevelProperty } from "rxdb/dist/types/types";

import { Task } from "../types";

const properties: Record<keyof Task, TopLevelProperty> = {
  id: {
    type: "string",
    maxLength: 36,
  },
  name: {
    type: "string",
    // TODO
    maxLength: 1024,
  },
  body: {
    type: "string",
  },
  effortPoints: {
    type: "number",
  },
  worryPoints: {
    type: "number",
  },
  orderIndex: {
    type: "string",
  },
  tags: {
    type: "string",
    maxLength: 32,
  },
};

// Create a collection matching your Supabase table structure.
const schema = {
  title: "tasks schema",
  version: 5,
  primaryKey: "id",
  type: "object",
  properties,
  required: ["id", "name", "body", "effortPoints", "worryPoints"],
  indexes: ["name"],
};

export const tasks: RxCollectionCreator = {
  schema,
  /**
   * Whenever we attempt to replicate a local write to a row that was changed in
   * Supabase in the meantime (e.g. by another client), the conflict handler is
   * invoked. By default, RxDB will dismiss the local write and update the local
   * state to match the state in Supabase. With a custom conflict handler you can
   * implement other strategies, e.g. you might want to still perform an update
   * on a per-field basis as long as that field didn't change.
   */
  // conflictHandler: ...
  migrationStrategies: {
    // 1 means, this transforms data from version 0 to version 1
    1: function (oldDoc) {
      return oldDoc;
    },
    2: function (oldDoc) {
      return oldDoc;
    },
    3: function (oldDoc) {
      return oldDoc;
    },
    4: function ({ order, ...oldDoc }) {
      return { ...oldDoc, orderIndex: order };
    },
    5: function (oldDoc) {
      return oldDoc;
    },
  },
};
