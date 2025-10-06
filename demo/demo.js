import WakeSleepSTT from '../src/WakeSleepSTT.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
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
console.log(`${colors.bright}${colors.cyan}║        Wake-Sleep STT Module - Live Demo                  ║${colors.reset}`);
console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

console.log(`${colors.yellow}📋 Instructions:${colors.reset}`);
console.log(`   1. Say "${colors.green}Hi${colors.reset}" to activate transcription`);
console.log(`   2. Speak anything - it will be transcribed in real-time`);
console.log(`   3. Say "${colors.red}Bye${colors.reset}" to stop transcription`);
console.log(`   4. Repeat as needed - the cycle continues!`);
console.log(`   5. Press Ctrl+C to exit\n`);

// Path to Vosk model (user needs to download this)
const modelPath = path.join(__dirname, '..', 'models', 'vosk-model-small-en-us-0.15');

console.log(`${colors.blue}ℹ  Model Path: ${modelPath}${colors.reset}`);
console.log(`${colors.yellow}⚠  If model not found, download from: https://alphacephei.com/vosk/models${colors.reset}\n`);

// Create instance
const stt = new WakeSleepSTT({
  wakeWord: 'hi',
  sleepWord: 'bye',
  modelPath: modelPath,
  debug: true,
  sampleRate: 16000
});

// Event: Initialized
stt.on('initialized', () => {
  console.log(`${colors.green}✓ Module initialized successfully!${colors.reset}\n`);
});

// Event: Started
stt.on('started', () => {
  console.log(`${colors.green}✓ Microphone started${colors.reset}`);
});

// Event: Listening for wake word
stt.on('listeningForWakeWord', (data) => {
  console.log(`\n${colors.cyan}👂 Listening for wake word: "${data.wakeWord}"...${colors.reset}`);
});

// Event: Wake word detected
stt.on('wakeWordDetected', (data) => {
  console.log(`\n${colors.bright}${colors.green}🎤 WAKE WORD DETECTED! Transcription ACTIVE${colors.reset}`);
  console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
});

// Event: Transcription started
stt.on('transcriptionStarted', () => {
  console.log(`${colors.yellow}📝 Start speaking... (say "${colors.red}bye${colors.yellow}" to stop)${colors.reset}\n`);
});

// Event: Partial transcription (real-time)
stt.on('partialTranscription', (data) => {
  process.stdout.write(`\r${colors.blue}[Partial] ${data.text}${colors.reset}                    `);
});

// Event: Final transcription
stt.on('transcription', (data) => {
  const timestamp = new Date(data.timestamp).toLocaleTimeString();
  console.log(`\n${colors.bright}${colors.magenta}[${timestamp}] ${data.text}${colors.reset}`);
});

// Event: Sleep word detected
stt.on('sleepWordDetected', (data) => {
  console.log(`\n${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bright}${colors.red}💤 SLEEP WORD DETECTED! Transcription STOPPED${colors.reset}\n`);
});

// Event: Stopped
stt.on('stopped', () => {
  console.log(`\n${colors.yellow}⏹  Module stopped${colors.reset}`);
});

// Event: Error
stt.on('error', (error) => {
  console.error(`\n${colors.red}❌ Error: ${error.message}${colors.reset}`);
  if (error.message.includes('Model path')) {
    console.log(`\n${colors.yellow}Please download a Vosk model and place it in the models/ directory:${colors.reset}`);
    console.log(`${colors.cyan}1. Visit: https://alphacephei.com/vosk/models${colors.reset}`);
    console.log(`${colors.cyan}2. Download: vosk-model-small-en-us-0.15.zip${colors.reset}`);
    console.log(`${colors.cyan}3. Extract to: wake-sleep-stt-module/models/${colors.reset}\n`);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n\n${colors.yellow}🛑 Shutting down gracefully...${colors.reset}`);
  stt.cleanup();
  console.log(`${colors.green}✓ Goodbye!${colors.reset}\n`);
  process.exit(0);
});

// Initialize and start
(async () => {
  try {
    await stt.initialize();
    stt.start();
  } catch (error) {
    console.error(`${colors.red}Failed to start demo:${colors.reset}`, error.message);
    process.exit(1);
  }
})();
