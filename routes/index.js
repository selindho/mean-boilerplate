var express = require('express');
var hal = require( '../hal/hal');
var router = express.Router();

/* API root */
router.get('/', function(req, res, next) {
    return res.render( 'index.ejs' );
});

module.exports = router;
