'use strict';

/**
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet} from 'react-native';
import {
  type ViewStyleProp,
  type TextStyleProp,
  type ImageStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

interface Styles {
  playlist: ViewStyleProp,
  wrap: ViewStyleProp,
  image: ImageStyleProp,
  default: ViewStyleProp,
  defaultImage: ImageStyleProp,
  info: ViewStyleProp,
  name: TextStyleProp,
  owner: TextStyleProp,
  mode: TextStyleProp,
  icons: ViewStyleProp,
  member: TextStyleProp,
  arrow: TextStyleProp,
};

const styles: Styles = StyleSheet.create({
  playlist: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    height: 82,
    alignItems: 'center',
  },
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  default: {
    height: 50,
    width: 50,
    backgroundColor: '#323232',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultImage: {
    flex: 1,
    height: 37.19,
    width: 45,
  },
  info: {
    flex: 7,
    justifyContent: 'space-around',
  },
  name: {
    flex: 1,
    color: '#fefefe',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Muli',
    lineHeight: 25.2,
  },
  owner: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Muli',
    lineHeight: 18.2,
    color: '#888',
    paddingTop: 2,
  },
  mode: {
    width: 30,
    fontSize: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icons: {
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  member: {
    backgroundColor: '#1b1b1e',
    borderColor: '#fefefe',
    borderWidth: 3,
    marginRight: 5,
    fontSize: 16,
    height: 26,
    width: 26,
    paddingTop: 2,
    borderRadius: 13,
    textAlign: 'center',
  },
  arrow: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 5,
    paddingTop: 3,
  },
});

export default styles;