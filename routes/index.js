var express = require('express');
var hal = require( '../hal/hal');
var router = express.Router();

/* API root */
router.get('/', function(req, res, next) {
    return res.hal(
        hal.resource('/derp')
            .state( {
                foo: {bar: true}
            } )
            .link( {
                baz: hal.link( 'bar' )
            } )
            .embed( {
                derpling: [
                    hal.resource( '/fooz' ).state( {roh: 'dah'} ),
                    hal.resource( '/borken' ).state( { dovah: 'kin'} )
                ]
            } )
        );
});

module.exports = router;
