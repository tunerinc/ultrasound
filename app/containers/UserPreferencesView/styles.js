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
} from 'react-native/Libraries/StyleSheet/StyleSheet';

interface Styles {
  container: ViewStyleProp,
  shadow: ViewStyleProp,
  nav: ViewStyleProp,
  leftIcon: TextStyleProp,
  title: TextStyleProp,
  rightIcon: ViewStyleProp,
  preferencesWrap: ViewStyleProp,
  section: ViewStyleProp,
  sectionHeader: ViewStyleProp,
  sectionHeaderText: TextStyleProp,
  sectionOption: ViewStyleProp,
  sectionOptionWrap: ViewStyleProp,
  sectionOptionText: TextStyleProp,
  optionCheck: TextStyleProp,
};

const styles: Styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1b1b1e',
    justifyContent: 'center',
  },
  shadow: {
    height: 85,
    backgroundColor: '#1b1b1e',
    shadowColor: '#101010',
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 5,
    paddingTop: 15,
    paddingHorizontal: 20,
    zIndex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  nav: {
    flex: 1,
    flexDirection: 'row',
  },
  leftIcon: {
    flex: 2,
    height: 45,
    fontSize: 45,
    alignSelf: 'center',
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
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  rightIcon: {
    flex: 2,
    alignSelf: 'center',
  },
  preferencesWrap: {
    flex: 1,
    zIndex: -1,
    backgroundColor: 'transparent',
    paddingTop: 10,
  },
  section: {
    marginBottom: 40,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  sectionHeaderText: {
    fontFamily: 'Muli',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19.2,
    color: '#888',
  },
  sectionOption: {
    borderColor: '#323232',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  sectionOptionWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionOptionText: {
    fontFamily: 'Muli',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24,
    color: '#fefefe',
  },
  optionCheck: {
    fontSize: 25,
  },
});

export default styles;