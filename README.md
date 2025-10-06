# 🎙️ Wake-Sleep STT Module

A modular, event-driven **Speech-to-Text** system with **wake/sleep word detection**. Completely **free**, **offline**, and **reusable** for mobile (React Native) and desktop applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

---

## ✨ Features

- 🎤 **Real-time speech-to-text transcription**
- 🔓 **100% Free & Offline** (uses Vosk - no API keys required)
- 👂 **Wake word activation** (e.g., say "Hi" to start)
- 💤 **Sleep word deactivation** (e.g., say "Bye" to stop)
- 🔄 **Repeatable cycle** (wake → transcribe → sleep → repeat)
- 📱 **React Native compatible** design
- 🎯 **Event-driven architecture** for easy integration
- ⚙️ **Highly customizable** (wake/sleep words, sample rate, etc.)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14.0.0 or higher
- Working microphone
- ~50MB disk space for Vosk model

### Installation

1. **Clone or download this module**
   ```bash
   cd wake-sleep-stt-module
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Download Vosk model**
   - Visit: https://alphacephei.com/vosk/models
   - Download: `vosk-model-small-en-us-0.15.zip` (40MB)
   - Extract to: `wake-sleep-stt-module/models/`

   Your folder structure should look like:
   ```
   wake-sleep-stt-module/
   └── models/
       └── vosk-model-small-en-us-0.15/
           ├── am/
           ├── conf/
           ├── graph/
           └── ...
   ```

4. **Run the demo**
   ```bash
   npm run demo
   ```

5. **Test it out!**
   - Say **"Hi"** to activate transcription
   - Speak anything - see real-time transcription
   - Say **"Bye"** to stop transcription
   - Repeat the cycle as needed!

---

## 📖 Usage

### Basic Example

```javascript
import WakeSleepSTT from './src/WakeSleepSTT.js';

// Create instance
const stt = new WakeSleepSTT({
  wakeWord: 'hi',
  sleepWord: 'bye',
  modelPath: './models/vosk-model-small-en-us-0.15',
  debug: true
});

// Listen to events
stt.on('wakeWordDetected', () => {
  console.log('🎤 Wake word detected! Start speaking...');
});

stt.on('transcription', (data) => {
  console.log('📝 Transcription:', data.text);
});

stt.on('sleepWordDetected', () => {
  console.log('💤 Sleep word detected! Pausing...');
});

// Initialize and start
await stt.initialize();
stt.start();
```

### Custom Wake/Sleep Words

```javascript
const stt = new WakeSleepSTT({
  wakeWord: 'jarvis',     // Custom wake word
  sleepWord: 'sleep',     // Custom sleep word
  modelPath: './models/vosk-model-small-en-us-0.15'
});
```

---

## 🎪 Events

The module emits the following events:

| Event | Description |
|-------|-------------|
| `initialized` | Model loaded successfully |
| `started` | Microphone started |
| `listeningForWakeWord` | Waiting for wake word |
| `wakeWordDetected` | Wake word spoken |
| `transcriptionStarted` | Transcription activated |
| `partialTranscription` | Real-time partial results |
| `transcription` | Final transcription result |
| `sleepWordDetected` | Sleep word spoken |
| `transcriptionStopped` | Transcription deactivated |
| `stopped` | System stopped |
| `error` | Error occurred |

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
│  Vosk  │    │   Mic   │
│ (STT)  │    │ (Audio) │
└────────┘    └─────────┘
```

**State Flow:**
```
Listening for Wake Word → Wake Word Detected →
Transcription Active → Sleep Word Detected →
(Loop back to Listening for Wake Word)
```

---

## 📱 React Native Integration

This module is designed to be reusable in React Native apps. You'll need to create a native bridge to access the microphone and Vosk library on mobile.

**Example React Native Component:**

