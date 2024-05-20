import { createClient } from "redis";

// Getting redis client
const client = createClient();

// This function could be used to start a worker process to pop from the redis queue.
async function startWorker() {
  try {
    // Connecting to redis
    await client.connect();
    console.log("Worker connected to Redis.");

    // This needs to always run to constantly check the queue and immediately pop items when present.
    while (true) {
      try {
        // BRPOP( Blocking pop from the right ) from the queue named "queue"
        // Here, 0 means it will block the queue indefinitely until an item is available.
        const element = await client.brPop("queue", 0);

        // todo: Do something with the element
        console.log(element);

      } catch (error) {
        console.error("Error processing submission:", error);
        // Here error handling could be better. For example, we might want to push
        // the element back onto the queue or log the error to a file.
      }
    }
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

// Starting the worker process
startWorker();
