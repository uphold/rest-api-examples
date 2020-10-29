/**
 * Dependencies.
 */

import _ from "lodash";
import dotenv from "dotenv";
import path from "path";
import {
  createAndCommitTransaction,
  getCardWithFunds,
} from "./ct-transaction.js";

dotenv.config({ path: path.resolve() + "/.env" });

(async () => {
  // Locate a card that can be used as the source for the transaction.
  const sourceCard = await getCardWithFunds();
  // Define the destination as an email address.
  const destination = `${process.env.DESTINATION_EMAIL_ACCOUNT}`;

  const data = {
    denomination: {
      amount: "1",
      currency: "USD",
    },
    destination,
  };

  const transaction = await createAndCommitTransaction(data, sourceCard.id);

  if (transaction) {
    console.log('Transaction:', transaction);
  }
})();
