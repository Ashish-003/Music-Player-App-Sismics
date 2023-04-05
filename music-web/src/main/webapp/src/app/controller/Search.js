'use strict';

/**
 * Search controller.
 */
angular.module('music').controller('Search', function ($rootScope, $scope, $stateParams, $http, Restangular, Playlist) {

  // Server call debounced
  var search = _.debounce(function (query) {
    Restangular.one('search', query).get({ limit: 100 }).then(function (data) {
      $scope.results = data;
    });
    $http.get('https://ws.audioscrobbler.com/2.0/', {
      params: {
        method: 'track.search',
        api_key: '7119a7b5c4455bbe8196934e22358a27',
        format: 'json',
        limit: 10,
        track: query
      }
    }).then(function (response) {
      var lastFmTracks = response.data.results.trackmatches.track
      $scope.results.lastFm = lastFmTracks;
    });

    $http.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'track',
        limit: 10
      },
    headers: {
      'Authorization': 'Bearer ' + 'BQBYPQmJKh5hne90YROkRoDY-bZ1ANM2f-LXL7OrLwt0oBnJtNZ6fnKYrxCOubt07kO0vgcyxfy6L4vMlaDmzLH1PYmWb52GekkyW4HSCnsJPkQVxtuRX7VWkuJu4UG7nv8D-eKr1z0MJpXL0H5Wi43niBUeKQYMAe5ly7HyXVTPyjfN6N0XdN1Cv_ImkqK8ThfMXLhN9QgjEk2AIO531KYMMlr5p9puPyUktMpkVdb7gyJ-ZGL6q76r0vt2ZK_NJ2sTWV7d7AFDYvCLLSj0ZH90GMSTnpWYTpag3TOlAJh8oTfEDPGOGLSmI4g9-XaPkHn5C0rzt4d3epwGDBSITMlRuBBiBTTkv_Pa2uHzgr8I6SA'
    }
    }).then(function (response) {
      var spotifyTracks = response.data.tracks.items;
      if ($scope.results) {
        $scope.results.spotify = spotifyTracks;
      } else {
        $scope.results = {
          spotify: spotifyTracks
        };
      }
    });

    }, 300);



    // Watch the search query
    $scope.$watch('$stateParams.query', function (newval) {
      search(newval);
    });

    // Play a single track
    $scope.playTrack = function (track) {
      Playlist.removeAndPlay(track);
    };

    // Add a single track to the playlist
    $scope.addTrack = function (track) {
      Playlist.add(track, false);
    };

    // Like/unlike a track
    $scope.toggleLikeTrack = function (track) {
      Playlist.likeById(track.id, !track.liked);
    };

    // Update UI on track liked
    $scope.$on('track.liked', function (e, trackId, liked) {
      var track = _.findWhere($scope.results.tracks, { id: trackId });
      if (track) {
        track.liked = liked;
      }
    });

    // Add all tracks to the playlist in a random order
    $scope.shuffleAllTracks = function () {
      Playlist.addAll(_.shuffle(_.pluck($scope.results.tracks, 'id')), false);
    };

    // Play all tracks
    $scope.playAllTracks = function () {
      Playlist.removeAndPlayAll(_.pluck($scope.results.tracks, 'id'));
    };

    // Add all tracks to the playlist
    $scope.addAllTracks = function () {
      Playlist.addAll(_.pluck($scope.results.tracks, 'id'), false);
    };

    // Load and play an album
    $scope.playAlbum = function (album) {
      Restangular.one('album', album.id).get().then(function (data) {
        Playlist.removeAndPlayAll(_.pluck(data.tracks, 'id'));
      });
    };
  });