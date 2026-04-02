const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const { connectToDatabase } = require("./db");

const port = Number(process.env.PORT) || 5000;

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  });
