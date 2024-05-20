import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

// Getting redis client
const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

async function startServer() {
  try {
    // Connecting to redis
    await client.connect();
    console.log("Connected to Redis");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}
// Starting the server
startServer();

// Expres route to push to a redis queue
app.post("/pushToQueue", async (req, res) => {
  const { id, data } = req.body;

  try {
    // LPUSH( pushing data from the left ) to the queue named "queue"
    await client.lPush("queue", JSON.stringify({id, data}));

    // todo: Database calls

    res.status(200).send("Added to the queue");
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).send("Failed to add to the queue");
  }
});
