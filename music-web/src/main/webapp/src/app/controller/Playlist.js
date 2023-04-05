"use strict";

/**
 * Playlist controller.
 */
angular
  .module("music")
  .controller(
    "Playlist",
    function (
      $scope,
      $state,
      $stateParams,
      $http,
      Restangular,
      Playlist,
      NamedPlaylist
    ) {
      // Load playlist
      Restangular.one("playlist", $stateParams.id)
        .get()
        .then(function (data) {
          $scope.playlist = data;
        });

      // get reccomendations from lastFM
      $scope.recommendLastFM = function (playlist) {
        var trackLength = playlist.tracks.length;
        var lastTrack = playlist.tracks[trackLength - 1];
        $http
          .get("https://ws.audioscrobbler.com/2.0/", {
            params: {
              method: "track.getsimilar",
              api_key: "7119a7b5c4455bbe8196934e22358a27",
              track: lastTrack.title,
              autocorrect: 1,
              artist: lastTrack.artist.name,
              format: "json",
              limit: 10,
            },
          })
          .then(function (response) {
            $scope.results = {
              lastFmTracks: response.data.similartracks.track,
            };
          });
      };

      // get reccomendations from Spotify

      $scope.recommendSpotify = function (playlist) {
        var trackLength = playlist.tracks.length;
        var lastTrack = playlist.tracks[trackLength - 1];
        $http
          .get("https://ws.audioscrobbler.com/2.0/", {
            params: {
              method: "track.getsimilar",
              api_key: "7119a7b5c4455bbe8196934e22358a27",
              track: lastTrack.title,
              autocorrect: 1,
              artist: lastTrack.artist.name,
              format: "json",
              limit: 20,
            },
          })
          .then(function (response) {
            var tracks = response.data.similartracks.track;
            $scope.results = {
              spotifyTracks: tracks.slice(-10),
            };
          });
      };

      // Play a single track
      $scope.playTrack = function (track) {
        Playlist.removeAndPlay(track);
      };

      // Add a single track to the playlist
      $scope.addTrack = function (track) {
        Playlist.add(track, false);
      };

      // Add all tracks to the playlist in a random order
      $scope.shuffleAllTracks = function () {
        Playlist.addAll(
          _.shuffle(_.pluck($scope.playlist.tracks, "id")),
          false
        );
      };

      // Play all tracks
      $scope.playAllTracks = function () {
        Playlist.removeAndPlayAll(_.pluck($scope.playlist.tracks, "id"));
      };

      // Add all tracks to the playlist
      $scope.addAllTracks = function () {
        Playlist.addAll(_.pluck($scope.playlist.tracks, "id"), false);
      };

      // Like/unlike a track
      $scope.toggleLikeTrack = function (track) {
        Playlist.likeById(track.id, !track.liked);
      };

      // Remove a track
      $scope.removeTrack = function (order) {
        NamedPlaylist.removeTrack($scope.playlist, order).then(function (data) {
          $scope.playlist = data;
        });
      };

      // Delete the playlist
      $scope.remove = function () {
        NamedPlaylist.remove($scope.playlist).then(function () {
          $state.go("main.default");
        });
      };

      // Update UI on track liked
      $scope.$on("track.liked", function (e, trackId, liked) {
        var track = _.findWhere($scope.playlist.tracks, { id: trackId });
        if (track) {
          track.liked = liked;
        }
      });

      // Configuration for track sorting
      $scope.trackSortableOptions = {
        forceHelperSize: true,
        forcePlaceholderSize: true,
        tolerance: "pointer",
        handle: ".handle",
        containment: "parent",
        helper: function (e, ui) {
          ui.children().each(function () {
            $(this).width($(this).width());
          });
          return ui;
        },
        stop: function (e, ui) {
          // Send new positions to server
          $scope.$apply(function () {
            NamedPlaylist.moveTrack(
              $scope.playlist,
              ui.item.attr("data-order"),
              ui.item.index()
            );
          });

          // Configuration for track sorting
          $scope.trackSortableOptions = {
            forceHelperSize: true,
            forcePlaceholderSize: true,
            tolerance: "pointer",
            handle: ".handle",
            containment: "parent",
            helper: function (e, ui) {
              ui.children().each(function () {
                $(this).width($(this).width());
              });
              return ui;
            },
            stop: function (e, ui) {
              // Send new positions to server
              $scope.$apply(function () {
                NamedPlaylist.moveTrack(
                  $scope.playlist,
                  ui.item.attr("data-order"),
                  ui.item.index()
                );
              });
            },
          };
        },
      };
    }
  );
