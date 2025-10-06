import WakeSleepSTT from '../src/WakeSleepSTT.js';
import dotenv from 'dotenv';

dotenv.config();

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

console.log(`${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}║    Wake-Sleep STT Module - Deepgram Integration Demo      ║${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

console.log(`${colors.yellow}📋 Instructions:${colors.reset}`);
console.log(`   1. Say "${colors.green}Hi${colors.reset}" to activate transcription`);
console.log(`   2. Speak anything - it will be transcribed in real-time`);
console.log(`   3. Say "${colors.red}Bye${colors.reset}" to stop transcription`);
console.log(`   4. Repeat as needed - the cycle continues!`);
console.log(`   5. Press Ctrl+C to exit\n`);

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

if (!DEEPGRAM_API_KEY) {
  console.error(`${colors.red}❌ Error: DEEPGRAM_API_KEY environment variable not set!${colors.reset}\n`);
  console.log(`${colors.yellow}Please follow these steps:${colors.reset}`);
  console.log(`${colors.cyan}1. Sign up at: https://console.deepgram.com/${colors.reset}`);
  console.log(`${colors.cyan}2. Get your API key (free $200 credit)${colors.reset}`);
  console.log(`${colors.cyan}3. Set environment variable:${colors.reset}`);
  console.log(`   ${colors.bright}Windows:${colors.reset} set DEEPGRAM_API_KEY=your_api_key_here`);
  console.log(`   ${colors.bright}Mac/Linux:${colors.reset} export DEEPGRAM_API_KEY=your_api_key_here`);
  console.log(`${colors.cyan}4. Run this demo again\n${colors.reset}`);
  process.exit(1);
}

const stt = new WakeSleepSTT({
  wakeWord: 'hi',
  sleepWord: 'bye',
  apiKey: DEEPGRAM_API_KEY,
  debug: true,
  sampleRate: 16000
});

stt.on('initialized', () => {
  console.log(`${colors.green}✓ Deepgram initialized successfully!${colors.reset}\n`);
});

stt.on('connected', () => {
  console.log(`${colors.green}✓ Connected to Deepgram${colors.reset}`);
});

stt.on('started', () => {
  console.log(`${colors.green}✓ Microphone started${colors.reset}`);
});

stt.on('listeningForWakeWord', (data) => {
  console.log(`\n${colors.cyan}👂 Listening for wake word: "${data.wakeWord}"...${colors.reset}`);
});

stt.on('wakeWordDetected', (data) => {
  console.log(`\n${colors.bright}${colors.green}🎤 WAKE WORD DETECTED! Transcription ACTIVE${colors.reset}`);
  console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
});

stt.on('transcriptionStarted', () => {
  console.log(`${colors.yellow}📝 Start speaking... (say "${colors.red}bye${colors.yellow}" to stop)${colors.reset}\n`);
});

stt.on('partialTranscription', (data) => {
  process.stdout.write(`\r${colors.blue}[Partial] ${data.text}${colors.reset}                    `);
});

stt.on('transcription', (data) => {
  const timestamp = new Date(data.timestamp).toLocaleTimeString();
  console.log(`\n${colors.bright}${colors.magenta}[${timestamp}] ${data.text}${colors.reset}`);
  console.log(`${colors.blue}Confidence: ${Math.round(data.confidence * 100)}%${colors.reset}`);
});

stt.on('sleepWordDetected', (data) => {
  console.log(`\n${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}${colors.red}💤 SLEEP WORD DETECTED! Transcription STOPPED${colors.reset}\n`);
});

stt.on('stopped', () => {
  console.log(`\n${colors.yellow}⏹  Module stopped${colors.reset}`);
});

stt.on('error', (error) => {
  console.error(`\n${colors.red}❌ Error: ${error.message}${colors.reset}`);
});

process.on('SIGINT', () => {
  console.log(`\n\n${colors.yellow}🛑 Shutting down gracefully...${colors.reset}`);
  stt.cleanup();
  console.log(`${colors.green}✓ Goodbye!${colors.reset}\n`);
  process.exit(0);
});

(async () => {
  try {
    console.log(`${colors.blue}⏳ Initializing Deepgram connection...${colors.reset}\n`);
    await stt.initialize();
    stt.start();
  } catch (error) {
    console.error(`${colors.red}Failed to start demo:${colors.reset}`, error.message);
    process.exit(1);
  }
})();
