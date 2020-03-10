import * as fireorm from "fireorm";
import FirebaseInit from "./firebase/firebase_init";
import check_testing from "./utils/check_testing";

export let firebase_initializer: FirebaseInit;
export default function init_app(auth_fn?: Function): Promise<null> {
  //frontend use

  Error.stackTraceLimit = Infinity;
  if (!firebase_initializer) {
    firebase_initializer = init_db(auth_fn);
  } else if (!check_testing()) {
    console.warn("Database initialized multiple times");
  }

  return new Promise(resolve => {
    resolve(null);
  });
}

export function init_db(auth_fn?: Function): FirebaseInit {
  let firebase = new FirebaseInit(auth_fn);

  fireorm.initialize(firebase.firestore);

  return firebase;
}
