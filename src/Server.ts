/* app/server.ts */
import express from 'express';
import uuidv4 from "uuid/v4";

// Import WelcomeController from controllers entry point
import { Blockchain } from './Blockchain';
import { ChainController } from './chainController';

export const blockchain: Blockchain = new Blockchain();
export const UID = uuidv4();

// Create a new express application instance
const app = express();
// The port the express app will listen on
const port: number = 3000;

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// Mount the WelcomeController at the /welcome route
app.use('/chain', ChainController);

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});
