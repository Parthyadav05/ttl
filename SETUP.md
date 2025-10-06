# 🛠️ Setup Guide - Wake-Sleep STT Module (Deepgram)

**Internship Coding Challenge - Complete Setup Instructions**

---

## 📋 Prerequisites

### Required:
- ✅ **Node.js** v14.0.0 or higher ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ **Working microphone**
- ✅ **Deepgram API key** (free $200 credit)

---

## 🚀 Quick Start (5 Steps)

### Step 1: Get Deepgram API Key (FREE)

1. **Sign up at Deepgram:**
   - Visit: https://console.deepgram.com/signup
   - Sign up with email or GitHub
   - **Get FREE $200 credit** (no credit card required!)

2. **Get your API key:**
   - Go to: https://console.deepgram.com/project/default/keys
   - Click "Create a New API Key"
   - Name it: "Wake-Sleep-STT-Module"
   - Copy the API key (starts with `...`)

---

### Step 2: Install Dependencies

Navigate to project folder and install:

```bash
cd C:\Users\dell\Desktop\wake-sleep-stt-module
npm install
```

**This will install:**
- `@deepgram/sdk` - Deepgram Node.js SDK
- `mic` - Microphone capture library

**Expected output:**
```
added 50 packages in 15s
```

---

### Step 3: Set API Key

**Option A: Environment Variable (Recommended)**

**Windows:**
```bash
set DEEPGRAM_API_KEY=your_api_key_here
```

**Mac/Linux:**
```bash
export DEEPGRAM_API_KEY=your_api_key_here
```

**Option B: .env File**

1. Create `.env` file in project root:
```bash
copy .env.example .env
```

2. Edit `.env` and add your key:
```
DEEPGRAM_API_KEY=your_api_key_here
```

---

### Step 4: Test Microphone Permissions

**Windows:**
1. Settings → Privacy → Microphone
2. Enable "Allow apps to access your microphone"

**macOS:**
1. System Preferences → Security & Privacy → Microphone
2. Check Terminal or your IDE

**Linux:**
```bash
arecord -l
```

---

### Step 5: Run Demo

```bash
npm run demo
```

**Expected output:**
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
```

---

## ✅ Usage Instructions

### Using the Demo:

1. **Run the demo:** `npm run demo`

2. **Say "Hi"** clearly
   - You'll see: `🎤 WAKE WORD DETECTED! Transcription ACTIVE`

3. **Speak anything:**
   - "Hello world, this is a test of real-time transcription"
   - Partial results appear in real-time
   - Final transcription shows with timestamp and confidence score

4. **Say "Bye"**
   - You'll see: `💤 SLEEP WORD DETECTED! Transcription STOPPED`

5. **Repeat** as many times as you want!

6. **Exit:** Press `Ctrl+C`

---

## 🔧 Troubleshooting

### Issue: "DEEPGRAM_API_KEY environment variable not set"

**Solution:**
Set the environment variable:

**Windows CMD:**
```bash
set DEEPGRAM_API_KEY=your_key_here
npm run demo
```

**Windows PowerShell:**
```powershell
$env:DEEPGRAM_API_KEY="your_key_here"
npm run demo
```

**Mac/Linux:**
```bash
export DEEPGRAM_API_KEY=your_key_here
npm run demo
```

**Or create .env file** (see Step 3)

---

### Issue: "npm install" fails

**Windows:**
```bash
npm install --global windows-build-tools
npm install
```

**Mac:**
```bash
brew install sox
npm install
```

**Linux:**
```bash
sudo apt-get install libasound2-dev sox
npm install
```

---

### Issue: "Microphone not found"

**Check microphone:**
```bash
# List audio devices
node -e "console.log(require('mic').getDevices())"
```

**Test microphone:**
- Windows: Sound settings → Input → Test microphone
- Mac: System Preferences → Sound → Input
- Linux: `arecord -d 5 test.wav && aplay test.wav`

---

### Issue: Wake word not detecting

**Solutions:**

1. **Speak clearly and louder**
   - Position mic 5-10 inches from mouth
   - Speak distinctly: "Hi"

2. **Reduce background noise**
   - Close windows
   - Turn off fans/AC

3. **Check debug logs**
   - Look for `[WakeSleepSTT]` messages in console
   - Verify transcripts are being received

4. **Try different wake word:**
   Edit `demo/demo.js` line 39:
   ```javascript
   wakeWord: 'hello',  // Try 'hello' instead of 'hi'
   ```

---

### Issue: Low transcription accuracy

**Solutions:**

1. **Use better microphone**
   - External USB microphone
   - Headset with boom mic

2. **Speak clearly**
   - Moderate pace
   - Clear pronunciation

3. **Deepgram already uses best model**
   - Nova-2 model is highly accurate
   - Real-time optimized

---

## 🎥 Creating Demo Video

### Recording Requirements:
- **Duration:** 2 minutes
- **Content:** Live demo + code explanation
- **Format:** MP4, MOV, or AVI

### Recommended Tools:
- **Windows:** OBS Studio, Xbox Game Bar (Win+G)
- **macOS:** QuickTime Player, OBS Studio
- **Linux:** OBS Studio, SimpleScreenRecorder

### Video Script (2 minutes):

**Part 1: Introduction (15 seconds)**
```
"Hello! This is my Wake-Sleep STT Module using Deepgram API
for Mukunda's internship challenge. It enables real-time
speech-to-text with wake and sleep word toggling."
```

**Part 2: Live Demo (75 seconds)**
```
1. Show terminal
2. Run: npm run demo
3. Say "Hi" → Show wake word detection
4. Speak 2-3 sentences → Show real-time transcription
5. Say "Bye" → Show sleep word detection
6. Repeat cycle once more
7. Show confidence scores
```

**Part 3: Code Walkthrough (30 seconds)**
```
1. Open src/WakeSleepSTT.js
2. Show Deepgram integration (line 35)
3. Show wake word detection (line 147)
4. Show sleep word detection (line 151)
5. Show repeatable cycle (line 205)
6. Mention: "Uses Deepgram's Nova-2 model with real-time streaming"
```

---

## 📝 Integration Guide

### Using in Your Project:

**Step 1: Install**
```bash
npm install @deepgram/sdk mic
```

**Step 2: Copy module**
```bash
cp src/WakeSleepSTT.js your-project/
```

**Step 3: Use it**
```javascript
import WakeSleepSTT from './WakeSleepSTT.js';

