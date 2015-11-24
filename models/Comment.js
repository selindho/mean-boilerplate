var mongoose = require('mongoose');

var Comment = new mongoose.Schema({
    body: {
        type: String,
        default: '',
    },
    author: {
        type: String,
        default: ''
    },
    upvotes: {
        type: Number,
        default: 0
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
}, { strict: true } );

mongoose.model('Comment', Comment);
