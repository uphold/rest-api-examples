/**
 * Dependencies.
 */

import { getAssets, getToken } from "./cc-flow.js";

(async () => {
  // Get `bearer` token from sandbox
  const token = await getToken();
  // Log the output of an API call using the token, to confirm that it works
  console.log(await getAssets(token));
})();
