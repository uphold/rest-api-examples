/**
 * Dependencies.
 */

import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import path from "path";
import { randomBytes } from "crypto";
import { composeErrorPage, getAssets, getToken } from "./authorization-code-flow.js";

// Dotenv configuration.
dotenv.config({ path: path.resolve() + "/.env" });

// Server configuration.
const app = express();
const port = process.env.SERVER_PORT || 3000;
const state = randomBytes(8).toString('hex');

/**
 * Main page.
 */

app.get("/", async (req, res) => {
  // Compose the authorization URL. This assumes the `user:read` scope has been activated for this application.
  const authorizationUrl = 'https://sandbox.uphold.com/authorize/'
    + process.env.CLIENT_ID
    + '?scope=user:read'
    + '&state=' + state;

  res.send(
    `<h1>Demo app server</h1>
    <p>Please <a href="${authorizationUrl}">authorize this app</a> on Uphold's Sandbox.</p>`
  );
});


/**
 * Callback URL endpoint.
 */

app.get("/callback", async (req, res) => {
  // Show an error page if the code wasn't returned or the state doesn't match what we sent.
  if (!req.query.code || req.query.state !== state) {
    res.send(composeErrorPage(req.query, state));
  }

  // Exchange the short-lived authorization code for a long-lived access token.
  const token = await getToken(req.query.code);
  console.log(`Authorization code ${req.query.code} successfully exchanged for access token:`, token);

  // Test the new token by making a call to the API.
  const assets = await getAssets(token);
  console.log("Output from test API call:", assets[0]);

  res.send(
    `<h1>Success!</h1>
    <p>The OAuth authorization code has been successfully exchanged for an access token.</p>`
  );
});

/**
 * Run server.
 */

https
  .createServer({
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
    passphrase: "test",
  }, app)
  .listen(port, () => {
    console.log(`Server running at https://localhost:${port}`);
  });
