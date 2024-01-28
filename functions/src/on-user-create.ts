import {auth} from "firebase-functions/v1";
import * as admin from "firebase-admin";
import {uid} from "uid";
import {UserRecord} from "firebase-admin/auth";

admin.initializeApp();

const db = admin.firestore();

export const onUserCreation = auth.user().onCreate(async (user) => {
  await createUser(user);
  await createProfile(user);
});

/**
 * Create a user document.
 * @param {UserRecord} user User to create a document for.
 */
async function createUser(user: UserRecord): Promise<void> {
  await db.doc(`users/${user.uid}`).set({});
}

/**
 * Create a user profile document.
 * @param {UserRecord} user User to create a profile for.
 */
async function createProfile(user: UserRecord): Promise<void> {
  await db.collection(`users/${user.uid}/profile`).add({
    firstName: "",
    lastName: "",
    exercises: [],
    uid: uid(),
  });
}
