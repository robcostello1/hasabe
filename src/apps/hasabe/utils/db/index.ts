import { addRxPlugin, createRxDatabase } from "rxdb";
import {
  SupabaseReplication,
  SupabaseReplicationCheckpoint,
  SupabaseReplicationOptions,
} from "rxdb-supabase";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

import { createClient } from "@supabase/supabase-js";

import { tags } from "./tags";
import { tasks } from "./tasks";

addRxPlugin(RxDBMigrationPlugin);
if (import.meta.env.MODE === "development") {
  addRxPlugin(RxDBDevModePlugin);
}

export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_KEY!
);

export type DbTables = "tasks" | "tags";

const setupDB = async () => {
  // Create your database
  const db = await createRxDatabase({
    ignoreDuplicate: true,
    name: "hasabe",
    storage: getRxStorageDexie(), // Uses IndexedDB
  });

  const collections = await db.addCollections({
    tags,
    tasks,
  });

  const initialCheckpoint: SupabaseReplicationCheckpoint = {
    modified: new Date(0).toISOString(),
    primaryKeyValue: "id",
  };

  const defaultReplicationOptions: Omit<
    SupabaseReplicationOptions<{}>,
    "collection" | "replicationIdentifier"
  > = {
    supabaseClient,
    pull: {
      realtimePostgresChanges: true,
      initialCheckpoint,
    }, // If absent, no data is pulled from Supabase
    push: {
      // updateHandler: async (row) => {
      //   console.log("updateHandler", row);
      //   // TODO handle failed updates such as schema mismatch
      //   return true;
      // },
    }, // If absent, no changes are pushed to Supabase
  };

  new SupabaseReplication({
    collection: collections.tasks,
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
    replicationIdentifier: "tasks" + import.meta.env.REACT_APP_SUPABASE_URL, // TODO: Add Supabase user ID?
    ...defaultReplicationOptions,
  });

  new SupabaseReplication({
    collection: collections.tags,
    replicationIdentifier: "tags" + import.meta.env.REACT_APP_SUPABASE_URL, // TODO: Add Supabase user ID?
    ...defaultReplicationOptions,
  });

  return collections;
};

export default setupDB();
