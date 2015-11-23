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
        comments: [
          {author: 'Derpling', body: 'HurrDurr!1..one', upvotes: -3},
          {author: 'Zergling', body: 'ZergZergZerg', upvotes: 3},
          {author: 'Anon', body: 'Very neccessary comment.', upvotes: 12}
        ]
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
    '$scope', '$stateParams', 'PostsService',
    function( $scope, $stateParams, PostsService ) {
      var post = PostsService.posts[ $stateParams.id ];
      $scope.post = post;
      $scope.incrementUpvotes = function() {
        post.upvotes++;
      };
      $scope.incrementCommentUpvotes = function( comment ) {
        comment.upvotes++;
      };
    }
  ]);

} )();
