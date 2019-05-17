'use strict';

/**
 * @format
 * @flow
 */

/**
 * @module ToggleShuffle
 */

import * as actions from './actions';
import type {Action, State} from '../../../reducers/player';
import type {
  Firebase,
  FirestoreInstance,
  FirestoreDoc,
} from '../../../utils/firebaseTypes';

type GetState = () => State;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState, firebase: Firebase) => any;
type Dispatch = (action: Action | PromiseAction | ThunkAction | Array<Action>) => any;

/**
 * Async function which toggles shuffle on the tracks the current user is listening to
 * 
 * @async
 * @function toggleShuffle
 * 
 * @author Aldo Gonzalez <aldo@tunerinc.com>
 *
 * @param    {string}  sessionID The session id to toggle shuffle from
 * @param    {boolean} status    The new shuffle status for the current user
 *
 * @return   {Promise}
 * @resolves {object}            The tracks with the new shuffle status from the now playing session
 * @reject   {Error}             The error which caused the toggle shuffle failure
 */
export function toggleShuffle(
  sessionID: string,
  status: boolean,
): ThunkAction {
  return async (dispatch, _, {getFirestore}) => {
    dispatch(actions.toggleShuffleRequest());

    const firestore: FirestoreInstance = getFirestore();
    const sessionRef: FirestoreDoc = firestore.collection('sessions').doc(sessionID);

    try {
      await sessionRef.update({shuffle: !status});
      dispatch(actions.toggleShuffleSuccess(!status));
    } catch (err) {
      dispatch(actions.toggleShuffleFailure(err));
    }
  };
}
