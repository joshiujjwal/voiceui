import { env } from './lib/env';
import app from './app';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 VoiceUI server running on http://localhost:${env.PORT}`);
  console.log(`   Accepting requests from: ${env.CLIENT_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
