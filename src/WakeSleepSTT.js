class WakeSleepSTT {
  constructor(options = {}) {
    this.config = {
      wakeWord: (options.wakeWord || 'hi').toLowerCase(),
      sleepWord: (options.sleepWord || 'bye').toLowerCase(),
      language: options.language || 'en-US',
      continuous: options.continuous !== undefined ? options.continuous : true,
      interimResults: options.interimResults !== undefined ? options.interimResults : true,
      debug: options.debug || false,
    };

    this.isListeningForWakeWord = false;
    this.isTranscribing = false;
    this.recognition = null;
    this.isInitialized = false;
    this.hasPermission = false;
    this.isStopping = false;
    this.eventListeners = {};

    this.log('WakeSleepSTT initialized with config:', this.config);
  }

  async initialize() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        throw new Error('Web Speech API not supported in this browser. Please use Chrome, Edge, or Safari.');
      }

      try {
        this.log('Requesting microphone permission...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());

        this.hasPermission = true;
        this.log('Microphone permission granted');
        this.emit('permissionGranted');
      } catch (permError) {
        this.hasPermission = false;
        const errorMessage = permError.name === 'NotAllowedError' || permError.name === 'PermissionDeniedError'
          ? 'Microphone permission denied. Please allow microphone access in your browser settings.'
          : 'Microphone not available. Please check your device settings.';

        this.log('Permission error:', errorMessage);
        throw new Error(errorMessage);
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = this.config.continuous;
      this.recognition.interimResults = this.config.interimResults;
      this.recognition.lang = this.config.language;

      this.setupRecognitionHandlers();

      this.isInitialized = true;
      this.log('Speech Recognition initialized successfully');
      this.emit('initialized');

      return true;
    } catch (error) {
      this.log('Error initializing:', error.message);
      this.emit('error', error);
      throw error;
    }
  }

  setupRecognitionHandlers() {
    this.recognition.onresult = (event) => {
      const lastResultIndex = event.resultIndex;
      const result = event.results[lastResultIndex];

      const transcript = result[0].transcript.trim();
      const isFinal = result.isFinal;
      const confidence = result[0].confidence;

      this.log(`Recognition result: "${transcript}" (final: ${isFinal}, confidence: ${confidence})`);

      if (isFinal) {
        this.handleFinalResult(transcript, confidence);
      } else {
        this.handlePartialResult(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      this.log('Recognition error:', event.error);

      if (event.error === 'not-allowed') {
        this.hasPermission = false;
        this.isListeningForWakeWord = false;
        this.isTranscribing = false;

        const error = new Error('Microphone permission denied. Please allow microphone access and try again.');
        this.emit('error', error);
        this.emit('permissionDenied');
        return;
      }

      if (event.error === 'no-speech' || event.error === 'audio-capture' || event.error === 'aborted') {
        if (!this.isStopping && (this.isListeningForWakeWord || this.isTranscribing)) {
          this.log('Auto-restarting after error:', event.error);
          setTimeout(() => {
            if (!this.isStopping && (this.isListeningForWakeWord || this.isTranscribing)) {
              try {
                this.recognition.start();
              } catch (e) {
                this.log('Failed to restart:', e.message);
              }
            }
          }, 1000);
        }
      }

      this.emit('error', { message: event.error, event });
    };

    this.recognition.onend = () => {
      this.log('Recognition ended');

      if (!this.isStopping && (this.isListeningForWakeWord || this.isTranscribing)) {
        this.log('Auto-restarting recognition...');
        setTimeout(() => {
          if (!this.isStopping && (this.isListeningForWakeWord || this.isTranscribing)) {
            try {
              this.recognition.start();
            } catch (e) {
              if (!e.message.includes('already started')) {
                this.log('Error restarting recognition:', e.message);
                this.emit('error', { message: e.message });
              }
            }
          }
        }, 100);
      }
    };

    this.recognition.onstart = () => {
      this.log('Recognition started');
    };
  }

  start() {
    if (!this.isInitialized) {
      throw new Error('Not initialized. Call initialize() first.');
    }

    if (!this.hasPermission) {
      const error = new Error('Microphone permission not granted. Please reinitialize to request permission.');
      this.emit('error', error);
      throw error;
    }

    this.log('Starting speech recognition...');

    try {
      this.isStopping = false;
      this.isListeningForWakeWord = true;
      this.recognition.start();

      this.log('Listening for wake word:', this.config.wakeWord);
      this.emit('started');
      this.emit('listeningForWakeWord', { wakeWord: this.config.wakeWord });
    } catch (error) {
      if (error.message.includes('already started')) {
        this.log('Recognition already running');
      } else {
        this.isListeningForWakeWord = false;
        throw error;
      }
    }
  }

  handleFinalResult(transcript, confidence) {
    const text = transcript.toLowerCase();

    if (this.isListeningForWakeWord) {
      if (this.containsWord(text, this.config.wakeWord)) {
        this.activateTranscription();
      }
    } else if (this.isTranscribing) {
      if (this.containsWord(text, this.config.sleepWord)) {
        this.deactivateTranscription();
      } else {
        this.emit('transcription', {
          text: transcript,
          isFinal: true,
          confidence: confidence,
          timestamp: Date.now()
        });
      }
    }
  }

  handlePartialResult(transcript) {
    if (this.isTranscribing && transcript.length > 0) {
      this.emit('partialTranscription', {
        text: transcript,
        isFinal: false,
        timestamp: Date.now()
      });
    }
  }

  containsWord(text, word) {
    const words = text.toLowerCase().split(/\s+/);
    return words.includes(word.toLowerCase());
  }

  activateTranscription() {
    if (this.isTranscribing) return;

    this.isListeningForWakeWord = false;
    this.isTranscribing = true;

    this.log('Wake word detected! Starting transcription...');
    this.emit('wakeWordDetected', {
      wakeWord: this.config.wakeWord,
      timestamp: Date.now()
    });
    this.emit('transcriptionStarted');
  }

  deactivateTranscription() {
    if (!this.isTranscribing) return;

    this.isTranscribing = false;
    this.isListeningForWakeWord = true;

    this.log('Sleep word detected! Stopping transcription...');
    this.emit('sleepWordDetected', {
      sleepWord: this.config.sleepWord,
      timestamp: Date.now()
    });
    this.emit('transcriptionStopped');
    this.emit('listeningForWakeWord', { wakeWord: this.config.wakeWord });
  }

  stop() {
    this.log('Stopping WakeSleepSTT...');

    this.isStopping = true;
    this.isListeningForWakeWord = false;
    this.isTranscribing = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        this.log('Error stopping recognition:', e.message);
      }
    }

    this.emit('stopped');
    this.log('WakeSleepSTT stopped');

    setTimeout(() => {
      this.isStopping = false;
    }, 500);
  }

  cleanup() {
    this.stop();
    this.recognition = null;
    this.isInitialized = false;
    this.eventListeners = {};
    this.log('Resources cleaned up');
  }

  getState() {
    return {
      isListeningForWakeWord: this.isListeningForWakeWord,
      isTranscribing: this.isTranscribing,
      wakeWord: this.config.wakeWord,
      sleepWord: this.config.sleepWord,
      isInitialized: this.isInitialized,
      hasPermission: this.hasPermission
    };
  }

  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          this.log('Error in event callback:', error);
        }
      });
    }
  }

  log(...args) {
    if (this.config.debug) {
      console.log('[WakeSleepSTT]', ...args);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WakeSleepSTT;
}

if (typeof window !== 'undefined') {
  window.WakeSleepSTT = WakeSleepSTT;
}
