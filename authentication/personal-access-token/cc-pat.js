/**
 * Dependencies.
 */

import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// Dotenv configuration.
dotenv.config({ path: path.resolve() + "/.env" });

// Authentication credentials.
const auth = Buffer.from(process.env.USERNAME + ":" + process.env.PASSWORD).toString("base64");

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
 * Get list of authentication methods, using basic authentication (username and password).
 */

export async function getAuthenticationMethods() {
  try {
    const response = await axios.request({
      method: "GET",
      url: `${process.env.BASE_URL}/v0/me/authentication_methods`,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    return response.data;
  } catch (error) {
    formatError(error);
  }
}

/**
 * Create a Personal Access Token (PAT), using basic authentication (username and password).
 * The time-based one-time password (TOTP) parameter
 * is typically provided by an OTP application, e.g. Google Authenticator.
 */

export async function createNewPAT(totp) {
  const headers = {
    Authorization: `Basic ${auth}`,
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
 * Get list of Personal Access Tokens (PATs), using a bearer token (client credentials.
 */

export async function getMyPATs(accessToken) {
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
