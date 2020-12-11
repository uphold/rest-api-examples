/**
 * Dependencies.
 */

import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// Dotenv configuration.
dotenv.config({ path: path.resolve() + "/.env" });

// Authentication credentials.
const auth = Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64");

/**
 * Format API error response for printing in console.
 */

function formatError(error) {
  const responseStatus = `${error.response.status} (${error.response.statusText})`;

  console.log(
    `Request failed with HTTP status code ${responseStatus}`,
    JSON.stringify({
      url: error.config.url,
      response: error.response.data
    }, null, 2)
  );

  throw error;
}

/**
 * Exchange OAuth authorization code for an access token.
 */

export async function getToken(code) {
  try {
    const response = await axios.request({
      method: "POST",
      url: `${process.env.BASE_URL}/oauth2/token`,
      data: `code=${code}&grant_type=authorization_code`,
      headers: {
        Authorization: `Basic ${auth}`,
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    formatError(error);
  }
}

/**
 * Get data about the currently authenticated user.
 */

export async function getUserInfo(token) {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${process.env.BASE_URL}/v0/me`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    formatError(error);
  }
}
