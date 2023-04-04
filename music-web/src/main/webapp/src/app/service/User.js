'use strict';

/**
 * User service.
 */
angular.module('music').factory('User', function (Restangular) {
  var userInfo = null;

  return {
    /**
     * Returns user info.
     * @param force If true, force reloading data
     */
    userInfo: function (force) {
      if (userInfo == null || force) {
        userInfo = Restangular.one('user').get();
      }
      return userInfo;
    },

    /**
     * Login an user.
     */
    login: function (user) {
      return Restangular.one('user').post('login', user);
    },

    signup: function (user) {
      return Restangular.one('user').post('signup', user);
    },

    /**
     * Logout the current user.
     */
    logout: function () {
      return Restangular.one('user').post('logout', {});
    }
  }
});