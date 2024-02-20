import dotenv from 'dotenv';
dotenv.config();
import { bootstrap } from './start/app';
import "reflect-metadata"
import cluster, { Worker } from 'cluster';
import os from 'os';

if (Boolean(process.env.CLUSTERS) == true) {
  // Check if the current process is the master process
  if (cluster.isPrimary || cluster.isMaster) {
    console.log(`Primary ${process.pid} is running`);

    // Fork worker processes based on the number of CPU cores
    const numCPUs = os.cpus().length;

    //loop through half of number of cpu cores and creates node.js processes
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    // Listen for worker process exit event and create a new worker to replace it
    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    //bootstrap the app
    bootstrap()
  }
} else bootstrap()











