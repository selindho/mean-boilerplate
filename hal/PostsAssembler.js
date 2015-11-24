var _ = require( 'underscore' );
var hal = require( './hal' );
var ResourceAssembler = require('./ResourceAssembler');

var PostsAssembler = function( baseUri, postAssembler ) {
    this.baseUri = baseUri;
    this.postAssembler = postAssembler;
};

_.extend( PostsAssembler.prototype, ResourceAssembler.prototype, {

    resource: function( posts ) {
        return hal.resource( this.baseUri )
            .state( {
                size: posts.length,
            } )
            .link( {
                posts: _.map( posts, _.bind( function( post ) {
                    return this.postAssembler.link( post );
                }, this ) )
            } )
            .embed( {
                posts: _.map( posts, _.bind( function( post ) {
                    return this.postAssembler.resource( post );
                }, this ) )
            } );
    },

    toString: function() {
        return 'hal.PostsAssembler';
    }

});

module.exports = PostsAssembler;
