import { addRxPlugin, createRxDatabase } from "rxdb";
import { SupabaseReplication } from "rxdb-supabase";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

import { createClient } from "@supabase/supabase-js";

import { tags } from "./tags";
import { tasks } from "./tasks";

addRxPlugin(RxDBMigrationPlugin);
if (process.env.NODE_ENV === "development") {
  addRxPlugin(RxDBDevModePlugin);
}

export const supabaseClient = createClient(
  process.env.REACT_APP_SUPABASE_URL!,
  process.env.REACT_APP_SUPABASE_KEY!
);

export type DbTables = "tasks" | "tags";

const setupDB = async () => {
  // Create your database
  const db = await createRxDatabase({
    ignoreDuplicate: true,
    name: "hasabe",
    storage: getRxStorageDexie(), // Uses IndexedDB
  });

  const collections = db.addCollections({
    tags,
    tasks,
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
    replicationIdentifier: "tasks" + process.env.REACT_APP_SUPABASE_URL, // TODO: Add Supabase user ID?
    pull: {
      realtimePostgresChanges: false,
    }, // If absent, no data is pulled from Supabase
    push: {}, // If absent, no changes are pushed to Supabase
  });

  new SupabaseReplication({
    supabaseClient,
    collection: (await collections).tags,
    replicationIdentifier: "tags" + process.env.REACT_APP_SUPABASE_URL, // TODO: Add Supabase user ID?
    pull: {
      realtimePostgresChanges: false,
    },
    push: {},
  });

  return collections;
};

export default setupDB();
