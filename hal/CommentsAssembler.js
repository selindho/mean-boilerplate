var _ = require( 'underscore' );
var hal = require( './hal' );
var ResourceAssembler = require('./ResourceAssembler');

var CommentsAssembler = function( baseUri, commentAssembler ) {
    this.baseUri = baseUri;
    this.commentAssembler = commentAssembler;
};

_.extend( CommentsAssembler.prototype, ResourceAssembler.prototype, {

    resource: function( comments ) {
        return hal.resource( this.baseUri )
            .state( {
                size: comments.length,
            } )
            .link( {
                comments: _.map( comments, _.bind( function( comment ) {
                    return this.commentAssembler.link( comment );
                }, this ) )
            } )
            .embed( {
                comments: _.map( comments, _.bind( function( comment ) {
                    return this.commentAssembler.resource( comment );
                }, this ) )
            } );
    },

    toString: function() {
        return 'hal.CommentAssembler';
    }

});

module.exports = CommentsAssembler;
