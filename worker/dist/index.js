"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
// Getting redis client
const client = (0, redis_1.createClient)();
// This function could be used to start a worker process to pop from the redis queue.
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connecting to redis
            yield client.connect();
            console.log("Worker connected to Redis.");
            // This needs to always run to constantly check the queue and immediately pop items when present.
            while (true) {
                try {
                    // BRPOP( Blocking pop from the right ) from the queue named "queue"
                    // Here, 0 means it will block the queue indefinitely until an item is available.
                    const element = yield client.brPop("queue", 0);
                    // todo: Do something with the element
                    console.log(element);
                }
                catch (error) {
                    console.error("Error processing submission:", error);
                    // Here error handling could be better. For example, we might want to push
                    // the element back onto the queue or log the error to a file.
                }
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
// Starting the worker process
startWorker();
