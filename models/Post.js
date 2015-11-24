var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');

var Post = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        default: ''
    },
    upvotes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { strict: true });

Post.pre( 'remove', function( next ) {
    Comment.remove( {post: this}, function( err ) {
        if ( err ) {
            return next(err);
        }
        next();
    });
} );

mongoose.model('Post', Post);
