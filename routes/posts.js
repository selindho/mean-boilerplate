var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');
var when = require('when');
var Post = mongoose.model('Post');
var PostAssembler = require('../hal/PostAssembler');
var CommentAssembler = require('../hal/CommentAssembler');
var PostsAssembler = require('../hal/PostsAssembler');
var CommentsAssembler = require('../hal/CommentsAssembler');

// Instatiate assemblers
commentAssembler = new CommentAssembler( '/api/comments' );
postAssembler = new PostAssembler( '/api/posts', commentAssembler );
postsAssembler = new PostsAssembler( '/api/posts', postAssembler );

////
// Posts
////
router.param( 'post', function(req, res, next, id) {
    console.log('Request with post param.');
    when( Post.findById( id ).exec() ).then(
        function( post ) {
            req.post = post;
        }
    ).ensure( next );
});

router.get( '/', function(req,res,next) {
    console.log( 'Posts:GET');
    when( Post.find().exec() ).then(
        function(posts) {
            res.hal( postsAssembler.resource( posts ) );
        }
    ).otherwise( next );
});

router.post( '/', function(req, res, next) {
    var post = new Post(req.body);
    when( post.save() ).then(
        function(post){
            res.hal( postAssembler.resource( post ) );
        }
    ).otherwise( next );
});

router.get( '/:post', function( req, res, next ) {
    if( !req.post ) {
        return res.status(404).hal({});
    }
    return res.hal( postAssembler.resource( req.post ) );
});

router.delete( '/:post', function( req, res, next ) {
    if( !req.post ) {
        return res.status(404).hal({});
    }
    req.post.remove( function( err ) {
        if ( err ) {
            return next( err );
        }
        return res.hal( postAssembler.resource( req.post ) );
    });
} );

router.put( '/:post', function( req, res, next ) {
    if ( !req.post ) {
        return res.status(404).hal({});
    }
    req.post.title = req.body.title || '';
    req.post.link = req.body.link || '';
    req.post.upvotes = _.isFinite( req.body.upvotes ) ? req.body.upvotes : 0;
    req.post.comments = req.body.comments || [];

    when( req.post.save() ).then(
        function( post ) {
            return res.hal( postAssembler.resource( post ) );
        }
    ).otherwise( next );
});

router.patch( '/:post', function( req, res, next ) {
    if ( !req.post ) {
        return res.status(404).hal({});
    }
    req.post.title = req.body.title || req.post.title;
    req.post.link = req.body.link || req.post.link;
    req.post.upvotes = _.isFinite( req.body.upvotes ) ? req.body.upvotes : req.post.upvotes;
    req.post.comments = req.body.comments || req.post.comments;

    when( req.post.save() ).then(
        function( post ) {
            return res.hal( postAssembler.resource( post ) );
        }
    ).otherwise( next );
});

module.exports = router;
