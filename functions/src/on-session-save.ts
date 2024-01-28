import {firestore} from "firebase-functions";
import * as admin from "firebase-admin";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

const db = admin.firestore();

export const onSessionSave = firestore
  .document("sessions/{id}")
  .onWrite(async (change, _) => {
    const sessionData = change.after.data();
    if (sessionData === undefined) {
      return;
    }

    const profileId = sessionData.profileId;
    const result = await db
      .collectionGroup("profile")
      .where("uid", "==", profileId)
      .get();

    result.docs.forEach((doc) => addExercisesToProfile(sessionData, doc));
  });

/**
 * Add exercises from session to exercises list on profile.
 * @param {Session} session Session data.
 * @param {QueryDocumentSnapshot} profile Profile document snapshot.
 */
async function addExercisesToProfile(
  session: any,
  profile: QueryDocumentSnapshot
): Promise<void> {
  const profileData = await profile.data();
  profileData.exercises = [
    ...(profileData.exercises ?? []),
    ...session.exercises.map((exercise: any) => exercise.exercise),
  ];
  await profile.ref.set(profileData);
}
