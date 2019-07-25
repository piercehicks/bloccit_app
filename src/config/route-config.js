module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
    const topicRoutes = require("../routes/topics");
    const advertisementRoutes = require("../routes/advertisements");
    const postRoutes = require("../routes/posts");
    const voteRoutes = require("../routes/votes");
    const flairRoutes = require("../routes/flairs");
    const commentRoutes = require("../routes/comments");
    const favoriteRoutes = require("../routes/favorites");
    const userRoutes = require("../routes/users");

    if (process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(topicRoutes);
   app.use(advertisementRoutes);
    app.use(postRoutes);
    app.use(voteRoutes);
    app.use(userRoutes);
    app.use(commentRoutes);
    app.use(flairRoutes);
    app.use(favoriteRoutes);
  }
};