const stt = new WakeSleepSTT({
  wakeWord: 'hi',
  sleepWord: 'bye',
  apiKey: process.env.DEEPGRAM_API_KEY,
  debug: true
});

stt.on('transcription', (data) => {
  console.log('Text:', data.text);
  console.log('Confidence:', data.confidence);
});

await stt.initialize();
stt.start();
```

---

## 🔍 Verification Checklist

Before submitting:

- [ ] Node.js installed (v14+)
- [ ] npm install completed
- [ ] Deepgram API key obtained (free $200 credit)
- [ ] API key set as environment variable
- [ ] npm run demo works
- [ ] Saying "Hi" activates transcription
- [ ] Real-time transcription appears
- [ ] Saying "Bye" stops transcription
- [ ] Can repeat cycle multiple times
- [ ] Transcriptions show timestamp and confidence
- [ ] 2-minute demo video recorded

---

## 💡 Why Deepgram?

| Feature | Deepgram | Web Speech API | Whisper |
|---------|----------|----------------|---------|
| **Accuracy** | Excellent | Good | Excellent |
| **Speed** | Real-time | Real-time | Batch only |
| **Free Tier** | $200 credit | Free | Free |
| **Setup** | npm install | Browser only | Model download |
| **Cross-platform** | Yes | Browser only | Yes |
| **Professional** | ✅ Production | ❌ Consumer | ⚠️ Research |

**Deepgram is the professional choice for this challenge!**

---

## 🎯 Challenge Submission Ready

Your module is ready when:

1. ✅ Demo works with Deepgram
2. ✅ Wake word ("Hi") activates transcription
3. ✅ Sleep word ("Bye") deactivates transcription
4. ✅ Real-time transcripts visible in terminal
5. ✅ Repeatable cycle works infinitely
6. ✅ Code is modular and reusable
7. ✅ Video demo recorded (2 minutes)
8. ✅ GitHub repo updated

---

## 📊 Deepgram Free Tier

**What you get FREE:**
- ✅ $200 credit (enough for ~7 hours of audio)
- ✅ Nova-2 model (best accuracy)
- ✅ Real-time streaming
- ✅ No credit card required
- ✅ Perfect for this challenge

**Sign up:** https://console.deepgram.com/signup

---

## 🏆 Success Tips

**For best demo:**
1. Quality microphone (USB or headset)
2. Quiet environment
3. Clear speech
4. Show multiple wake/sleep cycles
5. Show confidence scores
6. Explain Deepgram integration
7. Mention $200 free credit

---

## 📚 Additional Resources

- Deepgram Docs: https://developers.deepgram.com/
- Deepgram Console: https://console.deepgram.com/
- `README.md` - Project overview
- `DOCUMENTATION.md` - Technical details
- `demo/demo.js` - Working example

---

**Setup complete! Your Deepgram-powered module is ready! 🚀**

**Total setup time: ~5 minutes**
**Total cost: $0 (free $200 credit)**
