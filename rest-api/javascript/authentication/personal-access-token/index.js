/**
 * Dependencies.
 */

import { createNewPAT, getAuthenticationMethods, getMyPATs } from "./cc-pat.js";

(async () => {
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

  // Create a PAT.
  const newPAT = await createNewPAT(totp);

  if (newPAT.accessToken) {
    console.log("New Personal Access Token (PAT) created with success");
    console.debug(newPAT.accessToken);

    // Use the newly created PAT to list all PATs for this account.
    console.log("List of available PATs");
    console.log(await getMyPATs(newPAT.accessToken));
  }
})();
