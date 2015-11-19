( function(){
  'use strict';

  angular.module('mainApp', ['ui.router'])

  .config([
    '$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider.state( 'posts', {
        url: '/posts',
        templateUrl: 'views/_posts.html',
        controller: 'PostsController'
      }).state( 'post', {
        url: '/posts/{id}',
        templateUrl: 'views/_post.html',
        controller: 'PostController'
      });

      $urlRouterProvider.otherwise('posts');

    }
  ])

  .service('PostsService', [function(){
    this.posts = [
      {
        title:'Derp.',
        link:'Hurp.',
        upvotes: 12,
        comments: []
      }
    ];
  }])

  .controller('PostsController', [
    '$scope', '$stateParams', 'PostsService',
    function($scope,$stateParams,PostsService){

      $scope.test = 'Hello world!';
      $scope.posts = PostsService.posts;

      $scope.incrementUpvotes = function( post ) {
        post.upvotes++;
      };

      $scope.addPost = function() {
        if(!$scope.title || $scope.title === '' ) {
          return;
        }
        $scope.posts.push({
          title: $scope.title,
          link: $scope.link,
          upvotes: 0
        });
        $scope.title = '';
        $scope.link = '';
      };

    }
  ])

  .controller('PostController', [
    '$scope', 'PostsService'
  ]);

} )();
