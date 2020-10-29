/**
 * Dependencies.
 */

import axios from "axios";
import b64Pkg from "js-base64";
import dotenv from "dotenv";
import path from "path";

const { encode } = b64Pkg;
dotenv.config({ path: path.resolve() + "/.env" });

/**
 * Get list of authentication methods, using basic authentication (username and password).
 */

export async function getAuthenticationMethods() {
  // Base64-encoded authentication credentials
  const auth = encode(process.env.USERNAME + ":" + process.env.PASSWORD);

  // Set GET options for Axios
  const options = {
    method: "GET",
    headers: {
      Authorization: "Basic " + auth,
    },
    url: `${process.env.BASE_URL}/v0/me/authentication_methods`,
  };

  const data = axios(options)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.response.data.errors
        ? console.log(JSON.stringify(error.response.data.errors, null, 2))
        : console.log(JSON.stringify(error, null, 2));
      throw error;
    });

  return data;
}

/**
 * Create a Personal Access Token (PAT), using basic authentication (username and password).
 * The time-based one-time password (TOTP) parameter
 * is typically provided by an OTP application, e.g. Google Authenticator.
 */

export async function createNewPAT(totp) {
  // Base64-encoded authentication credentials
  const auth = encode(process.env.USERNAME + ":" + process.env.PASSWORD);

  let headers = {
    "Authorization": "Basic " + auth,
    "content-type": "application/json",
  };

  // Set OTP headers if the totp parameter is passed
  const otpHeaders = {
    "OTP-Method-Id": totp.OTPMethodId,
    "OTP-Token": totp.OTPToken,
  };

  if (totp.OTPMethodId) {
    headers = { ...headers, ...otpHeaders };
  }

  // Set post options for axios
  const options = {
    method: "POST",
    headers,
    data: {
      description: process.env.PAT_DESCRIPTION,
    },
    url: `${process.env.BASE_URL}/v0/me/tokens`,
  };

  const data = axios(options)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.response.data.errors
        ? console.log(JSON.stringify(error.response.data.errors, null, 2))
        : console.log(JSON.stringify(error, null, 2));
      throw error;
    });

  return data;
}

/**
 * Get list of Personal Access Tokens (PATs), using a bearer token (client credentials.
 */

export async function getMyPATs(accessToken) {
  try {
    const r = await axios.get(`${process.env.BASE_URL}/v0/me/tokens`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return r.data;
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    throw error;
  }
}
