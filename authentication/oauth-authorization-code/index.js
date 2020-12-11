/**
 * Dependencies.
 */

import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import path from "path";
import { randomBytes } from "crypto";
import { getUserInfo, getAccessToken } from "./authorization-code-flow.js";

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
  try {
    // Show an error page if the code wasn't returned or the state doesn't match what we sent.
    if (!req.query.code || req.query.state !== state) {
      res.send(composeErrorPage(req.query, state));
    }

    // Exchange the short-lived authorization code for a long-lived access token.
    const token = await getAccessToken(req.query.code);
    console.log(`Successfully exchanged authorization code ${req.query.code} for access token:`, token.access_token);

    // Test the new token by making an authenticated call to the API.
    const userData = await getUserInfo(token.access_token);
    console.log("Output from test API call:", userData);

    res.send(
      `<h1>Success!</h1>
      <p>The OAuth authorization code has been successfully exchanged for an access token.</p>`
    );
  } catch (error) {
    // Unexpected error.
    res.send(composeErrorPage(error));
    return;
  }
});

/**
 * Compose error web page.
 */

function composeErrorPage(data, state) {
  let content = "<h1>Something went wrong.</h1>";

  if (data.state && data.state !== state) {
    content += `<p>The received state (${data.state}) does not match the expected value: ${state}.</p>`;
  } else if (data instanceof Error) {
    const errorData = {
      message: data.message,
      request: {
        url: data.config.url,
        method: data.config.method,
        data: data.config.data,
        headers: data.config.headers
      }
    };
    content += "<p>Here are details of the error (see also the console log):</p>";
    content += `<pre>${JSON.stringify(errorData, null, 4)}</pre>`;
  } else if (Object.values(data).length) {
    content += "<p>Here's what Uphold's servers returned:</p>";
    content += `<pre>${JSON.stringify(data, null, 4)}</pre>`;
  } else {
    content += "<p>This page should be reached at the end of an OAuth authorization process.</p>";
    content += "<p>Please confirm that you followed the steps in the README, and check the console log.</p>";
  }

  return content;
}

/*
 * Check for the .env file.
 */

if (fs.existsSync('./.env') === false) {
  console.log("Missing .env file. Please follow the steps described in the README.");
  process.exit();
}

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
