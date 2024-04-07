import { firestore } from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  QuerySnapshot,
  Timestamp,
  WriteResult,
} from 'firebase-admin/firestore';
import {
  Exercise,
  ExerciseSessionStatistics,
  Session,
  Statistics,
} from './types';

const db = admin.firestore();

export const updateStatistics = firestore
  .document('sessions/{id}')
  .onWrite(async (change, _) => {
    const [newSessionData, oldSessionData, sessionId] = [
      change.after.data(),
      change.before.data(),
      change.after.id,
    ];

    const statistics = await fetchStatistics(
      newSessionData as Session,
      oldSessionData as Session
    );

    await updateStatisticsData(
      newSessionData as Session,
      oldSessionData as Session,
      sessionId,
      statistics
    );
  });

/**
 * Fetch statistics document from session data.
 * @param {Session} oldSessionData Old session data.
 * @param {Session} newSessionData New session data.
 */
async function fetchStatistics(
  oldSessionData: Session | undefined,
  newSessionData: Session | undefined
): Promise<QuerySnapshot<DocumentData>> {
  const profileId = newSessionData?.profileId ?? oldSessionData?.profileId;
  return await db
    .collection('statistics')
    .where('profileId', '==', profileId)
    .get();
}

/**
 * Update statistics document based on session data.
 * @param {Session} newSessionData Session data.
 * @param {Session} oldSessionData Old session data.
 * @param {string} sessionId Session id.
 * @param {QuerySnapshot<DocumentData>} statistics Statistics document ref.
 */
async function updateStatisticsData(
  newSessionData: Session | undefined,
  oldSessionData: Session | undefined,
  sessionId: string,
  queryResult: QuerySnapshot<DocumentData>
): Promise<void> {
  const statistics = queryResult.docs[0];
  const statisticsDocument = statistics?.data() ?? {
    profileId: newSessionData?.profileId,
    exercises: [],
  };

  if (typeof newSessionData === 'undefined') {
    if (typeof oldSessionData === 'undefined') return;
    deleteExistingStatistics(
      oldSessionData.exercises,
      statisticsDocument as Statistics,
      sessionId
    );
    await saveStatistics(statistics, statisticsDocument as Statistics);
    return;
  }

  const difference = compareSessions(oldSessionData, newSessionData);

  addNewStatistics(
    difference.created,
    statisticsDocument as Statistics,
    sessionId,
    newSessionData.date
  );
  updateExistingStatistics(
    difference.updated,
    statisticsDocument as Statistics,
    sessionId,
    newSessionData.date
  );
  deleteExistingStatistics(
    difference.deleted,
    statisticsDocument as Statistics,
    sessionId
  );

  await saveStatistics(statistics, statisticsDocument as Statistics);
}

/**
 * Add new exercises statistics for session.
 * @param {Exercise[]} createdExercises Updated exercises.
 * @param {Statistics} statisticsDocument Statistics object.
 * @param {string} sessionId Session id.
 * @param {Timestamp} sessionDate Session date.
 */
function addNewStatistics(
  createdExercises: Exercise[],
  statisticsDocument: Statistics,
  sessionId: string,
  sessionDate: Timestamp
) {
  createdExercises.forEach((exercise) => {
    const exerciseStatistics = statisticsDocument.exercises.find(
      (e) => e.exercise === exercise.exercise
    );
    const exerciseSessionStatistics = buildExerciseSessionStatistics(
      exercise,
      sessionId,
      sessionDate
    );

    if (typeof exerciseStatistics === 'undefined') {
      statisticsDocument.exercises.push({
        exercise: exercise.exercise,
        statistics: [exerciseSessionStatistics],
      });
    } else {
      exerciseStatistics.statistics.push(exerciseSessionStatistics);
    }
  });
}

/**
 * Update exercises statistics that had already been processed.
 * @param {Exercise[]} updatedExercises Updated exercises.
 * @param {Statistics} statisticsDocument Statistics object.
 * @param {string} sessionId Session id.
 * @param {Timestamp} sessionDate Session date.
 */
