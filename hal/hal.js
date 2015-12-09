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

var ResourceAssembler = function( options ) {
    this.baseUri = options.baseUri;
    this.identifier = options.identifier;
    this.decorators = options.decorators || [];
};

_.extend( ResourceAssembler.prototype, {

    resource: function( item ) {
        var resource = builder( this.baseUri );
        resource.link( { self: this.link( item ) } );
        return _.reduce( this.decorators, function( memo, decorator ) {
            return decorator( memo, item );
        }, resource);
    },

    link: function( item ) {
        return link( (
            this.identifier ?
            ( this.baseUri + '/' + item[ this.identifier ] ) :
            this.baseUri
        ), false );
    },

    decorator: function( deco ) {
        if ( _.isArray( deco ) ) {
            this.decorators = this.decorators.concat( deco );
        }
        else {
            this.decorators.push( deco );
        }
        return this;
    },

    toString: function() {
        return 'hal.ResourceAssembler';
    }

});

var CollectionAssembler = function( options ) {
    ResourceAssembler.call( this, options );
    this.assembler = options.assembler;
};

_.extend( CollectionAssembler.prototype, ResourceAssembler.prototype, {

    resource: function( resources ) {
        var collectionResource = ResourceAssembler.prototype.resource.call( this, resources );
        return collectionResource.state( {
            size: resources.length,
        } )
        .link( {
            resources: _.map( resources, _.bind( function( resource ) {
                return this.assembler.link( resource );
            }, this ) )
        } );
    },

    toString: function() {
        return 'hal.CollectionAssembler';
    }

});

function response( req, res, next ) {
    res.hal = function( resourceBuilder ) {
        res.type( 'application/hal+json' );
        res.send( JSON.stringify( resourceBuilder.build() ) );
    };
    next();
}

function filter( req, res, next ) {
    if ( req.accepts( 'hal+json' ) ||
        req.accepts( 'json' ) ) {
        next();
    }
    else {
        res.status(406).send();
    }
}

function collection( opts ) {
    return new CollectionAssembler( opts );
}

function resource( opts ) {
    return new ResourceAssembler( opts );
}

function builder( uri ) {
    return new ResourceBuilder( uri );
}

function link( href, templated ) {
    return new LinkBuilder( href, templated );
}

module.exports = {
    response: response,
    filter: filter,
    collection: collection,
    resource: resource,
    builder: builder,
    link: link
};
