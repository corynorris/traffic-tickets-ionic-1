// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('parker', ['ionic', 'LocalStorageModule', 'parker.controllers', 'parker.directives']);



app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

app.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
  localStorageServiceProvider
      .setPrefix('parker');

  $stateProvider
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "menu.html",
      controller: "AppCtrl"
    })
    .state('app.map', {
      url: "/map",
      views: {
        'menuContent' :{
          templateUrl: "map.html",
          controller: "MapCtrl"
        }
      }
    })
    .state('app.addTicket', {
      url: "/addTicket",
      views: {
        'menuContent' :{
          templateUrl: "addTicket.html",
          controller: "AddTicketCtrl"
        }
      }
    })
    .state('app.options', {
      url: "/options",
      views: {
        'menuContent' :{
          templateUrl: "options.html",
          controller: "OptionsCtrl"
        }
      }
    })
    .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "about.html"
        }
      }
    })
  $urlRouterProvider.otherwise("/app/map");
})