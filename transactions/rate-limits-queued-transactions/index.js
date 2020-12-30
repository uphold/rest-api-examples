/**
 * Dependencies.
 */

import {getCardWithFunds, processQueuedJobs, queueAllJobs} from "./utils.js";
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

    if (sourceCard?.id) {
      // Queue 10 random job transactions
      await queueAllJobs(sourceCard.id);

      // Process the jobs
      await processQueuedJobs();

    } else {
      console.log("No card with sufficient funds...")
    }
  } catch {
    // Unexpected error.
  }
})();
