'use strict';

/**
 * @format
 * @flow
 */

import type {Settings} from '../reducers/settings';

export type FirestoreDoc = {
  exists: boolean,
  get: () => any,
  data: () => any,
  update: ({[key: string]: string | boolean}) => void,
};

export type FirestoreDocs = {
  empty: boolean,
  docs: Array<FirestoreDoc>,
};

export type FirestoreQuery = {
  get: () => FirestoreDocs,
};

export type FirestoreRef = {
  where: (string, string, string) => FirestoreQuery,
  doc: (string) => FirestoreDoc,
};

export type FirestoreInstance = {
  collection: (string) => FirestoreRef,
};

export type FirebaseInstance = {};

export type Firebase = {
  getFirestore: () => FirestoreInstance,
  getFirebase: () => FirebaseInstance,
};