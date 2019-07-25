const Comment = require("./models").Comment;
const Post = require("./models").Post;
const Favorite = require("./models").Favorite;
const Authorizer = require("../policies/favorite");
const User = require("./models").User;


module.exports = {
    // #2
    createFavorite(req, callback) {
        return Favorite.create({
            postId: req.params.postId,
            userId: req.user.id
        })
            .then(favorite => {
                callback(null, favorite);
            })
            .catch(err => {
                callback(err);
            });
    },

    // #3
    deleteFavorite(req, callback) {
        const postId = req.params.postId;
        return Favorite.findByPk(postId)
            .then(favorite => {
                if (!favorite) {
                    return callback("Favorite not found");
                }

                // #4
                const authorized = new Authorizer(req.user, favorite).destroy();
                if (authorized) {
                    Favorite.destroy({ where: { postId } })
                        .then(deletedRecordsCount => {
                            callback(null, deletedRecordsCount);
                        })
                        .catch(err => {
                            callback(err);
                        });
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    callback(401);
                }
            })
            .catch(err => {
                callback(err);
            });
    }
};
