/**
 * Dependencies.
 */

import axios from "axios";
import dotenv from "dotenv";
import path from "path";

// Dotenv configuration.
dotenv.config({path: path.resolve() + "/.env"});

/*
 * Run transaction job
 */
export async function runTransactionJob(job) {
  const {data} = job;
  const {sourceAccountID} = {...data};
  try {

    const response = await axios.request({
      method: "POST",
      url: `${process.env.BASE_URL}/v0/me/cards/${sourceAccountID}/transactions?commit=true`,
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "content-type": "application/json"
      },
      data: data.data
    });


    // Trigger transaction
    const ret = response.data;

    //move to completed jobs!
    await job.moveToCompleted(ret);

  } catch (err) {
    return Promise.reject(err);
  }

}
