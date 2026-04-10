/**
 * Dependencies.
 */

import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// Dotenv configuration.
dotenv.config({ path: path.resolve() + "/.env" });

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
 * Obtain an OAuth access token using the client credentials grant.
 */

export async function getAccessToken() {
  const auth = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64");

  try {
    const response = await axios.request({
      method: "POST",
      url: `${process.env.BASE_URL}/oauth2/token`,
      headers: {
        Authorization: `Basic ${auth}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
    });

    return response.data.access_token;
  } catch (error) {
    formatError(error);
  }
}

/**
 * Get list of authentication methods, using an OAuth bearer token.
 */

export async function getAuthenticationMethods(accessToken) {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${process.env.BASE_URL}/v0/me/authentication_methods`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    formatError(error);
  }
}

/**
 * Create a Personal Access Token (PAT), using an OAuth bearer token.
 * The time-based one-time password (TOTP) parameter
 * is typically provided by an OTP application, e.g. Google Authenticator.
 */

export async function createNewPAT(accessToken, totp) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "content-type": "application/json",
  };

  // Set OTP headers if the totp parameter is passed.
  if (totp.OTPMethodId) {
    headers["OTP-Method-Id"] = totp.OTPMethodId;
    headers["OTP-Token"] = totp.OTPToken;
  }

  try {
    const response = await axios.request({
      method: "POST",
      url: `${process.env.BASE_URL}/v0/me/tokens`,
      data: { description: process.env.PAT_DESCRIPTION },
      headers,
    });

    return response.data;
  } catch (error) {
    formatError(error);
  }
}

/**
 * Get list of Personal Access Tokens (PATs), using an existing PAT.
 */

export async function getUserPATs(accessToken) {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${process.env.BASE_URL}/v0/me/tokens`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    formatError(error);
  }
}
