'use strict';

/**
 * @format
 * @flow
 */

/**
 * @module ToggleRepeat
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
 * Async function which toggles repeat on the tracks the current user is listening to
 * 
 * @async
 * @function toggleRepeat
 * 
 * @author Aldo Gonzalez <aldo@tunerinc.com>
 *
 * @param    {string}  sessionID The session id to repeat the tracks of for the current user
 * @param    {boolean} status    The new repeat status for the current user
 *
 * @return   {Promise}
 * @resolves {object}            The tracks with the new repeat status from the now playing session
 * @reject   {Error}             The error which caused the repeat tracks failure
 */
export function toggleRepeat(
  sessionID: string,
  status: boolean,
): ThunkAction {
  return async (dispatch, _, {getFirestore}) => {
    dispatch(actions.toggleRepeatRequest());

    const firestore: FirestoreInstance = getFirestore();
    const sessionRef: FirestoreDoc = firestore.collection('sessions').doc(sessionID);

    try {
      await sessionRef.update({repeat: !status});
      dispatch(actions.toggleRepeatSuccess(!status));
    } catch (err) {
      dispatch(actions.toggleRepeatFailure(err));
    }
  };
}
