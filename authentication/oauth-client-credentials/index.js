/**
 * Dependencies.
 */

import { getAssets, getToken } from "./cc-flow.js";

(async () => {
  // Get `bearer` token from sandbox.
  const token = await getToken();

  // Test the new token by making a call to the API.
  const assets = await getAssets(token);
  console.log("Output from test API call:", assets[0]);
})();
