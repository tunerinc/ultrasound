'use strict';

/**
 * @format
 * @flow
 */

import * as actions from './actions';
import * as types from '../types';
import {type Action} from '../../../reducers/users';

describe('get user image synchronous action creators', () => {
  it('creates request action', () => {
    const expectedAction: Action = {type: types.GET_USER_IMAGE_REQUEST};
    expect(actions.getUserImageRequest()).toStrictEqual(expectedAction);
  });

  it('creates success action', () => {
    const expectedAction: Action = {type: types.GET_USER_IMAGE_SUCCESS};
    expect(actions.getUserImageSuccess()).toStrictEqual(expectedAction);
  });

  it('creates failure action', () => {
    const error: Error = new Error('error');
    const expectedAction: Action = {
      type: types.GET_USER_IMAGE_FAILURE,
      error,
    };

    expect(actions.getUserImageFailure(error)).toStrictEqual(expectedAction);
  });
});