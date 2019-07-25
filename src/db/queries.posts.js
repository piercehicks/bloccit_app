const Post = require("./models").Post;
const Vote = require("./models").Vote;
const Comment = require("./models").Comment;
const User = require("./models").User;
const Topic = require("./models").Topic;
const Favorite = require("./models").Favorite;

module.exports = {
  addPost(newPost, callback) {
        return Post.create(newPost)
            .then(post => {
                callback(null, post);
            })
            .catch(err => {
                console.log(err);
            });
    },
    getPost(id, callback) {
        return Post.findByPk(id, {
            include: [
                { model: Comment, as: "comments", include: [{ model: User }] },
                { model: Vote, as: "votes" },
                { model: Favorite, as: "favorites" }
            ]
        })
        .then(post => {
               callback(null, post);
           })
           .catch(err => {
               callback(err);
           });
   },
   deletePost(id, callback) {
       return Post.destroy({
           where: { id }
       })
       .then(deletedRecordsCount => {
               callback(null, deletedRecordsCount);
           })
           .catch(err => {
               callback(err);
           });
   },
   updatePost(id, updatedPost, callback) {
       return Post.findByPk(id).then(post => {
           if (!post) {
               return callback("post not found");
           }

           post.update(updatedPost, {
               fields: Object.keys(updatedPost)
           })
               .then(() => {
                   callback(null, post);
               })
               .catch(err => {
                   callback(err);
               });
       });
     }
   };
