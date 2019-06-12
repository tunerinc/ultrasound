'use strict';

import React from 'react';
import PropTypes from 'prop-types'
import {Text, View, Image, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import TrackCard from '../../components/TrackCard';
import LoadingTrack from '../../components/LoadingTrack';
import LoadingMember from '../../components/LoadingMember';
import styles from './styles';

// Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Player Action Creators
import {playTrack} from '../../actions/player/PlayTrack';

// Playlists Action Creators
import {getPlaylistTopMembers} from '../../actions/playlists/GetPlaylistTopMembers';
import {getPlaylistTopTracks} from '../../actions/playlists/GetPlaylistTopTracks';

// Queue Action Creators
import {queueTrack} from '../../actions/queue/QueueTrack';

// Sessions Action Creators
import {createSession} from '../../actions/sessions/CreateSession';

class PlaylistDetailsView extends React.Component {
  constructor(props) {
    super(props);

    this.renderMember = this.renderMember.bind(this);
    this.renderTopTrack = this.renderTopTrack.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
  }

  navToProfile = title => () => {
    switch (title) {
      case 'Library':
        Actions.libraryProfileMain({userToView: item});
        return;
      case 'Profile':
        Actions.profileUser({userToView: item});
        return;
      default:
        return;
    }
  }

  renderMember({item, index}) {
    const {
      playlistToView,
      title,
      playlists: {playlistsByID},
      users: {usersByID},
    } = this.props;
    const playlist = playlistsByID[playlistToView];
    const user = usersByID[item];

    if (!user) return null;

    return (
      <TouchableOpacity style={styles.playlistMember} onPress={this.navToProfile(title)}>
        {index === 2 && playlist.members.length > 3 &&
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 80,
              height: 90,
            }}
          >
            {playlist.members.length - 3 > 100 &&
              <Text style={styles.memberCountText}>100+</Text>
            }
            {playlist.members.length - 3 <= 100 &&
              <Text style={styles.memberCountText}>
                {playlist.totalMembers - 3}+
              </Text>
            }
            <View style={styles.playlistMemberViewAllFilter}></View>
            <Image style={styles.playlistMemberViewAllImage} source={{uri: user.profileImage}} />
            <Text numberOfLines={1} style={styles.playlistMemberName}>view all</Text>
          </View>
        }
        {(index !== 2 || playlist.members.length <= 3) &&
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 80,
              height: 90,
            }}
          >
            <Image style={styles.playlistMemberImage} source={{uri: user.profileImage}} />
            <Text numberOfLines={1} style={styles.playlistMemberName}>
              {user.username}
            </Text>
          </View>
        }
      </TouchableOpacity>
    );
  }

  renderTopTrack({item, index}) {
    const {
      playlistToView,
      albums: {albumsByID},
      playlists: {playlistsByID, playlistTracksByID},
      tracks: {tracksByID},
      users: {usersByID},
    } = this.props;
    const {ownerID, name: playlistName} = playlistsByID[playlistToView];
    const {displayName} = usersByID[ownerID];
    const {totalPlays, userID} = playlistTracksByID[`${playlistToView}-${item}`];
    const {displayName: trackOwner} = usersByID[userID];

    let trackCount;

    if (totalPlays < 1000) {
      trackCount = totalPlays;
    } else if (totalPlays < 1000000) {
      const modifiedCount = totalPlays / 1000;
      trackCount = `${modifiedCount.toFixed(0)}K`;
    } else if (totalPlays < 1000000000) {
      const modifiedCount = totalPlays / 1000000;
      trackCount = `${modifiedCount.toFixed(0)}M`;
    } else if (totalPlays < 1000000000000) {
      const modifiedCount = totalPlays / 1000000000;
      trackCount = `${modifiedCount.toFixed(0)}B`;
    }

    return (
      <TrackCard
        key={item}
        artists={artists.map(a => a.name).join(', ')}
        context={{displayName, type: 'playlist-most', id: playlistToView, name: playlistName}}
        name={name}
        trackCount={trackCount}
        trackIndex={index}
        showUser={true}
        displayName={trackOwner}
        type='playlist'
      />
    );
  }

  renderHeader() {
    const {playlistToView, playlists: {playlistsByID}, users: {currentUserID}} = this.props;
    const {ownerID, members} = playlistsByID[playlistToView];

    return (
      <TouchableOpacity style={styles.playlistMemberAction} disabled>
        <View style={styles.playlistMemberImagePlaceholder}>
          <MaterialCommunityIcons name='plus' color='#fefefe' style={styles.plus} />
        </View>
        {(members.indexOf(currentUserID) !== -1 || ownerID === currentUserID) &&
          <Text style={styles.playlistMemberInviteText}>invite</Text>
        }
        {(members.indexOf(currentUserID) === -1 && ownerID !== currentUserID) &&
          <Text style={styles.playlistMemberInviteText}>join</Text>
        }
      </TouchableOpacity>
    );
  }

  render() {
    const {
      playlistToView,
      title,
      playlists: {playlistsByID, fetchingMembers, fetchingTopTracks, error: playlistError},
      users: {usersByID},
    } = this.props;
    const {
      ownerID,
      ownerType,
      topMembers,
      topTracks,
      totalPlays,
      image,
      name,
    } = playlistsByID[playlistToView];
    const owner = usersByID[playlist.ownerID];

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer} keyboardDismissMode='interactive'>
          <View style={styles.scrollWrap}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CREATOR</Text>
              {ownerID === 'spotify' &&
                <TouchableOpacity style={styles.playlistCreatorSpotify} disabled={true}>
                  <MaterialCommunityIcons
                    name='spotify'
                    color='#888'
                    style={styles.playlistCreatorSpotifyImage}
                  />
                  <Text style={[styles.playlistCreatorName, {color: '#888'}]}>Spotify</Text>
                  <Ionicons name='ios-arrow-forward' color='#888' style={styles.arrowForward} />
                </TouchableOpacity>
              }
              {ownerID !== 'spotify' &&
                <TouchableOpacity
                  style={styles.playlistCreator}
                  onPress={this.navToProfile(title)}
                >
                  <Image style={styles.playlistCreatorImage} source={{uri: owner.profileImage}} />
                  <Text style={styles.playlistCreatorName}>
                    {owner.displayName}
                  </Text>
                  <Ionicons
                    name='ios-arrow-forward'
                    size={45}
                    color='#fefefe'
                    style={styles.arrowForward}
                  />
                </TouchableOpacity>
              }
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MEMBERS</Text>
              {(!fetchingMembers && topMembers.length !== 0) &&
                <FlatList
                  data={topMembers}
                  renderItem={this.renderMember}
                  keyExtractor={item => item}
                  getItem={(data, index) => data[index]}
                  getItemCount={data => data.length}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  ListHeaderComponent={this.renderHeader}
                />
              }
              {(fetchingMembers || topMembers.length === 0) &&
                <View>
                  {(!fetchingMembers && playlistError) &&
                    <View style={styles.topMembersError}>
                      <Text style={styles.topMembersErrorText}>Unable to load members</Text>
                    </View>
                  }
                  {(!fetchingMembers && !playlistError && topMembers.length === 0) &&
                    <View style={styles.topMembersEmpty}>
                      <Text style={styles.topMembersEmptyText}>No members</Text>
                    </View>
                  }
                  {fetchingMembers &&
                    <View style={styles.loadingSection}>
                      <LoadingMember marginLeft={20} />
                      <LoadingMember />
                      <LoadingMember />
                      <LoadingMember />
                    </View>
                  }
                </View>
              }
            </View>
            {totalPlays === 1 &&
              <Text style={styles.playlistPlays}>
                <Text style={styles.playlistPlaysNumber}>
                  {totalPlays}
                </Text> PLAY
              </Text>
            }
            {totalPlays !== 1 &&
              <Text style={styles.playlistPlays}>
                <Text style={styles.playlistPlaysNumber}>
                  {totalPlays}
                </Text> PLAYS
              </Text>
            }
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {paddingBottom: 10}]}>TOP TRACKS</Text>
              {(!fetchingTopTracks && !playlistError && topTracks.length > 0) &&
                <FlatList
                  data={topTracks}
                  renderItem={this.renderTopTrack}
                  keyExtractor={item => item}
                  getItem={(data, index) => data[index]}
                  getItemCount={data => data.length}
                />
              }
              {(!fetchingTopTracks && playlistError) &&
                <View style={styles.topTracksError}>
                  <Text style={styles.topTracksErrorText}>Unable to load top tracks</Text>
                </View>
              }
              {(!fetchingTopTracks && !playlistError && topTracks.length === 0) &&
                <View style={styles.topTracksEmpty}>
                  <Text style={styles.topTracksEmptyText}>No tracks</Text>
                </View>
              }
              {fetchingTopTracks && <LoadingTrack type='top' />}
            </View>
          </View>
        </ScrollView>
        <View style={styles.header}>
          <View style={styles.headerBackground}>
            <Image
              style={styles.headerBackground}
              source={{uri: image}}
              resizeMode='cover'
              blurRadius={80}
            />
            <View style={styles.headerFilter}></View>
          </View>
          <View style={styles.nav}>
            <Ionicons
              name='ios-arrow-back'
              color='#fefefe'
              style={styles.leftIcon}
              onPress={Actions.pop}
            />
            <Text numberOfLines={1} style={styles.title}>
              {name}
            </Text>
            <View style={styles.rightIcon}></View>
          </View>
        </View>
      </View>
    );
  }
}

PlaylistDetailsView.propTypes = {
  albums: PropTypes.object.isRequired,
  artists: PropTypes.object.isRequired,
  createSession: PropTypes.func.isRequired,
  getPlaylistTopMembers: PropTypes.func.isRequired,
  getPlaylistTopTracks: PropTypes.func.isRequired,
  playlists: PropTypes.object.isRequired,
  playlistToView: PropTypes.string,
  playTrack: PropTypes.func.isRequired,
  queueTrack: PropTypes.func.isRequired,
  sessions: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  tracks: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
};

function mapStateToProps({albums, artists, playlists, sessions, settings, tracks, users}) {
  return {
    albums,
    artists,
    playlists,
    sessions,
    settings,
    tracks,
    users,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createSession,
    getPlaylistTopMembers,
    getPlaylistTopTracks,
    playTrack,
    queueTrack,
  },
  dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistDetailsView);