/* app/server.ts */

import express from 'express';

// Import WelcomeController from controllers entry point
import { ChainController } from './chainController';

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
