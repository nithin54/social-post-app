process.env.NODE_ENV = "test";

const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const { connectToDatabase, disconnectDatabase } = require("../db");
const { resetStore } = require("../data/store");

describe("social post backend", () => {
  let mongoServer;
  let token;
  let postId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDatabase(mongoServer.getUri());
  });

  afterAll(async () => {
    await disconnectDatabase();

    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  beforeEach(async () => {
    await resetStore();
  });

  it("supports signup, posting, liking, and commenting", async () => {
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Nithi",
      email: "nithi@example.com",
      password: "secret123"
    });

    expect(signupResponse.statusCode).toBe(201);
    expect(signupResponse.body.token).toBeTruthy();
    token = signupResponse.body.token;

    const createPostResponse = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Hello from the rebuilt backend.",
        imageUrl: "data:image/png;base64,ZmFrZS1pbWFnZQ=="
      });

    expect(createPostResponse.statusCode).toBe(201);
    expect(createPostResponse.body.post.content).toBe(
      "Hello from the rebuilt backend."
    );
    expect(createPostResponse.body.post.imageUrl).toBe(
      "data:image/png;base64,ZmFrZS1pbWFnZQ=="
    );
    postId = createPostResponse.body.post.id;

    const likeResponse = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(likeResponse.statusCode).toBe(200);
    expect(likeResponse.body.post.likeCount).toBe(1);

    const commentResponse = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "This is working."
      });

    expect(commentResponse.statusCode).toBe(201);
    expect(commentResponse.body.post.comments).toHaveLength(1);

    const feedResponse = await request(app)
      .get("/api/posts")
      .set("Authorization", `Bearer ${token}`);

    expect(feedResponse.statusCode).toBe(200);
    expect(feedResponse.body.posts).toHaveLength(1);
    expect(feedResponse.body.posts[0].comments).toHaveLength(1);
  });

  it("allows an image-only post", async () => {
    const signupResponse = await request(app).post("/api/auth/signup").send({
      name: "Media User",
      email: "media@example.com",
      password: "secret123"
    });

    const imageOnlyResponse = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${signupResponse.body.token}`)
      .send({
        content: "",
        imageUrl: "data:image/png;base64,bWVkaWEtb25seQ=="
      });

    expect(imageOnlyResponse.statusCode).toBe(201);
    expect(imageOnlyResponse.body.post.imageUrl).toContain("data:image/png");
    expect(imageOnlyResponse.body.post.content).toBe("");
  });
});
