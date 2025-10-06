# 🛠️ Setup Guide - Wake-Sleep STT Module

**Internship Coding Challenge - Complete Setup Instructions**

---

## 📋 Prerequisites

**Minimal requirements - no installation needed!**

### Required:
- ✅ **Modern web browser** (Chrome, Edge, or Safari)
- ✅ **Working microphone**
- ✅ **Internet connection** (for initial browser permissions)

### NOT Required:
- ❌ No Node.js installation
- ❌ No npm packages
- ❌ No model downloads
- ❌ No build tools
- ❌ No dependencies

**Why?** This module uses the **Web Speech API** - a free, built-in browser feature that requires zero setup.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Open the Project

Navigate to your project folder:
```bash
cd C:\Users\dell\Desktop\wake-sleep-stt-module
```

Or simply locate the folder on your desktop.

---

### Step 2: Open Demo in Browser

**Option A: Double-click**
- Double-click `demo/index.html`
- It will open in your default browser

**Option B: Command line**

**Windows:**
```bash
start demo/index.html
```

**macOS:**
```bash
open demo/index.html
```

**Linux:**
```bash
xdg-open demo/index.html
```

---

### Step 3: Allow Microphone Permission

When you click the "Start" button:

1. Browser will show permission prompt: **"Allow microphone access?"**
2. Click **"Allow"** or **"Yes"**
3. Module is now ready!

**That's it! No installation, no setup, no configuration.**

---

## ✅ Usage Instructions

### Using the Demo:

1. **Click "🎤 Start" button**
   - Status changes to "⏳ Requesting microphone permission..."
   - Browser prompts for microphone access
   - After allowing: "✅ Ready to start"

2. **Say "Hi"** (the wake word)
   - Status changes to "🎤 TRANSCRIPTION ACTIVE"
   - Module starts transcribing everything you say

3. **Speak anything**
   - Real-time transcription appears in "Partial (Real-time)" section
   - Final transcription appears in "Transcriptions" box with timestamp

4. **Say "Bye"** (the sleep word)
   - Status changes to "👂 Listening for wake word: 'Hi'..."
   - Transcription pauses

5. **Repeat the cycle** as many times as you want!

---

## 🎯 Browser Compatibility

### ✅ Fully Supported:
- **Google Chrome** (Windows, macOS, Linux)
- **Microsoft Edge** (Windows, macOS)
- **Safari** (macOS, iOS)
- **Chromium-based browsers** (Brave, Opera, Vivaldi)

### ❌ Not Supported:
- Firefox (no Web Speech API support)
- Internet Explorer
- Older browser versions

**Recommended:** Chrome or Edge for best results.

---

## 🔧 Troubleshooting

### Issue: "Microphone permission denied"

**Symptoms:**
- Red warning message appears
- Status shows "❌ Permission Required"

**Solutions:**

**Chrome/Edge:**
1. Click the 🔒 lock icon in address bar
2. Find "Microphone" setting
3. Change to "Allow"
4. Refresh page and click "Start" again

**Manual reset:**
- Chrome: `chrome://settings/content/microphone`
- Edge: `edge://settings/content/microphone`
- Safari: System Preferences → Security & Privacy → Microphone

---

### Issue: "Web Speech API not supported"

**Symptoms:**
- Yellow warning box appears
- Error message about browser compatibility

**Solution:**
- Switch to Chrome, Edge, or Safari
- Update your browser to the latest version

---

### Issue: Wake word "Hi" not detecting

**Possible causes:**
- Speaking too quietly
- Background noise
- Microphone quality
- Pronunciation

**Solutions:**

1. **Speak clearly and louder**
   - Say "Hi" distinctly
   - Position microphone closer (5-10 inches from mouth)

2. **Reduce background noise**
   - Close windows
   - Turn off fans/AC
   - Mute other applications

3. **Test microphone**
   - Go to browser settings → Microphone
   - Test recording to verify microphone works

4. **Check microphone input level**
   - Windows: Settings → Sound → Input devices
   - macOS: System Preferences → Sound → Input

5. **Try different wake word**
   - Edit `demo/index.html` line 306
   - Change `wakeWord: 'hi'` to `wakeWord: 'hello'`
   - Refresh browser

---

### Issue: Transcription accuracy is low

**Solutions:**

1. **Improve microphone quality**
   - Use external microphone (not laptop built-in)
   - Use headset with boom mic
   - Position microphone correctly

2. **Speak clearly**
   - Pronounce words distinctly
   - Moderate speaking pace
   - Avoid mumbling

3. **Reduce background noise**
   - Record in quiet room
   - Close windows and doors
   - Turn off noisy appliances

4. **Check microphone settings**
   - Increase input volume
   - Disable automatic gain control
   - Test in other apps (Zoom, Discord)

---

### Issue: "Not Started" status stuck

**Symptoms:**
- Click "Start" but nothing happens
- No permission prompt appears

**Solutions:**

1. **Check browser console for errors**
   - Press F12 to open DevTools
   - Go to "Console" tab
   - Look for error messages

2. **Clear browser cache**
   - Chrome/Edge: Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Clear data

3. **Try different browser**
   - Switch to Chrome or Edge
   - Ensure latest version installed

4. **Refresh page**
   - Press Ctrl+R or F5
   - Hard refresh: Ctrl+Shift+R

---

### Issue: Transcription stops unexpectedly

**Possible causes:**
- Browser automatically stops after silence
- Microphone disconnected
- Permission revoked

**Solutions:**

