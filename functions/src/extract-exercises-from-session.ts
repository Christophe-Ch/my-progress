import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Exercise, Session } from './types';

const db = admin.firestore();

export const extractExercisesFromSession = firestore
  .document('sessions/{id}')
  .onWrite(async (change) => {
    const sessionData = change.after.data();
    if (sessionData === undefined) {
      return;
    }

    const profileId = sessionData.profileId;
    const result = await db
      .collectionGroup('profile')
      .where('uid', '==', profileId)
      .get();

    result.docs.forEach((doc) =>
      addExercisesToProfile(sessionData as Session, doc)
    );
  });

/**
 * Add exercises from session to exercises list on profile.
 * @param {Session} session Session data.
 * @param {QueryDocumentSnapshot} profile Profile document snapshot.
 */
async function addExercisesToProfile(
  session: Session,
  profile: QueryDocumentSnapshot
): Promise<void> {
  const profileData = await profile.data();
  if (typeof profileData.exercises === 'undefined') {
    profileData.exercises = [];
  }
  profileData.exercises = [
    ...new Set([
      ...(profileData.exercises ?? []),
      ...session.exercises.map((exercise: Exercise) => exercise.exercise),
    ]),
  ];
  await profile.ref.set(profileData);
}
