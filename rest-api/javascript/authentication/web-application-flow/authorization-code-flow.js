/**
 * Dependencies.
 */

import axios from "axios";
import b64Pkg from "js-base64";
import dotenv from "dotenv";
import path from "path";
import qs from "qs";
const { encode } = b64Pkg;

// Dotenv configuration.
dotenv.config({ path: path.resolve() + "/.env" });

/**
 * Compose error page.
 */

export function composeErrorPage(data, state) {
  let content = "<h1>Something went wrong.</h1>";

  if (data.state && data.state !== state) {
    content += `<p>The received state (${data.state}) does not match the expected value: ${state}.</p>`;
  } else if (Object.values(data).length) {
    content += "<p>Here's what Uphold's servers returned:</p>";
    content += `<pre>${JSON.stringify(data, null, 4)}</pre>`;
  } else {
    content += "<p>This page should be reached at the end of an OAuth authorization process.</p>";
    content += "<p>Please confirm that you followed the steps in the README.</p>";
  }

  return content;
}

/**
 * Get assets.
 */

export async function getAssets(token) {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${process.env.BASE_URL}/v0/assets`,
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    throw error;
  }
}

/**
 * Get Token.
 */

export async function getToken(code) {
  try {
    const response = await axios.request({
      method: "POST",
      url: `${process.env.BASE_URL}/oauth2/token`,
      data: qs.stringify({ code, grant_type: "client_credentials" }),
      headers: {
        Authorization: "Basic " + encode(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET),
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    error.response.data.errors
      ? console.log(JSON.stringify(error.response.data.errors, null, 2))
      : console.log(JSON.stringify(error, null, 2));
    throw error;
  }
}
