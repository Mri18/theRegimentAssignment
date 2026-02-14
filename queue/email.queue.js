const Queue = require('bull');

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;

const redisConfig = {
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null
};

if (redisPassword) redisConfig.password = redisPassword;

const emailQueue = new Queue('emailQueue', {
  redis: redisConfig
});

emailQueue.on('ready', () => {
  console.log(`🔥 Queue connected to Redis @ ${redisHost}:${redisPort}`);
});

emailQueue.on('error', (err) => {
  console.error('❌ Queue error:', err && err.message ? err.message : err);
});

emailQueue.on('waiting', (jobId) => {
  console.log('🕓 Job waiting:', jobId);
});

emailQueue.on('active', (job) => {
  console.log('⚡ Processing job:', job.id);
});

module.exports = emailQueue;
