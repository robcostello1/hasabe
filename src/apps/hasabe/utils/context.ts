import PouchDb from "pouchdb";
import { createContext } from "react";
import { Task } from "./types";

// https://github.com/jo/couchdb-best-practices
// _rev must match to update
// localDB.put(res);

// https://jo.github.io/couchdb-best-practices/#document-validations

const localDB = new PouchDb<Task>("hasabe");
const remoteDB = new PouchDb("http://localhost:5984/hasabe");
export const DBContextValue = { localDB, remoteDB };
// TODO oops, circular
export const DBContext = createContext(DBContextValue);

// @ts-ignore
window.localDB = localDB;
// @ts-ignore
window.remoteDB = remoteDB;

localDB
  .sync(remoteDB, {
    live: true,
    retry: true,
  })
  .on("change", (info) => {
    console.log("CHANGE", info);
  });
//   .on("paused", function (err) {
//     // replication paused (e.g. replication up to date, user went offline)
//   })
//   .on("active", function () {
//     // replicate resumed (e.g. new changes replicating, user went back online)
//   })
//   .on("denied", function (err) {
//     // a document failed to replicate (e.g. due to permissions)
//   })
//   .on("complete", function (info) {
//     // handle complete
//   })
//   .on("error", function (err) {
//     // handle error
//   });