1. **Check microphone connection**
   - Verify USB/Bluetooth connection
   - Test in other apps

2. **Keep speaking**
   - Web Speech API may pause after long silence
   - Say something to restart

3. **Restart module**
   - Click "⏹️ Stop" button
   - Click "🎤 Start" button again

---

## 🎥 Creating Demo Video

### Recording Requirements:
- **Duration:** 2 minutes
- **Content:** Live demo + brief code explanation
- **Format:** MP4, MOV, or AVI

### Recommended Tools:
- **Windows:** OBS Studio, Xbox Game Bar (Win+G)
- **macOS:** QuickTime Player, OBS Studio
- **Linux:** OBS Studio, SimpleScreenRecorder

### Video Script:

**Part 1: Introduction (15 seconds)**
```
"Hello! This is my Wake-Sleep STT Module for the internship challenge.
It enables real-time speech-to-text with wake and sleep word toggling."
```

**Part 2: Live Demo (60 seconds)**
```
1. Show opening demo/index.html in browser
2. Click "Start" button
3. Allow microphone permission
4. Say "Hi" → Show status changing to "TRANSCRIPTION ACTIVE"
5. Speak 2-3 sentences → Show real-time transcription appearing
6. Say "Bye" → Show status returning to "Listening for wake word"
7. Repeat cycle once more to demonstrate repeatability
```

**Part 3: Code Walkthrough (45 seconds)**
```
1. Open src/WakeSleepSTT.js in editor
2. Highlight:
   - Event-driven architecture (line 281-286)
   - Wake word detection (line 178-180)
   - Sleep word detection (line 182-184)
   - Repeatable cycle (line 236)
3. Mention: "Uses Web Speech API - free, no installation required"
```

---

## 📝 Integration Guide

### Using the Module in Your Project:

**Step 1: Copy the module file**
```bash
cp src/WakeSleepSTT.js your-project/
```

**Step 2: Include in your HTML**
```html
<script src="WakeSleepSTT.js"></script>
```

**Step 3: Initialize and use**
```javascript
const stt = new WakeSleepSTT({
  wakeWord: 'hi',
  sleepWord: 'bye',
  language: 'en-US',
  debug: true
});

stt.on('transcription', (data) => {
  console.log('Text:', data.text);
  console.log('Confidence:', data.confidence);
});

await stt.initialize();
stt.start();
```

### React Native Integration:

The module is designed to be React Native compatible. For mobile implementation:

1. **Create native bridge** for microphone access
2. **Implement speech recognition** using:
   - iOS: `Speech` framework
   - Android: `SpeechRecognizer` API
3. **Use same event-driven API** from WakeSleepSTT.js
4. **See DOCUMENTATION.md** for detailed integration guide

---

## 🔍 Verification Checklist

Before submitting your challenge:

- [ ] Demo opens in browser without errors
- [ ] Microphone permission prompt appears
- [ ] After allowing permission, module starts
- [ ] Saying "Hi" activates transcription
- [ ] Real-time transcription appears while speaking
- [ ] Saying "Bye" stops transcription
- [ ] Can repeat wake/sleep cycle multiple times
- [ ] Transcriptions show with timestamps and confidence
- [ ] Works in Chrome or Edge
- [ ] 2-minute demo video recorded

---

## 🎯 Challenge Submission Ready

Your module is ready for submission when:

1. ✅ **Demo works flawlessly** in browser
2. ✅ **Wake word ("Hi") activates** transcription
3. ✅ **Sleep word ("Bye") deactivates** transcription
4. ✅ **Real-time transcripts visible** in UI
5. ✅ **Repeatable cycle works** infinitely
6. ✅ **Code is modular** and reusable
7. ✅ **Video demo recorded** (2 minutes)
8. ✅ **GitHub repo pushed** with all code

---

## 💡 Key Advantages

**Why Web Speech API?**

| Feature | Web Speech API | Vosk (Alternative) |
|---------|----------------|-------------------|
| **Cost** | 100% Free | Free |
| **Setup** | Zero installation | Requires npm, models |
| **Size** | 0 bytes | ~50MB minimum |
| **Speed** | Real-time | Real-time |
| **Accuracy** | Excellent | Good |
| **Platform** | Browser | Node.js only |
| **Maintenance** | None | Model updates |

**Your implementation is actually superior for this challenge!**

---

## 📞 Need Help?

### Quick Debugging:

**Enable debug mode:**
Edit `demo/index.html` line 308 to see detailed logs:
```javascript
debug: true  // Already enabled in your demo
```

**Check browser console:**
- Press `F12`
- Go to "Console" tab
- Look for `[WakeSleepSTT]` messages

**Common patterns:**
- ✅ `Microphone permission granted` = Working
- ❌ `Permission denied` = Check browser settings
- ⚠️ `Recognition error: no-speech` = Speak louder

---

## 🏆 Success Tips

**For best demo:**
1. Use quality microphone (USB or headset)
2. Record in quiet room
3. Speak clearly and naturally
4. Show multiple wake/sleep cycles
5. Demonstrate real-time transcription
6. Show confidence scores in UI
7. Explain code architecture briefly

---

## 📚 Additional Resources

- `README.md` - Project overview
- `DOCUMENTATION.md` - Technical details
- `CHALLENGE_COMPLIANCE.md` - Requirements checklist
- `demo/index.html` - Live working example
- `src/WakeSleepSTT.js` - Core module code

---

**Setup complete! Your module is ready for challenge submission! 🚀**

**Total setup time: < 1 minute**
**Total dependencies: 0**
**Total cost: $0**
