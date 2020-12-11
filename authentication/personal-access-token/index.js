/**
 * Dependencies.
 */

import { createNewPAT, getAuthenticationMethods, getUserPATs } from "./cc-pat.js";
import fs from "fs";

(async () => {
  // Check for the .env file.
  if (fs.existsSync('./.env') === false) {
    console.log("Missing .env file. Please follow the steps described in the README.");
    return;
  }

  try {
    // Get list of authentication methods.
    const authMethods = await getAuthenticationMethods();

    // In the Sandbox environment, the special OTP value `000000` can be passed for convenience.
    const totp = {
      OTPMethodId: "",
      OTPToken: "000000",
    };

    // Try to determine if the authenticated account has two-factor authentication (2FA) active,
    // as that will require a one-time password (OTP) for the PAT creation request.
    const totpCheck =
      authMethods != null ? authMethods.find((x) => x.type === "totp") : null;
    if (totpCheck) {
      totp.OTPMethodId = totpCheck.id;
    }

    // Get a new Personal Access Token (PAT).
    const token = await createNewPAT(totp);
    console.log("Successfully obtained a new Personal Access Token (PAT):", token.accessToken);

    // Test the new token by making an authenticated call to the API.
    const userPATs = await getUserPATs(token.accessToken);
    console.log("Output from test API call:", userPATs);
  } catch (error) {
    // Unexpected error.
    return;
  }
})();
