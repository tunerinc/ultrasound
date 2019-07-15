'use strict';

/**
 * @format
 * @flow
 */

/**
 * @module PreviousTrack
 */

import moment from 'moment';
import Spotify from 'rn-spotify-sdk';
// import {GeoFirestore} from 'geofirestore';
import * as actions from './actions';
import {addRecentTrack} from '../../tracks/AddRecentTrack';
import {addSessions} from '../../sessions/AddSessions';
import {type TrackArtist} from '../../../reducers/tracks';
import {type ThunkAction} from '../../../reducers/player';
import {type FullTrack} from '../../../utils/spotifyAPI/types';
import {
  type FirestoreInstance,
  type FirestoreRef,
  type FirestoreDoc,
  type FirestoreDocs,
  type FirestoreBatch,
} from '../../../utils/firebaseTypes';

type User = {
  id: string,
  displayName: string,
  profileImage: string,
};

type Session = {
  id: string,
  totalPlayed: number,
  coords?: {
    lat: number,
    lon: number,
  },
  current: {
    id: string,
    userID: string,
    totalLikes: number,
    prevQueueID: string,
    prevTrackID: string,
    nextQueueID: string,
    track: {
      trackID?: string,
      timeAdded?: string | number,
      id: string,
      name: string,
      trackNumber: number,
      durationMS: number,
      artists: Array<TrackArtist>,
      album: {
        id: string,
        name: string,
        small: string,
        medium: string,
        large: string,
        artists: Array<TrackArtist>,
      },
    },
  },
};

/**
 * Async function which plays the previous track in the queue
 * 
 * @async
 * @function previousTrack
 * 
 * @author Aldo Gonzalez <aldo@tunerinc.com>
 * 
 * @param    {object}   user
 * @param    {string}   user.id
 * @param    {string}   user.displayName
 * @param    {string}   user.profileImage
 * @param    {object}   session
 * @param    {string}   session.id
 * @param    {number}   session.totalPlayed
 * @param    {object}   [session.coords]
 * @param    {number}   session.coords.lat
 * @param    {number}   session.coords.lon
 * @param    {object}   session.current
 * @param    {string}   session.current.id
 * @param    {string}   session.current.userID
 * @param    {number}   session.current.totalLikes
 * @param    {string}   session.current.prevQueueID
 * @param    {string}   session.current.prevTrackID
 * @param    {string}   session.current.nextQueueID
 * @param    {string}   session.current.track.id
 * @param    {string}   session.current.track.name
 * @param    {number}   session.current.track.trackNumber
 * @param    {number}   session.current.track.durationMS
 * @param    {object}   session.current.track.album
 * @param    {string}   session.current.track.album.id
 * @param    {string}   session.current.track.album.name
 * @param    {string}   [session.current.track.album.small]
 * @param    {string}   [session.current.track.album.medium]
 * @param    {string}   [session.current.track.album.large]
 * @param    {object[]} session.current.track.artists
 * @param    {string}   session.current.track.artists.id
 * @param    {string}   session.current.track.artists.name
 *
 * @returns  {Promise}
 * @resolves {object}                     The now playing session with the previous track playing
 * @reject   {Error}                      The error which caused the previous track failure
 */
export function previousTrack(
  user: User,
  session: Session,
): ThunkAction {
  return async (dispatch, _, {getFirestore}) => {
    dispatch(actions.previousTrackRequest());

    const firestore: FirestoreInstance = getFirestore();
    const sessionRef: FirestoreDoc = firestore.collection('sessions').doc(session.id);
    const sessionPrevRef: FirestoreDocs = sessionRef.collection('previouslyPlayed');
    const sessionQueueRef: FirestoreDocs = sessionRef.collection('queue');
    const sessionUserRef: FirestoreDoc = sessionRef.collection('users').doc(user.id);
    // const geoRef: FirestoreRef = firestore.collection('geo');
    // const geoFirestore = new GeoFirestore(geoRef);
    const {coords, current, totalPlayed} = session;

    try {
      // dispatch(addRecentTrack(user.id, current.track));

      const queueDoc = sessionQueueRef.doc();
      const queueID = queueDoc.id;
      const [prevDoc, prevTrack] = await Promise.all(
        [
          sessionPrevRef.doc(current.prevQueueID).get(),
          Spotify.getTrack(current.prevTrackID),
        ],
      );

      let batch: FirestoreBatch = firestore.batch();

      if (!prevDoc.exists) {
        throw new Error('Unable to retrieve previous track from Firestore.');
      }

      const newPrevTrack = typeof prevDoc.data().prevQueueID === 'string'
        ? await sessionPrevRef.doc(prevDoc.data().prevQueueID).get()
        : null;

      const hasImages: boolean = Array.isArray(prevTrack.album.images)
        && prevTrack.album.images.length === 3;

      const large: string = hasImages ? prevTrack.album.images[0].url : '';
      const medium: string = hasImages ? prevTrack.album.images[1].url : large;
      const small: string = hasImages ? prevTrack.album.images[2].url : medium;

      batch.update(sessionUserRef, {progress: 0, paused: false});
      batch.set(
        sessionPrevRef.doc(current.id),
        {
          id: current.id,
          trackID: current.track.id,
          userID: current.userID,
          totalLikes: current.totalLikes,
          prevQueueID: current.prevQueueID,
          nextQueueID: queueID,
        }
      );

      batch.set(
        sessionQueueRef.doc(queueID),
        {
          user,
          id: queueID,
          added: true,
          prevQueueID: current.id,
          nextQueueID: current.nextQueueID || null,
          timeAdded: firestore.FieldValue.serverTimestamp(),
          totalLikes: 0,
          likes: [],
          track: {
            id: prevTrack.id,
            name: prevTrack.name,
            trackNumber: prevTrack.track_number,
            durationMS: prevTrack.duration_ms,
            artists: prevTrack.artists.map(a => ({id: a.id, name: a.name})),
            album: {
              small,
              medium,
              large,
              id: prevTrack.album.id,
              name: prevTrack.album.name,
              artists: prevTrack.album.artists.map(a => ({id: a.id, name: a.name})),
            },
          },
        }
      );

      if (current.nextQueueID) {
        batch.update(sessionQueueRef.doc(current.nextQueueID), {prevTrackID: queueID});
      }

      batch.update(
        sessionRef,
        {
          progress: 0,
          currentQueueID: queueID,
          currentTrackID: prevTrack.id,
          timeLastPlayed: moment().format('ddd, MMM D, YYYY, h:mm:ss a'),
          paused: false,
          'totals.previouslyPlayed': totalPlayed + 1,
        }
      );

      batch.delete(sessionQueueRef.doc(current.id));

      await Promise.all(
        [
          batch.commit(),
          Spotify.playURI(`spotify:track:${prevTrack.id}`, 0, 0),
        ],
      );

      dispatch(
        addSessions(
          {
            [session.id]: {
              id: session.id,
              currentTrackID: prevTrack.id,
              currentQueueID: queueID,
            },
          },
        ),
      );

      dispatch(
        actions.previousTrackSuccess(
          queueID,
          prevTrack.id,
          prevTrack.duration_ms,
          prevDoc.data().prevQueueID,
          newPrevTrack ? newPrevTrack.data().trackID : null,
        ),
      );
    } catch (err) {
      dispatch(actions.previousTrackFailure(err));
    }
  };
}
