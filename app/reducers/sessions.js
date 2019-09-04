'use strict';

/**
 * @format
 * @flow
 */

import moment from 'moment';
import updateObject from '../utils/updateObject';
import * as types from '../actions/sessions/types';
import * as entitiesTypes from '../actions/entities/types';
import {type Firebase} from '../utils/firebaseTypes';
import type {SpotifyError} from '../utils/spotifyAPI/types';
import {type Action as PlayerAction} from './player';
import {type Action as QueueAction} from './queue';
import {type Action as AlbumAction} from './albums';
import {type Action as ArtistAction} from './artists';
import {type Action as UserAction} from './users';
import {type Action as PlaylistAction} from './playlists';
import {type Action as TrackAction} from './tracks';
import {type Action as ChatAction} from './chat';
import {type Action as EntitiesAction} from './entities';

// Case Functions
import * as createSession from '../actions/sessions/CreateSession/reducers';
import * as getFollowingSessions from '../actions/sessions/GetFollowingSessions/reducers';
import * as getNearbySessions from '../actions/sessions/GetNearbySessions/reducers';
import * as getSessionInfo from '../actions/sessions/GetSessionInfo/reducers';
import * as getTrendingSessions from '../actions/sessions/GetTrendingSessions/reducers';
import * as joinSession from '../actions/sessions/JoinSession/reducers';
import * as leaveSession from '../actions/sessions/LeaveSession/reducers';
import * as paginateFollowingSessions from '../actions/sessions/PaginateFollowingSessions/reducers';
import * as paginateNearbySessions from '../actions/sessions/PaginateNearbySessions/reducers';
import * as paginateTrendingSessions from '../actions/sessions/PaginateTrendingSessions/reducers';
import * as stopSessionInfoListener from '../actions/sessions/StopSessionInfoListener/reducers';

export const lastUpdated: string = moment().format('ddd, MMM D, YYYY, h:mm:ss a');

type GetState = () => State;
type PromiseAction = Promise<DispatchAction>;
type ThunkAction = (dispatch: Dispatch, getState: GetState, firebase: Firebase) => any;
type Dispatch = (action: DispatchAction | PromiseAction | ThunkAction | Array<Action>) => any;
type DispatchAction =
  | Action
  | PlayerAction
  | QueueAction
  | AlbumAction
  | ArtistAction
  | PlaylistAction
  | UserAction
  | TrackAction
  | ChatAction
  | EntitiesAction;

type Session = {
  +lastUpdated?: string,
  +id?: ?string,
  +currentTrackID?: ?string,
  +currentQueueID?: ?string,
  +ownerID?: ?string,
  +distance?: number,
  +mode?: ?string,
  +listeners?: Array<string>,
  +totalListeners?: number,
  +totalPlayed?: number,
  +timeLastPlayed?: ?string,
  +followingID?: string,
};

type Action = {
  +type?: string,
  +error?: Error,
  +sessions?: {+[id: string]: Session} | Array<string>,
  +sessionID?: string,
  +followingIDs?: Array<string>,
  +followingCanPaginate?: boolean,
  +nearbyIDs?: Array<string>,
  +nearbyCanPaginate?: boolean,
  +trendingIDs?: Array<string>,
  +trendingCanPaginate?: boolean,
  +unsubscribe?: () => void,
  +userID?: string,
  +totalListeners?: number,
  +sessionID?: string,
  +updates?: Session,
  +isOwner?: boolean,
  +updates?: State,
  +item?: Session,
  +refreshing?: boolean,
};

type State = {
  +lastUpdated?: string,
  +currentSessionID?: ?string,
  +fetching?: Array<string>,
  +saving?: boolean,
  +paginating?: boolean,
  +refreshing?: boolean,
  +joining?: boolean,
  +leaving?: boolean,
  +selectedSession?: ?string,
  +infoUnsubscribe?: ?() => void,
  +error?: ?Error | SpotifyError,
  +explore?: {
    +trendingIDs?: Array<string>,
    +trendingCanPaginate?: boolean,
    +trendingLastUpdated?: string,
    +followingIDs?: Array<string>,
    +followingCanPaginate?: boolean,
    +followingLastUpdated?: string,
    +nearbyIDs?: Array<string>,
    +nearbyCanPaginate?: boolean,
    +nearbyLastUpdated?: string,
  },
};

export type {
  GetState,
  PromiseAction,
  ThunkAction,
  Dispatch,
  Session,
  Action,
  State,
};

/**
 * @callback infoUnsub
 */

