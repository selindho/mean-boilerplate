var _ = require( 'underscore' );
var hal = require( '../hal/hal' );

/*
 * Instatiate assemblers
 */

var comment = hal.resource( {
    baseUri: '/api/comments',
    identifier: '_id'
} );

var comments = hal.collection( {
    baseUri: '/api/comments',
    assembler: comment
} );

var post = hal.resource( {
    baseUri:'/api/posts',
    identifier: '_id'
} );

var posts = hal.collection( {
    baseUri: '/api/posts',
    assembler: post
} );


/*
 * Decorators
 */

function baseCommentDecorator( resource, comment ) {
    return resource.state({
        body: comment.body,
        author: comment.author,
        upvotes: comment.upvotes
    }).link({
        post: post.link( comment.post )
    });
}

function basePostDecorator( resource, post ) {
    return resource.state({
        title: post.title,
        link: post.link,
        upvotes: post.upvotes
    }).link({
        comments: _.map( post.comments, comment.link )
    });
}

comment.decorator( baseCommentDecorator );
post.decorator( basePostDecorator );

module.exports = {
    post: post,
    posts: posts,
    comment: comment,
    comments: comments
};
