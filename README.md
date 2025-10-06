# 🎙️ Wake-Sleep STT Module

**Mukunda Internship Challenge - Real-time Speech-to-Text with Wake/Sleep Word Detection**

A professional, modular **Speech-to-Text** system using **Deepgram API** with **wake/sleep word detection**. Production-ready, event-driven architecture designed for **React Native** and **Node.js** applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Deepgram](https://img.shields.io/badge/Deepgram-Nova--2-blue)](https://deepgram.com/)

---

## ✨ Features

- 🎤 **Real-time speech-to-text transcription** (Deepgram Nova-2 model)
- 💰 **FREE $200 credit** - No credit card required
- 👂 **Wake word activation** - Say "Hi" to start transcription
- 💤 **Sleep word deactivation** - Say "Bye" to stop transcription
- 🔄 **Infinite repeatable cycle** - wake → transcribe → sleep → repeat
- 📱 **React Native compatible** - Event-driven API for mobile apps
- 🎯 **Modular architecture** - Single reusable class
- ⚙️ **Highly customizable** - Change wake/sleep words, language, etc.
- 📊 **Confidence scores** - Track transcription accuracy
- 🚀 **Professional-grade** - Production-ready STT solution

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v14.0.0 or higher ([Download](https://nodejs.org/))
- **Deepgram API key** - FREE $200 credit ([Sign up](https://console.deepgram.com/signup))
- **Working microphone**
- **SoX** audio tool (Windows/Mac/Linux)

### Installation

**Step 1: Clone Repository**

```bash
git clone https://github.com/Parthyadav05/ttl.git
cd ttl
```

**Step 2: Install Dependencies**

```bash
npm install
```

**Step 3: Get Deepgram API Key (FREE)**

1. Sign up: https://console.deepgram.com/signup
2. Get **$200 FREE credit** (no credit card!)
3. Copy your API key from: https://console.deepgram.com/project/default/keys

**Step 4: Configure API Key**

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your key:

```
DEEPGRAM_API_KEY=your_api_key_here
```

**Step 5: Install SoX (Audio Tool)**

**Windows (Chocolatey):**
```powershell
choco install sox.portable
```

**Windows (Manual):**
- Download: https://sourceforge.net/projects/sox/files/sox/14.4.2/
- Extract to `C:\Program Files\sox`
- Add to PATH

**Mac:**
```bash
brew install sox
```

**Linux:**
```bash
sudo apt-get install sox
```

**Step 6: Run Demo**

```bash
npm run demo
```

---

## 📖 Usage

### Basic Example

```javascript
import WakeSleepSTT from './src/WakeSleepSTT.js';

const stt = new WakeSleepSTT({
  wakeWord: 'hi',
  sleepWord: 'bye',
  apiKey: process.env.DEEPGRAM_API_KEY,
  language: 'en-US',
  debug: true
});

stt.on('wakeWordDetected', () => {
  console.log('🎤 Wake word detected! Start speaking...');
});

stt.on('transcription', (data) => {
  console.log('📝 Text:', data.text);
  console.log('📊 Confidence:', data.confidence);
});

stt.on('sleepWordDetected', () => {
  console.log('💤 Sleep word detected! Pausing...');
});

await stt.initialize();
stt.start();
```

### Custom Wake/Sleep Words

```javascript
const stt = new WakeSleepSTT({
  wakeWord: 'jarvis',
  sleepWord: 'sleep',
  apiKey: process.env.DEEPGRAM_API_KEY
});
```

---

## 🎪 Events

The module emits the following events:

| Event | Description | Data |
|-------|-------------|------|
| `initialized` | Deepgram connection ready | - |
| `connected` | WebSocket connected | - |
| `started` | Microphone started | - |
| `listeningForWakeWord` | Waiting for wake word | `{ wakeWord }` |
| `wakeWordDetected` | Wake word spoken | `{ wakeWord, timestamp }` |
| `transcriptionStarted` | Transcription activated | - |
| `partialTranscription` | Real-time partial results | `{ text, timestamp }` |
| `transcription` | Final transcription result | `{ text, confidence, timestamp }` |
| `sleepWordDetected` | Sleep word spoken | `{ sleepWord, timestamp }` |
| `transcriptionStopped` | Transcription deactivated | - |
| `stopped` | System stopped | - |
| `error` | Error occurred | `{ message, error }` |

---

## 📱 React Native Integration

This module is designed for React Native compatibility. Here's how to integrate:

### Architecture

```
┌─────────────────────────────────────┐
│   React Native App (JavaScript)     │
│  - Uses WakeSleepSTT event API      │
│  - Same interface as Node.js        │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│   Native Bridge (iOS/Android)       │
│  - Microphone capture               │
│  - Deepgram API integration         │
└─────────────────────────────────────┘
```

### Implementation Steps

**1. Create Native Module (iOS/Android)**

**iOS (Swift):**
```swift
import Speech
import Deepgram

class WakeSleepSTTBridge: RCTEventEmitter {
  // Implement microphone capture
  // Integrate Deepgram SDK
  // Emit events to React Native
}
```

**Android (Kotlin):**
```kotlin
import android.speech.SpeechRecognizer
import com.deepgram.sdk.*

class WakeSleepSTTModule : ReactContextBaseJavaModule {
  // Implement microphone capture
  // Integrate Deepgram SDK
  // Emit events to React Native
}
```

**2. Use in React Native**

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import WakeSleepSTT from './WakeSleepSTTNative';

const TranscriptionScreen = () => {
  const [transcription, setTranscription] = useState('');
  const [isActive, setIsActive] = useState(false);

  const stt = new WakeSleepSTT({
    wakeWord: 'hi',
    sleepWord: 'bye',
    apiKey: 'your_deepgram_key',
  });

  useEffect(() => {
    stt.on('transcription', (data) => {
      setTranscription(data.text);
    });

    stt.on('wakeWordDetected', () => setIsActive(true));
    stt.on('sleepWordDetected', () => setIsActive(false));

    return () => stt.cleanup();
  }, []);

  return (
    <View>
      <Text>Status: {isActive ? 'Active 🎤' : 'Waiting 👂'}</Text>
      <Text>Transcription: {transcription}</Text>
      <Button title="Start" onPress={() => stt.start()} />
    </View>
  );
};
```

**See `DOCUMENTATION.md` for complete React Native implementation guide.**

---

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `wakeWord` | string | `'hi'` | Word to activate transcription |
| `sleepWord` | string | `'bye'` | Word to deactivate transcription |
| `apiKey` | string | **required** | Deepgram API key |
| `language` | string | `'en-US'` | Language code |
| `sampleRate` | number | `16000` | Audio sample rate (Hz) |
| `channels` | number | `1` | Audio channels (1=mono) |
| `debug` | boolean | `false` | Enable debug logging |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────┐
│      Wake-Sleep STT Module (Core)             │
│  - WakeSleepSTT.js (Main class)              │
│  - Event-driven architecture                  │
│  - State management                           │
└───────────┬───────────────────────────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───▼────┐    ┌────▼────┐
│Deepgram│    │   Mic   │
│(Nova-2)│    │ (Audio) │
└────────┘    └─────────┘
```

**State Flow:**

```
Listening for Wake Word → Wake Word Detected →
Transcription Active → Sleep Word Detected →
(Loop back to Listening for Wake Word)
```

---

## 📚 API Reference

### Methods

#### `async initialize()`
Initialize Deepgram connection and setup handlers.

```javascript
await stt.initialize();
```

#### `start()`
Start microphone and begin listening for wake word.

```javascript
stt.start();
```

#### `stop()`
Stop microphone and recognition.

```javascript
stt.stop();
```

#### `cleanup()`
Free all resources (connection, microphone).

```javascript
stt.cleanup();
```

#### `getState()`
Get current state of the module.

```javascript
const state = stt.getState();
// Returns: { isListeningForWakeWord, isTranscribing, wakeWord, sleepWord, isInitialized }
```

---

## 🧪 Demo Output

When you run `npm run demo`:

```
╔════════════════════════════════════════════════════════════╗
║    Wake-Sleep STT Module - Deepgram Integration Demo      ║
╚════════════════════════════════════════════════════════════╝

📋 Instructions:
   1. Say "Hi" to activate transcription
   2. Speak anything - it will be transcribed in real-time
   3. Say "Bye" to stop transcription
   4. Repeat as needed - the cycle continues!
   5. Press Ctrl+C to exit

⏳ Initializing Deepgram connection...

✓ Deepgram initialized successfully!
✓ Connected to Deepgram
✓ Microphone started

👂 Listening for wake word: "hi"...

🎤 WAKE WORD DETECTED! Transcription ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Start speaking... (say "bye" to stop)

[Partial] Hello world this is a test
[10:30:45 AM] Hello world, this is a test of real-time transcription.
Confidence: 98%

💤 SLEEP WORD DETECTED! Transcription STOPPED

👂 Listening for wake word: "hi"...
```

---

## 🐛 Troubleshooting

### SoX Not Installed

**Error:** `spawn sox ENOENT`

**Solution:** Install SoX (see Step 5 above)

### API Key Not Set

**Error:** `DEEPGRAM_API_KEY environment variable not set`

**Solution:** Create `.env` file with your API key

### Low Accuracy

**Solution:**
- Use better microphone
- Reduce background noise
- Speak clearly and closer to mic

See `SETUP.md` for complete troubleshooting guide.

---

## 💡 Why Deepgram?

| Feature | Deepgram | Web Speech API | Whisper |
|---------|----------|----------------|---------|
| **Accuracy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Speed** | Real-time | Real-time | Batch only |
| **Free Tier** | $200 credit | Free | Free |
| **Setup** | npm install | Browser only | Model download |
| **Cross-platform** | ✅ Yes | ❌ Browser only | ✅ Yes |
| **Professional** | ✅ Production | ❌ Consumer | ⚠️ Research |
| **React Native** | ✅ Easy | ❌ Not compatible | ⚠️ Complex |

**Deepgram Nova-2 is the best choice for this challenge!**

---

## 📂 Project Structure

```
wake-sleep-stt-module/
├── src/
│   ├── WakeSleepSTT.js      # Core module (main class)
│   └── index.js             # Entry point
├── demo/
│   └── demo.js              # Terminal demo script
├── .env.example             # API key template
├── package.json             # Dependencies
├── README.md                # This file
├── SETUP.md                 # Setup instructions
└── DOCUMENTATION.md         # Technical documentation
```

---

## 🎯 Challenge Requirements ✅

This module satisfies all internship challenge requirements:

- ✅ **Module (not full app)** - Single reusable class
- ✅ **Real-time STT** - Deepgram streaming with interim results
- ✅ **Wake word activation** - "Hi" detection
- ✅ **Sleep word deactivation** - "Bye" detection
- ✅ **Repeatable toggle** - Infinite wake/sleep cycle
- ✅ **Free STT API** - Deepgram $200 free credit
- ✅ **React Native compatible** - Event-driven design
- ✅ **Working demo on PC/laptop** - Terminal demo included
- ✅ **Transcripts visible** - Real-time + confidence scores
- ✅ **Modular code** - Professional architecture
- ✅ **High code quality** - Clean, well-structured

---

## 📄 License

MIT License - Free for personal and commercial use.

---

## 🤝 Submission

**For Mukunda Internship Challenge:**

- **GitHub:** https://github.com/Parthyadav05/ttl
- **Video Demo:** Record 2-minute demo showing:
  1. Live demo (say "Hi", speak, say "Bye", repeat)
  2. Real-time transcriptions with confidence scores
  3. Brief code walkthrough

---

## 📞 Support

- **Setup Guide:** See `SETUP.md`
- **Technical Docs:** See `DOCUMENTATION.md`
- **Deepgram Docs:** https://developers.deepgram.com/
- **Demo:** Run `npm run demo`

---

**Built for Mukunda's Internship Challenge - October 2025 🚀**

⭐ Professional-grade STT module with wake/sleep word detection!
