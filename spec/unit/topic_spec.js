const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("POST", () => {
  beforeEach(done => {
    this.topic;
    this.post;
    sequelize.sync({ force: true }).then(res => {
      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description:
          "A compilation of reports from recent visits to the star system."
      })
        .then(topic => {
          this.topic = topic;

          Post.create({
            title: "BEST COMPUTERS!",
            body: "What's the best laptop for working 90+ hours per week?",
            topicId: this.topic.id
          }).then(post => {
            this.post = post;
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done();
        });
    });
  });

  describe("#create()", () => {
    it("should create a topic object with a title and description", done => {
      Topic.create({
        title: "BEST COMPUTERS!",
        description: "What's the best laptop for working 90+ hours per week?"
      }).then(topic => {
        expect(topic.title).toBe("BEST COMPUTERS!");
        expect(topic.description).toBe(
          "What's the best laptop for working 90+ hours per week?"
        );
        done();
      });
    });
    it("should create a topic with a corresponding title post", done => {
      Topic.create({
        title: "BEST COMPUTERS!",
        description: "What's the best laptop for working 90+ hours per week?"
      })
        .then(topic => {
          done();
        })
        .catch(err => {
          expect(err.message).toContain("Topic.title cannot be null");
          expect(err.message).toContain("Topic.description cannot be null");
          done();
        });
    });
  });

  describe("#getPosts()", () => {
    it("should return the associated posts", done => {
        expect(this.post.title).toBe("BEST COMPUTERS!");
        done();
   });
 });
});
