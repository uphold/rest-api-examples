/**
 * Dependencies.
 */

import { createAndCommitTransaction, getCardWithFunds } from "./ct-transaction.js";

(async () => {
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
