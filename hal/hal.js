var _ = require('underscore');

/**
 * Builder for a HAL resource.
 *
 * @class
 * @param {String} uri The URI for the resource
 */
var ResourceBuilder = function( uri ){
    this._state = {};
    this._links = {};
    this._embedded = {};
    this.link( { self: link( uri ) } );
};

_.extend( ResourceBuilder.prototype, {

    _state: null,
    _links: null,
    _embedded: null,

    /**
     * Extends the current state of the resource with the given map.
     *
     * @param {Object} state A key-value map
     * @return {Object} A reference to the builder object
     */
    state: function( state ){
        this._state = _.extend( this._state, state );
        return this;
    },


    /**
     * Extends the current links with a map of links.
     *
     * @param {Object} links A map of LinkBuilder objects
     * @return {Object} A reference to the builder object
     */
    link: function( links ) {
        this._links = _.extend( this._links, links );
        return this;
    },

    /**
     * Embeds a map of resources.
     *
     * @param {Object} embedded A map with ResourceBuilder objects
     * @return {Object} A reference to the builder object
     */
    embed: function( embedded ) {
        this._embedded = _.extend( this._embedded, embedded );
        return this;
    },

    /**
     * Assembles the resource
     *
     * @return {Object} A resource object
     */
    build: function() {
        var resource = {};

        // Build state
        _.each( this._state, function( value, key ) {
            resource[ key ] = value;
        });

        // Build links
        var links = {};
        var numLinks = 0;
        _.each( this._links, function( link, name ) {
            if ( _.isArray( link ) ) {
                links[ name ] = _.map( link, function( subLink ) {
                    return subLink.build();
                });
            }
            else {
                links[ name ] = link.build();
            }
            numLinks++;
        });
        resource._links = numLinks > 0 ? links : undefined;

        // Build embedded resources
        var embedded = {};
        var numEmbedded = 0;
        _.each( this._embedded, function( resource, name ) {
            if ( _.isArray( resource ) ) {
                embedded[ name ] = _.map( resource, function( subResource ) {
                    return subResource.build();
                });
            }
            else {
                embedded[ name ] = resource.build();
            }
            numEmbedded++;
        });
        resource._embedded = numEmbedded > 0 ? embedded : undefined;

        return resource;
    }

} );

var LinkBuilder = function( href, templated ) {
    this.href = href;
    this.templated = templated ? !!templated : undefined;
};

_.extend( LinkBuilder.prototype, {

    build: function() {
        var link = {};
        link.href = this.href;
        if ( this.templated ) {
            link.templated = true;
        }
        return link;
    }

} );

function response( req, res, next ) {
    res.hal = function( resourceBuilder ) {
        res.type( 'application/hal+json');
        res.send( JSON.stringify( resourceBuilder.build() ) );
    };
    next();
}

function filter( req, res, next ) {
    if ( req.accepts( 'hal+json') ||
        req.accepts( 'json') ) {
        next();
    }
    else {
        res.status(406).send();
    }
}

function resource( uri ) {
    return new ResourceBuilder( uri );
}

function link( href, templated ) {
    return new LinkBuilder( href, templated );
}

module.exports = {
    resource: resource,
    link: link,
    response: response,
    filter: filter
};
