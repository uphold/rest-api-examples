/**
 * Dependencies.
 */

import { createAndCommitTransaction, getCardWithFunds } from "./user-to-user-transaction.js";
import fs from "fs";

(async () => {
  // Check for the .env file.
  if (fs.existsSync('./.env') === false) {
    console.log("Missing .env file. Please follow the steps described in the README.");
    return;
  }

  try {
    // Locate a card that can be used as the source for the transaction.
    const sourceCard = await getCardWithFunds();

    // Create a transaction and log its outputs
    console.log(await createAndCommitTransaction(sourceCard.id));
  } catch (error) {
    // Unexpected error.
    return;
  }
})();
