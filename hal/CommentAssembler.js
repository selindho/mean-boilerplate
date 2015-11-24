var _ = require( 'underscore' );
var hal = require( './hal' );
var ResourceAssembler = require( './ResourceAssembler' );

var CommentAssembler = function( baseUri ) {
    this.baseUri = baseUri;
};

_.extend( CommentAssembler.prototype, ResourceAssembler.prototype, {

    resource: function( comment ) {
        return hal.resource( uri + '/' + comment._id )
            .state( {
                body: comment.body,
                author: comment.author,
                upvotes: comment.upvotes
            } );
    },

    link: function( comment ) {
        return hal.link( this.baseUri + '/' + comment._id );
    },

    toString: function() {
        return 'hal.CommentAssembler';
    }

} );

module.exports = CommentAssembler;
