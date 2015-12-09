var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var _ = require('underscore');
var when = require('when');
var Comment = mongoose.model('Comment');
var assemble = require( './assemble' );

////
// Comments
////
router.param( 'comment', function(req, res, next, id) {
    when( Comment.findById( id ).exec() ).then(
        function( comment ) {
            req.comment = comment;
        }
    ).ensure( next );
});

router.get( '/', function(req,res,next) {
    when( Comment.find().exec() ).then(
        function( comments ) {
            return res.hal( assemble.comments.resource( comments ) );
        }
    ).otherwise( next );
});

router.post( '/', function(req, res, next) {
    var comment = new Comment(req.body);
    when( comment.save() ).then(
        function( comment ) {
            return res.hal( assemble.comment.resource( comment ) );
        }
    ).otherwise( next );
});

router.get( '/:comment', function( req, res, next ) {
    if( !req.comment ) {
        return res.status(404).hal({});
    }
    return res.hal( assemble.comment.resource( req.comment ) );
});

router.delete( '/:comment', function( req, res, next ) {
    if( !req.comment ) {
        return res.status(404).hal({});
    }
    when( req.comment.remove() ).then(
        function() {
            return res.hal( assemble.comment.resource( req.comment ) );
        }
    ).otherwise( next );
} );

router.put( '/:comment', function( req, res, next ) {
    if ( !req.comment ) {
        return res.status(404).hal({});
    }
    req.comment.title = req.body.title || '';
    req.comment.link = req.body.link || '';
    req.comment.upvotes = _.isFinite( req.body.upvotes ) ? req.body.upvotes : 0;
    req.comment.comments = req.body.comments || [];

    when( req.comment.save() ).then(
        function( comment ) {
            return res.hal( assemble.comment.resource( comment ) );
        }
    ).otherwise( next );
});

router.patch( '/:comment', function( req, res, next ) {
    if ( !req.comment ) {
        return res.status(404).hal({});
    }
    req.comment.title = req.body.title || req.comment.title;
    req.comment.link = req.body.link || req.comment.link;
    req.comment.upvotes = _.isFinite( req.body.upvotes ) ? req.body.upvotes : req.comment.upvotes;
    req.comment.comments = req.body.comments || req.comment.comments;

    when( req.comment.save() ).then(
        function( comment ) {
            return res.hal( assemble.comment.resource( comment ) );
        }
    ).otherwise( next );
});

module.exports = router;
