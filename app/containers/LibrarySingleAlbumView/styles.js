'use strict';

/**
 * @format
 * @flow
 */

import React from 'react';
import Dimensions from 'Dimensions';
import {StyleSheet} from 'react-native';
import {
  type ViewStyleProp,
  type TextStyleProp,
  type ImageStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';

interface Styles {
  container: ViewStyleProp,
  list: ViewStyleProp,
  scrollWrap: ViewStyleProp,
  header: ViewStyleProp,
  animatedHeader: ViewStyleProp,
  animatedShadow: ViewStyleProp,
  headerBackground: ViewStyleProp | ImageStyleProp,
  headerFilter: ViewStyleProp,
  blurred: ImageStyleProp,
  nav: ViewStyleProp,
  leftIcon: TextStyleProp,
  title: TextStyleProp,
  rightIcon: TextStyleProp,
  playButtonWrap: ViewStyleProp,
  headerBottomOptions: ViewStyleProp,
  shareButton: ViewStyleProp,
  shareIcon: TextStyleProp,
  shareText: TextStyleProp,
  options: TextStyleProp,
  modal: ViewStyleProp,
};

const screenHeight: number = Dimensions.get('window').height;
const HEADER_MAX_HEIGHT: number = 261;
const HEADER_MIN_HEIGHT: number = 85;
const styles: Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1b1e',
  },
  list: {
    marginBottom: HEADER_MIN_HEIGHT,
    backgroundColor: '#1b1b1e',
    minHeight: screenHeight - (HEADER_MAX_HEIGHT + 60),
  },
  scrollWrap: {
    backgroundColor: '#1b1b1e',
  },
  header: {
    height: HEADER_MAX_HEIGHT,
    backgroundColor: '#1b1b1e',
    zIndex: 0,
  },
  animatedHeader: {
    backgroundColor: '#1b1b1e',
    shadowColor: '#fefefe',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 5,
  },
  animatedShadow: {
    backgroundColor: '#1b1b1e',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: null,
    shadowColor: '#101010',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 5,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: null,
    zIndex: 1,
  },
  headerFilter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(27,27,30,0.5)',
    zIndex: 2,
  },
  blurred: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: null,
  },
  nav: {
    height: HEADER_MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  leftIcon: {
    flex: 1,
    height: 45,
    fontSize: 45,
    backgroundColor: 'transparent',
  },
  title: {
    flex: 6,
    color: '#fefefe',
    fontSize: 28,
    fontFamily: 'Muli',
    fontWeight: '800',
    lineHeight: 33.6,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  rightIcon: {
    flex: 1,
    height: 45,
    fontSize: 40,
    textAlign: 'right',
    backgroundColor: 'transparent',
  },
  playButtonWrap: {
    marginTop: 25,
    zIndex: 3,
  },
  headerBottomOptions: {
    marginTop: 25,
    paddingBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 3,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  shareIcon: {
    marginRight: 5,
  },
  shareText: {
    color: '#fefefe',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Muli',
    lineHeight: 23.4,
  },
  options: {
    flex: 1,
    textAlign: 'right',
    height: 40,
    backgroundColor: 'transparent',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default styles;