/**
 * @constant
 * @alias singleSessionState
 * @type {object}
 * 
 * @property {string}   lastUpdated         The date/time the session was last updated
 * @property {string}   id=null             The Brassroots id of the session
 * @property {string}   currentTrackID=null The Spotify id of the current track playing
 * @property {string}   currentQueueID=null The Brassroots id of the current track playing in the queue
 * @property {string}   ownerID=null        The Brassroots id of the user who is the owner of the session
 * @property {number}   distance=0          The distance of the session to the current user, if permissions allow
 * @property {string}   mode=null           The mode the session is currently in
 * @property {string[]} listeners           The Brassroots ids of the listeners in the session
 * @property {number}   totalListeners=0    The total amount of listeners in the session
 * @property {number}   totalPlayed=0       The total amount of tracks that have been played
 * @property {string}   timeLastPlayed=null The last time the current track was played
 */
const singleState: Session = {
  lastUpdated,
  id: null,
  currentTrackID: null,
  currentQueueID: null,
  ownerID: null,
  distance: 0,
  mode: null,
  listeners: [],
  totalListeners: 0,
  totalPlayed: 0,
  timeLastPlayed: null,
};

/**
 * @constant
 * @alias sessionsState
 * @type {object}
 * 
 * @property {string}    lastUpdated                       The date/time the sessions were last updated
 * @property {string}    currentSessionID=null             The Brassroots id of the session the current user is in
 * @property {string[]}  fetching=[]                       Whether the current user is fetching session info
 * @property {boolean}   saving=false                      Whether the current user is saving a session
 * @property {boolean}   paginating=false                  Whether the current user is paginating sessions
 * @property {boolean}   refreshing=false                  Whether the current user is refreshing sessions
 * @property {boolean}   joining=false                     Whether the current user is joining a session
 * @property {boolean}   leaving=false                     Whether the current user is leaving a session
 * @property {string}    selectedSession=null              The selected session to view
 * @property {infoUnsub} infoUnsubscribe=null              The function to invoke to unsubscribe the session info listener
 * @property {Error}     error=null                        The error related to sessions actions
 * @property {object}    explore                           The explore view
 * @property {string[]}  explore.trendingIDs               The Brassroots ids of the sessions trending on the app
 * @property {boolean}   explore.trendingCanPaginate=true  Whether the trending sessions can paginate
 * @property {string}    explore.trendingLastUpdated       The date/time the trending sessions were last updated
 * @property {string[]}  explore.followingIDs              The Brassroots ids of the sessions of users the current user follows
 * @property {boolean}   explore.followingCanPaginate=true Whether the following sessions can paginate
 * @property {string}    explore.followingLastUpdated      The date/time the following sessions were last updated
 * @property {string[]}  explore.nearbyIDs                 The Brassroots ids of the sessions nearby to the current user
 * @property {boolean}   explore.nearbyCanPaginate=true    Whether the nearby sessions can paginate
 * @property {string}    explore.nearbyLastUpdated         The date/time the nearby sessions were last updated
 */
export const initialState: State = {
  lastUpdated,
  currentSessionID: null,
  fetching: [],
  saving: false,
  paginating: false,
  refreshing: false,
  joining: false,
  leaving: false,
  selectedSession: null,
  infoUnsubscribe: null,
  error: null,
  explore: {
    trendingIDs: [],
    trendingCanPaginate: true,
    trendingLastUpdated: lastUpdated,
    followingIDs: [],
    followingCanPaginate: true,
    followingLastUpdated: lastUpdated,
    nearbyIDs: [],
    nearbyCanPaginate: true,
    nearbyLastUpdated: lastUpdated,
  },
};

/**
 * Adds or updates a single session
 * 
 * @function addOrUpdateSession
 * 
 * @author Aldo Gonzalez <aldo@tunerinc.com>
 * 
 * @param   {object} state       The Redux state
 * @param   {object} action      The Redux action
 * @param   {string} action.type The type of Redux action
 * @param   {object} action.item The session object to add or update
 * 
 * @returns {object}             The single session added or updated with the new information
 */
function addOrUpdateSession(
  state: Session,
  action: Action,
): Session {
  const {listeners} = state;
  const {item, refreshing} = action;
  const updates: Session = item && Array.isArray(listeners)
    ? {
      ...item,
      lastUpdated,
      listeners: item.listeners && refreshing
        ? [...item.listeners]
        : item.listeners
        ? [...listeners, ...item.listeners]
        : [...listeners],
    }
    : {};

  return updateObject(state, updates);
}

export function session(
  state: Session = singleState,
  action: Action,
): Session {
  switch (action.type) {
    case entitiesTypes.ADD_ENTITIES:
      return addOrUpdateSession(state, action);
    case types.JOIN_SESSION_SUCCESS:
      return joinSession.join(state, action);
    case types.LEAVE_SESSION_SUCCESS:
      return leaveSession.leave(state);
    default:
      return state;
  }
}

/**
 * Updates any of the values in the sessions state
 * 
 * @function update
 * 
 * @author Aldo Gonzalez <aldo@tunerinc.com>
 * 
 * @param   {object} state          The Redux state
 * @param   {object} action         The Redux action
 * @param   {string} action.type    The type of Redux action
 * @param   {object} action.updates The updates to make to the state
 * 
 * @returns {object}                The state updated with the new information
 */
