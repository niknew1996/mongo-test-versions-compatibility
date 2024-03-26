const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://myTestDBUser:myTestDBPassword@52.221.191.136:27017/mytestdb?authSource=admin";
const client = new MongoClient(uri);
const { faker } = require("@faker-js/faker");
client.connect(err => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    const collection = client.db("mytestdb").collection("users");
    // perform actions on the collection object
    client.close();
  }
});
describe("Database Tests", () => {
  let usersCollection;

  beforeAll(async () => {
    console.log("Connecting to the database...");
    try {
      await client.connect();
      const db = client.db("mytestdb");
      usersCollection = db.collection("users");
    } catch (err) {
      console.error("Error connecting to the database:", err);
    }
  }, 60000);

  test("Test CREATE", async () => {
    console.log("Creating new users...");
    let newUsers = [];
    let total_users_to_add = 3;

    for (let i = 0; i < total_users_to_add; i++) {
      newUsers.push({
        name: faker.person.firstName(),
        email: faker.internet.email(),
      });
    }

    const result = await usersCollection.insertMany(newUsers);
    console.log(`Inserted ${result.insertedCount} new users.`);
    expect(result.insertedCount).toBe(total_users_to_add);
  }, 30000);

  afterEach(async () => {
    console.log("Running afterEach...");
    await usersCollection.deleteMany({});
  });

  afterAll(async () => {
    await client.close();
  });
});