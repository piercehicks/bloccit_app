const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("routes : posts", () => {
  beforeEach(done => {
    this.topic;
    this.post;

    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "Banks",
        description: "Talk about your favorite banks!"
      }).then(topic => {
        this.topic = topic;
        Post.create({
          title: "Ally Bank",
          body: "It's a good bank but doesn't have any physical locations.",
          topicId: this.topic.id
        })
          .then(post => {
            this.post = post;
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("GET /topics/:topicId/posts/new", () => {
    it("should render a new post form", done => {
      request.get(`${base}/${this.topic.id}/posts/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Post");
        done();
      });
    });
  });

  describe("GET /topics/:topicId/posts/:id", () => {
    it("should render a view with the selected post", done => {
      request.get(
        `${base}/${this.topic.id}/posts/${this.post.id}`,
        (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Ally Bank");
          done();
        }
      );
    });
  });

  describe("GET /topics/:topicId/posts/:id/edit", () => {
    it("should render a view with an edit post form", done => {
      request.get(
        `${base}/${this.topic.id}/posts/${this.post.id}/edit`,
        (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit post");
          expect(body).toContain("Ally Bank");
          done();
        }
      );
    });
  });

  describe("POST /topics/:topicId/posts/create", () => {
    it("should create a new post and redirect", done => {
      const options = {
        url: `${base}/${this.topic.id}/posts/create`,
        form: {
          title: "Charles Schwab",
          body: "This is the best bank in the entire world!"
        }
      };
      request.post(options, (err, res, body) => {
        Post.findOne({ where: { title: "Charles Schwab" } })
          .then(post => {
            expect(post).not.toBeNull();
            expect(post.title).toBe("Charles Schwab");
            expect(post.body).toBe("This is the best bank in the entire world!");
            expect(post.topicId).not.toBeNull();
            done();
          })
          .catch(err => {
            console.log(err);
            done();
          });
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/destroy", () => {
    it("should delete the post with the corresponding ID", done => {
      Post.findAll().then(posts => {
        expect(posts[0].id).toBe(1);
        request.post(
          `${base}/${this.topic.id}/posts/${this.post.id}/destroy`,
          (err, res, body) => {
            Post.findByPk(1).then(post => {
              expect(err).toBeNull();
              expect(post).toBeNull();
              done();
            });
          }
        );
      });
    });
  });

  describe("POST /topics/:topicId/posts/:id/update", () => {
    it("should return a status code 302", done => {
      request.post(
        {
          url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
          form: {
            title: "Wells Fargo",
            body: "I like it. Never had a big issue with them, lol."
          }
        },
        (err, res, body) => {
          expect(res.statusCode).toBe(302);
          done();
        }
      );
    });

    it("should update the post with the given updates", done => {
      const options = {
        url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
        form: {
          title: "Wells Fargo"
        }
      };
      request.post(options, (err, res, body) => {
        expect(err).toBeNull();
        Post.findOne({
          where: { id: this.post.id }
        }).then(post => {
          expect(post.title).toBe("Wells Fargo");
          done();
        });
      });
    });
  });
});