function update(
  state: State,
  action: Action,
): State {
  const {explore: oldExplore} = state;
  const updates: State = oldExplore && typeof action.type === 'string'
    ? {
      ...(action.updates ? action.updates : {}),
      saving: action.type === 'SAVE_SESSION_REQUEST' ? true : false,
      error: action.error ? action.error : null,
      explore: action.updates && action.updates.explore
        ? updateObject(oldExplore, action.updates.explore)
        : {...oldExplore},
    }
    : {};

  return updateObject(state, updates);
}

export default function reducer(
  state: State = initialState,
  action: Action = {},
): State {
  if (typeof action.type === 'string') {
    switch (action.type) {
      case types.CREATE_SESSION_REQUEST:
        return createSession.request(state);
      case types.CREATE_SESSION_SUCCESS:
        return createSession.success(state, action);
      case types.CREATE_SESSION_FAILURE:
        return createSession.failure(state, action);
      case types.GET_FOLLOWING_SESSIONS_REQUEST:
        return getFollowingSessions.request(state);
      case types.GET_FOLLOWING_SESSIONS_SUCCESS:
        return getFollowingSessions.success(state, action);
      case types.GET_FOLLOWING_SESSIONS_FAILURE:
        return getFollowingSessions.failure(state, action);
      case types.GET_NEARBY_SESSIONS_REQUEST:
        return getNearbySessions.request(state);
      case types.GET_NEARBY_SESSIONS_SUCCESS:
        return getNearbySessions.success(state, action);
      case types.GET_NEARBY_SESSIONS_FAILURE:
        return getNearbySessions.failure(state, action);
      case types.GET_SESSION_INFO_REQUEST:
        return getSessionInfo.request(state);
      case types.GET_SESSION_INFO_SUCCESS:
        return getSessionInfo.success(state, action);
      case types.GET_SESSION_INFO_FAILURE:
        return getSessionInfo.failure(state, action);
      case types.GET_TRENDING_SESSIONS_REQUEST:
        return getTrendingSessions.request(state);
      case types.GET_TRENDING_SESSIONS_SUCCESS:
        return getTrendingSessions.success(state, action);
      case types.GET_TRENDING_SESSIONS_FAILURE:
        return getTrendingSessions.failure(state, action);
      case types.JOIN_SESSION_REQUEST:
        return joinSession.request(state);
      case types.JOIN_SESSION_SUCCESS:
        return joinSession.success(state, action);
      case types.JOIN_SESSION_FAILURE:
        return joinSession.failure(state, action);
      case types.LEAVE_SESSION_REQUEST:
        return leaveSession.request(state);
      case types.LEAVE_SESSION_SUCCESS:
        return leaveSession.success(state, action);
      case types.LEAVE_SESSION_FAILURE:
        return leaveSession.failure(state, action);
      case types.PAGINATE_FOLLOWING_SESSIONS_REQUEST:
        return paginateFollowingSessions.request(state);
      case types.PAGINATE_FOLLOWING_SESSIONS_SUCCESS:
        return paginateFollowingSessions.success(state, action);
      case types.PAGINATE_FOLLOWING_SESSIONS_FAILURE:
        return paginateFollowingSessions.failure(state, action);
      case types.PAGINATE_NEARBY_SESSIONS_REQUEST:
        return paginateNearbySessions.request(state);
      case types.PAGINATE_NEARBY_SESSIONS_SUCCESS:
        return paginateNearbySessions.success(state, action);
      case types.PAGINATE_NEARBY_SESSIONS_FAILURE:
        return paginateNearbySessions.failure(state, action);
      case types.PAGINATE_TRENDING_SESSIONS_REQUEST:
        return paginateTrendingSessions.request(state);
      case types.PAGINATE_TRENDING_SESSIONS_SUCCESS:
        return paginateTrendingSessions.success(state, action);
      case types.PAGINATE_TRENDING_SESSIONS_FAILURE:
        return paginateTrendingSessions.failure(state, action);
      case types.RESET_SESSIONS:
        return initialState;
      case types.SAVE_SESSION_REQUEST:
      case types.SAVE_SESSION_SUCCESS:
      case types.SAVE_SESSION_FAILURE:
        return update(state, action);
      case types.STOP_SESSION_INFO_LISTENER_REQUEST:
        return state;
      case types.STOP_SESSION_INFO_LISTENER_SUCCESS:
        return stopSessionInfoListener.success(state);
      case types.STOP_SESSION_INFO_LISTENER_FAILURE:
        return stopSessionInfoListener.failure(state, action);
      case types.UPDATE_SESSIONS:
        return update(state, action);
      default:
        return state;
    }
  }

  return state;
}