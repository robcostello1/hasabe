import { addRxPlugin, createRxDatabase } from "rxdb";
import { SupabaseReplication } from "rxdb-supabase";
import { TopLevelProperty } from "rxdb/dist/types/types";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

import { createClient } from "@supabase/supabase-js";

import { Task } from "./types";

addRxPlugin(RxDBMigrationPlugin);
if (process.env.NODE_ENV === "development") {
  addRxPlugin(RxDBDevModePlugin);
}

const supabaseClient = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!
);

const setupDB = async () => {
  // Create your database
  const db = await createRxDatabase({
    ignoreDuplicate: true,
    name: "hasabe",
    storage: getRxStorageDexie(), // Uses IndexedDB
  });

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
  };

  // Create a collection matching your Supabase table structure.
  const schema = {
    title: "tasks schema",
    version: 1,
    primaryKey: "id",
    type: "object",
    properties,
    required: ["id", "name", "body", "effortPoints", "worryPoints"],
    indexes: ["name"],
  };

  const collections = db.addCollections({
    tasks: {
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
      },
    },
  });

  new SupabaseReplication({
    supabaseClient,
    collection: (await collections).tasks,
    //   /**
    //    * An ID for the replication, so that RxDB is able to resume the replication
    //    * on app reload. It is recommended to add the supabase URL to make sure you're
    //    * not mixing up replications against different databases.
    //    *
    //    * If you're using row-level security, you might also want to append the user ID
    //    * in case the logged in user changes, although depending on your application you
    //    * might want to re-create the entire RxDB from scratch in that case or have one
    //    * RxDB per user ID (you could add the user ID to the RxDB name).
    //    */
    replicationIdentifier: "rc" + process.env.REACT_APP_SUPABASE_URL, // TODO: Add Supabase user ID?
    pull: {}, // If absent, no data is pulled from Supabase
    push: {}, // If absent, no changes are pushed to Supabase
  });

  return collections;
};

export default setupDB();
