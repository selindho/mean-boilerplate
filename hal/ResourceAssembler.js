var _ = require( 'underscore' );
var hal = require( './hal' );

var ResourceAssembler = function( options ) {
    this.baseUri = options.baseUri;
};

_.extend( ResourceAssembler.prototype, {

    assemble: function( resource ) {
        throw this + '.assemble not implemented.';
    },

    link: function( resource ) {
        return hal.link( this.baseUri );
    },

    uri: function() {
        return this.baseUri;
    },

    toString: function() {
        return 'hal.ResourceAssembler';
    }

});

module.exports = ResourceAssembler;
