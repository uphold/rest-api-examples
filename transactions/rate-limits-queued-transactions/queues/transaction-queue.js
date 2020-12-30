/**
 * Dependencies.
 */

import dotenv from "dotenv";
import Queue from 'bull';
import path from "path";
import {runTransactionJob} from '../jobs/transaction-job.js';

// Dotenv configuration.
dotenv.config({path: path.resolve() + "/.env"});

// Set queue options, please read [Bull queue management system](https://github.com/OptimalBits/bull)
// For testing purposes will set ´4´ has Max number of jobs processed with a 10s duration
// The timings used here are just for testing purposes, please read (https://uphold.com/en/developer/api/documentation/#rate-limits) to
// implement timings in a real scenario
const queueName = "upholdTransactionQueue";
const upholdTransactionQueue = new Queue('transaction Queue', `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`, {
  limiter: {
    max: 4,
    duration: 10000
  }
});

/*
 * Transaction queue completed event
 */
upholdTransactionQueue.on('global:completed', async (jobId, result) => {

  // Monitors completed jobs!
  console.log(
    `Success :`,
    JSON.stringify({
      JobNumber: jobId,
      response: JSON.parse(result)
    }, null, 2)
  );

  // noinspection JSUnresolvedFunction
  const {waiting, delayed} = await upholdTransactionQueue.getJobCounts();

  // Exits if we have no more waiting or delayed jobs to deal !
  if (waiting === 0 && delayed === 0) {
    console.log(`No more jobs ... Exiting !`);
    await upholdTransactionQueue.close();
  } else {
    console.log(`Waiting jobs: ${waiting}  Delayed jobs: ${delayed}`);
  }
});


/*
 * Transaction queue failed event
 */
upholdTransactionQueue.on('failed', async (job, err) => {

  // Monitor failed jobs!
  console.dir(err);

  // noinspection JSUnresolvedFunction
  const {waiting, delayed} = await upholdTransactionQueue.getJobCounts();

  // Exits if we have no more waiting or delayed jobs to deal !
  if (waiting === 0 && delayed === 0) {
    console.log(`No more jobs ... Exiting !`);
    await upholdTransactionQueue.close();
  } else {
    console.log(`Waiting jobs: ${waiting}  Delayed jobs: ${delayed}`);
  }
});

/*
 * Add Job to queue
 */
export async function addJobToQueue(data, jobOptions) {
  await upholdTransactionQueue.add(queueName, data, jobOptions);
}

/*
 * Process jobs
 */
export async function processJobs() {
  await upholdTransactionQueue.process(queueName, async job => {
    await runTransactionJob(job);
  });
}

