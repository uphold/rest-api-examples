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
 * Get Token.
 */

export async function getToken() {
  try {
    const response = await axios.request({
      method: "POST",
      url: `${process.env.BASE_URL}/oauth2/token`,
      data: qs.stringify({ grant_type: "client_credentials" }),
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