function updateExistingStatistics(
  updatedExercises: Exercise[],
  statisticsDocument: Statistics,
  sessionId: string,
  sessionDate: Timestamp
) {
  updatedExercises.forEach((exercise) => {
    const exerciseStatistics = statisticsDocument.exercises.find(
      (e) => e.exercise === exercise.exercise
    );

    if (typeof exerciseStatistics === 'undefined') return;

    const exerciseSessionStatistics = exerciseStatistics.statistics.find(
      (statistics) => statistics.sessionId === sessionId
    );

    if (typeof exerciseSessionStatistics !== 'undefined') {
      const statistics = buildExerciseSessionStatistics(
        exercise,
        sessionId,
        sessionDate
      );
      exerciseSessionStatistics.date = sessionDate;
      exerciseSessionStatistics.maxRepetitions = statistics.maxRepetitions;
      exerciseSessionStatistics.maxWeight = statistics.maxWeight;
      exerciseSessionStatistics.maxRepetitionsWeight =
        statistics.maxRepetitionsWeight;
    }
  });
}

/**
 * Delete old exercises statistics.
 * @param {Exercise[]} deletedExercises New session data.
 * @param {Statistics} statisticsDocument Statistics object.
 * @param {string} sessionId Session id.
 */
function deleteExistingStatistics(
  deletedExercises: Exercise[],
  statisticsDocument: Statistics,
  sessionId: string
) {
  deletedExercises.forEach((exercise) => {
    const exerciseStatistics = statisticsDocument.exercises.find(
      (e) => e.exercise === exercise.exercise
    );

    if (typeof exerciseStatistics === 'undefined') return;

    exerciseStatistics.statistics = exerciseStatistics.statistics.filter(
      (statistics) => statistics.sessionId !== sessionId
    );
  });
}

/**
 * Save statistics data.
 * @param {QueryDocumentSnapshot<DocumentData> | undefined} statistics Statistics document snapshot.
 * @param {Statistics} statisticsDocument Statistics data.
 */
async function saveStatistics(
  statistics: QueryDocumentSnapshot<DocumentData> | undefined,
  statisticsDocument: Statistics
): Promise<WriteResult | DocumentReference<DocumentData>> {
  if (typeof statistics !== 'undefined') {
    return statistics.ref.set(statisticsDocument);
  }
  return db.collection('statistics').add(statisticsDocument);
}

/**
 * Find differences between sessions.
 * @param {Session} oldSession Old session.
 * @param {Session} newSession New session.
 * @return {DifferenceData} Difference data.
 */
function compareSessions(
  oldSession: Session | undefined,
  newSession: Session
): { created: Exercise[]; updated: Exercise[]; deleted: Exercise[] } {
  if (typeof oldSession === 'undefined') {
    return { created: newSession.exercises, updated: [], deleted: [] };
  }

  return {
    created: newSession.exercises.filter(
      (newExercise) =>
        typeof oldSession.exercises.find(
          (oldExercise) => oldExercise.exercise === newExercise.exercise
        ) === 'undefined'
    ),
    updated: newSession.exercises.filter(
      (newExercise) =>
        typeof oldSession.exercises.find(
          (oldExercise) => oldExercise.exercise === newExercise.exercise
        ) !== 'undefined'
    ),
    deleted: oldSession.exercises.filter(
      (oldExercise) =>
        typeof newSession.exercises.find(
          (newExercise) => oldExercise.exercise === newExercise.exercise
        ) === 'undefined'
    ),
  };
}

/**
 * Build statistics for exercise from specific session.
 * @param {Exercise} exercise Exercise data for session.
 * @param {string} sessionId Session id.
 * @param {Timestamp} sessionDate Session date.
 * @return {ExerciseSessionStatistics} Exercise session statistics.
 */
function buildExerciseSessionStatistics(
  exercise: Exercise,
  sessionId: string,
  sessionDate: Timestamp
): ExerciseSessionStatistics {
  return {
    sessionId: sessionId,
    date: sessionDate,
    maxRepetitions: Math.max(...exercise.sets.map((set) => set.repetitions)),
    maxWeight: Math.max(...exercise.sets.map((set) => set.weight)),
    maxRepetitionsWeight: Math.max(
      ...exercise.sets.map((set) => set.repetitions * set.weight)
    ),
  };
}
