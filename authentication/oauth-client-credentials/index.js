/**
 * Dependencies.
 */

import { getUserInfo, getToken } from "./cc-flow.js";
import fs from "fs";

(async () => {
  // Check for the .env file.
  if (fs.existsSync('./.env') === false) {
    console.log("Missing .env file. Please follow the steps described in the README.");
    return;
  }

  try {
    // Get `bearer` token from sandbox.
    const token = await getToken();

    // Test the new token by making an authenticated call to the API.
    const userData = await getUserInfo(token.access_token);
    console.log("Output from test API call:", userData);
  } catch (error) {
    // Unexpected error.
    return;
  }
})();
