const mongoose = require("mongoose");

const DEFAULT_URI = "mongodb://127.0.0.1:27017/social-post-app";

async function connectToDatabase(uri = process.env.MONGODB_URI || DEFAULT_URI) {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    return true;
  } catch (error) {
    if (process.env.REQUIRE_MONGODB === "true") {
      throw error;
    }

    console.warn(`MongoDB unavailable, falling back to memory storage: ${error.message}`);
    return false;
  }
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  const operations = Object.values(collections).map((collection) =>
    collection.deleteMany({})
  );

  await Promise.all(operations);
}

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  DEFAULT_URI,
  clearDatabase,
  connectToDatabase,
  disconnectDatabase,
  isDatabaseConnected
};
