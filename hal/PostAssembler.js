var _ = require( 'underscore' );
var hal = require( './hal' );
var ResourceAssembler = require( './ResourceAssembler' );

var PostAssembler = function( baseUri, commentAssembler ) {
    this.baseUri = baseUri;
    this.commentAssembler = commentAssembler;
};

_.extend( PostAssembler.prototype, ResourceAssembler.prototype, {

    resource: function( post ) {
        return hal.resource( this.baseUri + '/' + post._id )
            .state( {
                title: post.title,
                link: post.link,
                upvotes: post.upvotes
            } )
            .embed( {
                comments: _.map( post.comments, function( comment ){
                    return commentAssembler.resource( comment );
                } )
            } );
    },

    link: function( post ) {
        return hal.link( this.baseUri + '/' + post._id );
    },

    toString: function() {
        return 'hal.PostAssembler';
    }

} );

module.exports = PostAssembler;
