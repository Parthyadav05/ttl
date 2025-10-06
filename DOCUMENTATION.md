# Wake-Sleep STT Module - Technical Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [How It Works](#how-it-works)
5. [Module API](#module-api)
6. [Setup & Installation](#setup--installation)
7. [Usage Examples](#usage-examples)
8. [React Native Integration](#react-native-integration)
9. [Event System](#event-system)
10. [Testing & Demo](#testing--demo)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

**Wake-Sleep STT Module** is a modular, event-driven speech-to-text transcription system that activates only when a wake word (e.g., "Hi") is detected and stops when a sleep word (e.g., "Bye") is spoken. The module is designed to be reusable and can be integrated into mobile applications (React Native) or desktop applications.

### Key Features
- ✅ **100% Free & Offline**: Uses Vosk (no API keys, no internet required after model download)
- ✅ **Real-time Transcription**: Live speech-to-text with partial results
- ✅ **Wake/Sleep Word Detection**: Toggle transcription on/off with voice commands
- ✅ **Event-Driven Architecture**: Easy integration with any application
- ✅ **Modular & Reusable**: Clean API, works with React Native
- ✅ **Customizable**: Configure wake/sleep words, sample rate, etc.
- ✅ **Cross-platform**: Works on Windows, macOS, Linux

---

## 🏗️ Architecture

### Module Structure
```
wake-sleep-stt-module/
├── src/
│   ├── WakeSleepSTT.js      # Core module (main class)
│   └── index.js             # Entry point
├── demo/
│   └── demo.js              # PC/Laptop demo script
├── tests/
│   └── test.js              # Unit tests (placeholder)
├── models/
│   └── [Vosk model here]    # Download separately
├── package.json             # Dependencies & scripts
├── README.md                # User-facing documentation
└── DOCUMENTATION.md         # Technical documentation (this file)
```

### Design Principles
1. **Separation of Concerns**: Core logic separated from demo/UI
2. **Event-Driven**: Uses Node.js EventEmitter for loose coupling
3. **State Management**: Clear state tracking (listening, transcribing, stopped)
4. **Resource Management**: Proper initialization and cleanup
5. **Error Handling**: Comprehensive error events and logging

---

## 🔧 Technology Stack

### Core Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `vosk` | ^0.3.38 | Offline speech recognition engine |
| `mic` | ^2.1.2 | Microphone audio capture |
| `node-record-lpcm16` | ^1.0.1 | Audio recording utilities |

### Why Vosk?
- **Free & Open Source**: No API costs or usage limits
- **Offline**: Works without internet connection
- **Accurate**: Based on Kaldi ASR toolkit
- **Lightweight**: Small models available (~40MB)
- **Multi-language**: Supports 20+ languages
- **Real-time**: Low latency for live transcription

---

## 🔍 How It Works

### State Machine
```
┌─────────────────────────────────────────────────────────┐
│                    INITIALIZATION                        │
│              (Load Vosk model & setup mic)              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│           LISTENING FOR WAKE WORD                        │
│    (Constantly listening, but not transcribing)         │
│              Wait for "Hi" (or custom)                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                   Wake word
                   detected
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              TRANSCRIPTION ACTIVE                        │
│   (Full transcription enabled, real-time output)        │
│              Wait for "Bye" (or custom)                 │
└──────────────────────┬──────────────────────────────────┘
                       │
                   Sleep word
                   detected
                       │
                       ▼
       (Loop back to "Listening for Wake Word")
```

### Processing Flow

1. **Audio Capture**
   ```
   Microphone → Audio Stream (16kHz PCM) → Vosk Recognizer
   ```

2. **Wake Word Detection**
   ```javascript
   Audio → Vosk → Text → Check if contains wake word → Activate
   ```

3. **Active Transcription**
   ```javascript
   Audio → Vosk → Partial Results (real-time) → Final Results
                                               → Check for sleep word
   ```

4. **Sleep Word Detection**
   ```javascript
   Detected sleep word → Deactivate → Return to wake word listening
   ```

### Word Detection Algorithm
```javascript
// Simple word-matching algorithm
containsWord(text, word) {
  const words = text.split(/\s+/);
  return words.includes(word.toLowerCase());
}
```

**Why this approach?**
- Simple and fast
- Case-insensitive
- Works for single-word wake/sleep commands
- Can be extended for multi-word phrases

---

## 📚 Module API

### Class: `WakeSleepSTT`

#### Constructor
```javascript
new WakeSleepSTT(options)
```

**Options:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `wakeWord` | string | 'hi' | Word to activate transcription |
| `sleepWord` | string | 'bye' | Word to deactivate transcription |
| `modelPath` | string | null | Path to Vosk model directory |
| `sampleRate` | number | 16000 | Audio sample rate (Hz) |
| `channels` | number | 1 | Audio channels (1=mono) |
| `debug` | boolean | false | Enable debug logging |

#### Methods

##### `async initialize()`
Load the Vosk model and prepare the recognizer.
```javascript
await stt.initialize();
```
- **Returns**: Promise<boolean>
- **Throws**: Error if model path invalid or model fails to load
- **Emits**: `'initialized'` on success, `'error'` on failure

##### `start()`
Start microphone and begin listening for wake word.
```javascript
stt.start();
```
- **Throws**: Error if not initialized
- **Emits**: `'started'`, `'listeningForWakeWord'`

##### `stop()`
Stop microphone and recognition.
```javascript
stt.stop();
```
- **Emits**: `'stopped'`

##### `cleanup()`
Free all resources (model, recognizer, microphone).
```javascript
stt.cleanup();
```

##### `getState()`
Get current state of the module.
```javascript
const state = stt.getState();
// Returns:
// {
//   isListeningForWakeWord: boolean,
//   isTranscribing: boolean,
//   wakeWord: string,
//   sleepWord: string
// }
```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js**: v14.0.0 or higher
- **Microphone**: Working audio input device
- **OS**: Windows, macOS, or Linux

### Step 1: Download Vosk Model
```bash
# Visit https://alphacephei.com/vosk/models
# Download: vosk-model-small-en-us-0.15.zip (40MB)
# Recommended models:
# - vosk-model-small-en-us-0.15 (English, 40MB)
# - vosk-model-en-us-0.22 (English, larger/accurate, 1.8GB)
```

### Step 2: Extract Model
```bash
# Extract to wake-sleep-stt-module/models/
wake-sleep-stt-module/
└── models/
    └── vosk-model-small-en-us-0.15/
        ├── am/
        ├── conf/
        ├── graph/
        └── ...
```

### Step 3: Install Dependencies
```bash
cd wake-sleep-stt-module
npm install
```

### Step 4: Run Demo
```bash
npm run demo
```

### Platform-Specific Setup

#### Windows
```bash
# Install windows-build-tools (if mic module fails)
npm install --global windows-build-tools
```

#### macOS
```bash
# Install SoX (audio processing)
brew install sox
```

#### Linux
```bash
# Install ALSA and SoX
sudo apt-get install libasound2-dev sox libsox-fmt-all
```

---

## 💡 Usage Examples

### Basic Usage (Node.js)
```javascript
import WakeSleepSTT from './src/WakeSleepSTT.js';

const stt = new WakeSleepSTT({
  wakeWord: 'hello',
  sleepWord: 'goodbye',
  modelPath: './models/vosk-model-small-en-us-0.15',
  debug: true
});

// Event listeners
stt.on('wakeWordDetected', () => {
  console.log('Wake word detected! Start speaking...');
});

stt.on('transcription', (data) => {
  console.log('Transcription:', data.text);
});

stt.on('sleepWordDetected', () => {
  console.log('Sleep word detected! Pausing...');
});

// Initialize and start
await stt.initialize();
stt.start();
```

### Custom Wake/Sleep Words
```javascript
const stt = new WakeSleepSTT({
  wakeWord: 'jarvis',      // Like Iron Man!
  sleepWord: 'sleep',
  modelPath: './models/vosk-model-small-en-us-0.15'
});
```

### Real-time Partial Results
```javascript
stt.on('partialTranscription', (data) => {
  // Update UI in real-time as user speaks
  updateUIWithPartial(data.text);
});

stt.on('transcription', (data) => {
  // Final result - more accurate
  updateUIWithFinal(data.text);
});
```

### State Management
```javascript
// Check current state
const state = stt.getState();

if (state.isTranscribing) {
  console.log('Currently transcribing...');
} else if (state.isListeningForWakeWord) {
  console.log('Waiting for wake word:', state.wakeWord);
}
```

---

## 📱 React Native Integration

### Architecture for React Native

The core module can be adapted for React Native using native bridges:

```
┌──────────────────────────────────────────────┐
│         React Native App                     │
│  (JavaScript - UI & State Management)        │
└───────────────┬──────────────────────────────┘
                │
         Native Bridge
                │
┌───────────────▼──────────────────────────────┐
│     Native Module (Java/Kotlin or Swift)     │
│  - Microphone access                         │
│  - Vosk integration                          │
│  - Event emission to JS                      │
└──────────────────────────────────────────────┘
```

### React Native Wrapper Example

**`WakeSleepSTTNative.js` (React Native)**
```javascript
import { NativeModules, NativeEventEmitter } from 'react-native';

const { WakeSleepSTTModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(WakeSleepSTTModule);

class WakeSleepSTTNative {
  constructor(options) {
    this.listeners = {};
    this.options = options;
  }

  async initialize() {
    return await WakeSleepSTTModule.initialize(
      this.options.modelPath,
      this.options.wakeWord,
      this.options.sleepWord
    );
  }

  start() {
    WakeSleepSTTModule.start();
  }

  stop() {
    WakeSleepSTTModule.stop();
  }

  on(event, callback) {
    this.listeners[event] = eventEmitter.addListener(event, callback);
  }

  cleanup() {
    Object.values(this.listeners).forEach(listener => listener.remove());
    WakeSleepSTTModule.cleanup();
  }
}

export default WakeSleepSTTNative;
```

### React Native Component Example
```javascript
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import WakeSleepSTTNative from './WakeSleepSTTNative';

const TranscriptionScreen = () => {
  const [transcription, setTranscription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [stt] = useState(() => new WakeSleepSTTNative({
    wakeWord: 'hi',
    sleepWord: 'bye',
    modelPath: 'path/to/model'
  }));

  useEffect(() => {
    stt.initialize();

    stt.on('wakeWordDetected', () => {
      setIsActive(true);
    });

    stt.on('transcription', (data) => {
      setTranscription(data.text);
    });

    stt.on('sleepWordDetected', () => {
      setIsActive(false);
    });

    return () => stt.cleanup();
  }, []);

  return (
    <View>
      <Text>Status: {isActive ? 'Active' : 'Waiting for wake word'}</Text>
      <Text>Transcription: {transcription}</Text>
      <Button title="Start" onPress={() => stt.start()} />
      <Button title="Stop" onPress={() => stt.stop()} />
    </View>
  );
};
```

### Required Native Modules

**Android (Java/Kotlin)**
```java
// WakeSleepSTTModule.java
public class WakeSleepSTTModule extends ReactContextBaseJavaModule {
  private Model model;
  private Recognizer recognizer;

  @ReactMethod
  public void initialize(String modelPath, String wakeWord, String sleepWord, Promise promise) {
    // Load Vosk model
    // Setup recognizer
  }

  @ReactMethod
  public void start() {
    // Start microphone recording
    // Process audio chunks
  }

  // Emit events to JavaScript
  private void sendEvent(String eventName, WritableMap params) {
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }
}
```

**iOS (Swift)**
```swift
// WakeSleepSTTModule.swift
@objc(WakeSleepSTTModule)
class WakeSleepSTTModule: RCTEventEmitter {
  var model: OpaquePointer?
  var recognizer: OpaquePointer?

  @objc func initialize(_ modelPath: String, wakeWord: String, sleepWord: String,
                        resolver: @escaping RCTPromiseResolveBlock,
                        rejecter: @escaping RCTPromiseRejectBlock) {
    // Load Vosk model
    // Setup recognizer
  }

  @objc func start() {
    // Start audio recording
    // Process audio
  }

  // Emit events to JavaScript
  override func supportedEvents() -> [String]! {
    return ["wakeWordDetected", "transcription", "sleepWordDetected"]
  }
}
```

---

## 🎪 Event System

### Available Events

| Event | Data | Description |
|-------|------|-------------|
| `initialized` | none | Model loaded successfully |
| `started` | none | Microphone started |
| `stopped` | none | System stopped |
| `error` | `{ message, stack }` | Error occurred |
| `listeningForWakeWord` | `{ wakeWord }` | Waiting for wake word |
| `wakeWordDetected` | `{ wakeWord, timestamp }` | Wake word spoken |
| `transcriptionStarted` | none | Transcription activated |
| `partialTranscription` | `{ text, isFinal: false, timestamp }` | Real-time partial result |
| `transcription` | `{ text, isFinal: true, timestamp }` | Final transcription result |
| `sleepWordDetected` | `{ sleepWord, timestamp }` | Sleep word spoken |
| `transcriptionStopped` | none | Transcription deactivated |

### Event Flow Diagram
```
START
  │
  ├─→ initialized
  │
  ├─→ started
  │
  ├─→ listeningForWakeWord
  │
  ├─→ wakeWordDetected
  │
  ├─→ transcriptionStarted
  │
  ├─→ partialTranscription (multiple)
  │
  ├─→ transcription (final)
  │
  ├─→ sleepWordDetected
  │
  ├─→ transcriptionStopped
  │
  └─→ (back to listeningForWakeWord)
```

---

## 🧪 Testing & Demo

### Running the Demo
```bash
npm run demo
```

### Expected Output
```
╔════════════════════════════════════════════════════════════╗
║        Wake-Sleep STT Module - Live Demo                  ║
╚════════════════════════════════════════════════════════════╝

📋 Instructions:
   1. Say "Hi" to activate transcription
   2. Speak anything - it will be transcribed in real-time
   3. Say "Bye" to stop transcription
   4. Repeat as needed - the cycle continues!
   5. Press Ctrl+C to exit

✓ Module initialized successfully!
✓ Microphone started

👂 Listening for wake word: "hi"...

🎤 WAKE WORD DETECTED! Transcription ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Start speaking... (say "bye" to stop)

[Partial] hello how are
[14:32:15] hello how are you

[Partial] i am testing the
[14:32:18] i am testing the module

[Partial] it works gre
[14:32:21] it works great bye

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💤 SLEEP WORD DETECTED! Transcription STOPPED

👂 Listening for wake word: "hi"...
```

### Testing Checklist
- [ ] Wake word detection works
- [ ] Transcription starts after wake word
- [ ] Real-time partial results appear
- [ ] Final transcription is accurate
- [ ] Sleep word detection works
- [ ] System returns to wake word listening
- [ ] Cycle can be repeated multiple times
- [ ] Graceful shutdown (Ctrl+C)

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Model path does not exist"
**Solution**: Download and extract Vosk model
```bash
# Download from: https://alphacephei.com/vosk/models
# Extract to: wake-sleep-stt-module/models/
```

#### 2. "Microphone not found" or "Permission denied"
**Solution**: Grant microphone permissions
- **Windows**: Settings → Privacy → Microphone
- **macOS**: System Preferences → Security & Privacy → Microphone
- **Linux**: Check ALSA configuration

#### 3. "Module 'mic' not found"
**Solution**: Rebuild native modules
```bash
npm rebuild
# Or reinstall
rm -rf node_modules
npm install
```

#### 4. "Wake word not detecting"
**Possible causes**:
- Speak clearly and close to microphone
- Check if microphone is working (test with other apps)
- Try different wake word
- Increase debug logging: `debug: true`

#### 5. Low accuracy / incorrect transcriptions
**Solutions**:
- Use larger Vosk model (e.g., `vosk-model-en-us-0.22`)
- Improve microphone quality
- Reduce background noise
- Adjust sample rate: `sampleRate: 16000` or `44100`

#### 6. High CPU usage
**Solutions**:
- Use smaller model (`vosk-model-small-en-us-0.15`)
- Reduce sample rate
- Close other CPU-intensive applications

---

## 🚀 Performance Considerations

### Resource Usage
| Model | Size | RAM Usage | CPU Usage | Accuracy |
|-------|------|-----------|-----------|----------|
| vosk-model-small-en-us-0.15 | 40MB | ~150MB | Low | Good |
| vosk-model-en-us-0.22 | 1.8GB | ~500MB | Medium | Excellent |

### Optimization Tips
1. **Choose appropriate model**: Balance size vs. accuracy
2. **Adjust sample rate**: Lower = less CPU, but less accurate
3. **Partial results**: Use for real-time UI updates
4. **Event debouncing**: Prevent UI thrashing with rapid updates
5. **Background processing**: Run recognition in separate thread (React Native)

---

## 📄 License

MIT License - Feel free to use in personal and commercial projects.

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Multi-word wake phrases
- Confidence scoring
- Language switching
- Cloud STT fallback
- React Native native modules
- Performance profiling

---

## 📞 Support

For issues or questions:
- Check troubleshooting section above
- Review demo.js for usage examples
- Open GitHub issue with:
  - OS and Node.js version
  - Error messages
  - Steps to reproduce

---

**Built with ❤️ for hackathons and learning**