```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import WakeSleepSTTNative from './WakeSleepSTTNative';

const TranscriptionScreen = () => {
  const [transcription, setTranscription] = useState('');
  const [isActive, setIsActive] = useState(false);

  const stt = new WakeSleepSTTNative({
    wakeWord: 'hi',
    sleepWord: 'bye',
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

See `DOCUMENTATION.md` for full React Native implementation details.

---

## 🔧 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `wakeWord` | string | 'hi' | Word to activate transcription |
| `sleepWord` | string | 'bye' | Word to deactivate transcription |
| `modelPath` | string | null | Path to Vosk model (required) |
| `sampleRate` | number | 16000 | Audio sample rate (Hz) |
| `channels` | number | 1 | Audio channels (1=mono) |
| `debug` | boolean | false | Enable debug logging |

---

## 🛠️ Platform-Specific Setup

### Windows
```bash
# If 'mic' module fails to install
npm install --global windows-build-tools
```

### macOS
```bash
# Install audio processing tools
brew install sox
```

### Linux
```bash
# Install ALSA and SoX
sudo apt-get install libasound2-dev sox libsox-fmt-all
```

---

## 📚 API Reference

### Methods

#### `async initialize()`
Load Vosk model and prepare recognizer.
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
Free all resources (model, recognizer, microphone).
```javascript
stt.cleanup();
```

#### `getState()`
Get current state of the module.
```javascript
const state = stt.getState();
// Returns: { isListeningForWakeWord, isTranscribing, wakeWord, sleepWord }
```

---

## 🧪 Testing

Run the demo on your PC/laptop:
```bash
npm run demo
```

**Expected behavior:**
1. Say "Hi" → Transcription starts
2. Speak anything → See real-time transcription
3. Say "Bye" → Transcription stops
4. Repeat cycle as needed

---

## 🐛 Troubleshooting

### Model not found?
Download from https://alphacephei.com/vosk/models and extract to `models/` folder.

### Microphone not working?
- Check microphone permissions (Settings → Privacy → Microphone)
- Test microphone with other apps
- Try different microphone device

### Wake word not detecting?
- Speak clearly and close to microphone
- Reduce background noise
- Try different wake word
- Enable debug logging: `debug: true`

### Low accuracy?
- Use larger model (`vosk-model-en-us-0.22` instead of small model)
- Improve microphone quality
- Adjust sample rate

See `DOCUMENTATION.md` for detailed troubleshooting.

---

## 📂 Project Structure

```
wake-sleep-stt-module/
├── src/
│   ├── WakeSleepSTT.js      # Core module (main class)
│   └── index.js             # Entry point
├── demo/
│   └── demo.js              # PC/Laptop demo script
├── models/
│   └── [Download Vosk model here]
├── package.json             # Dependencies & scripts
├── README.md                # This file
└── DOCUMENTATION.md         # Technical documentation
```

---

## 🎯 Use Cases

- **Voice assistants**: "Alexa", "Hey Siri" style activation
- **Hands-free apps**: Medical, industrial, accessibility apps
- **Meeting transcription**: Activate when meeting starts
- **Voice notes**: Quick voice-to-text for note-taking
- **IoT devices**: Voice-controlled smart home devices

---

## 🌟 Why This Module?

| Feature | This Module | Cloud APIs | Other Solutions |
|---------|-------------|------------|-----------------|
| **Cost** | ✅ Free | ❌ Paid | ⚠️ Varies |
| **Offline** | ✅ Yes | ❌ No | ⚠️ Some |
| **Privacy** | ✅ 100% local | ❌ Cloud | ⚠️ Varies |
| **Wake/Sleep Words** | ✅ Built-in | ❌ Manual | ❌ Manual |
| **Real-time** | ✅ Yes | ✅ Yes | ⚠️ Varies |
| **React Native Ready** | ✅ Yes | ⚠️ SDK needed | ❌ Limited |

---

## 📄 License

MIT License - Free for personal and commercial use.

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Multi-word wake phrases
- Confidence scoring
- Multiple language support
- React Native native modules
- Performance optimizations

---

## 📞 Support

- **Documentation**: See `DOCUMENTATION.md` for detailed technical docs
- **Demo**: Run `npm run demo` for live example
- **Issues**: Check troubleshooting section above

---

## 🎥 Demo Video

Create a 2-minute video showing:
1. Running `npm run demo`
2. Saying "Hi" to activate
3. Speaking and showing transcription
4. Saying "Bye" to deactivate
5. Brief code walkthrough (`WakeSleepSTT.js`)

---

**Built for hackathons, learning, and real-world applications 🚀**

⭐ If you find this useful, please star the repository!
