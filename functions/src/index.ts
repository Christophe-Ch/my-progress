/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {auth} from "firebase-functions/v1";
import * as admin from "firebase-admin";
import {uid} from "uid";

admin.initializeApp();

const db = admin.firestore();

export const onUserCreation = auth.user().onCreate(async (user) => {
  await new Promise((res) => setTimeout(res, 5000));
  await db.doc(`users/${user.uid}`).set({});
  await db.collection(`users/${user.uid}/profile`).add({
    firstName: "",
    lastName: "",
    uid: uid(),
  });
});
