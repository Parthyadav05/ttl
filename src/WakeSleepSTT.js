import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';
import recorder from 'node-record-lpcm16';

class WakeSleepSTT {
  constructor(options = {}) {
    this.config = {
      wakeWord: (options.wakeWord || 'hi').toLowerCase(),
      sleepWord: (options.sleepWord || 'bye').toLowerCase(),
      apiKey: options.apiKey,
      language: options.language || 'en-US',
      sampleRate: options.sampleRate || 16000,
      channels: options.channels || 1,
      debug: options.debug || false,
    };

    if (!this.config.apiKey) {
      throw new Error('Deepgram API key is required. Get yours at https://console.deepgram.com/');
    }

    this.isListeningForWakeWord = false;
    this.isTranscribing = false;
    this.deepgram = null;
    this.connection = null;
    this.microphone = null;
    this.micStream = null;
    this.isInitialized = false;
    this.isStopping = false;
    this.eventListeners = {};

    this.log('WakeSleepSTT initialized with config:', this.config);
  }

  async initialize() {
    try {
      this.deepgram = createClient(this.config.apiKey);

      this.connection = this.deepgram.listen.live({
        language: this.config.language,
        punctuate: true,
        smart_format: true,
        model: 'nova-2',
        interim_results: true,
      });

      this.setupDeepgramHandlers();

      this.isInitialized = true;
      this.log('Deepgram connection initialized successfully');
      this.emit('initialized');

      return true;
    } catch (error) {
      this.log('Error initializing:', error.message);
      this.emit('error', error);
      throw error;
    }
  }

  setupDeepgramHandlers() {
    this.connection.on(LiveTranscriptionEvents.Open, () => {
      this.log('Deepgram connection opened');
      this.emit('connected');
    });

    this.connection.on(LiveTranscriptionEvents.Close, () => {
      this.log('Deepgram connection closed');
      this.emit('disconnected');
    });

    this.connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      const transcript = data.channel.alternatives[0].transcript;
      const isFinal = data.is_final;
      const confidence = data.channel.alternatives[0].confidence;

      if (transcript && transcript.trim().length > 0) {
        this.log(`Transcript: "${transcript}" (final: ${isFinal}, confidence: ${confidence})`);

        if (isFinal) {
          this.handleFinalResult(transcript, confidence);
        } else {
          this.handlePartialResult(transcript);
        }
      }
    });

    this.connection.on(LiveTranscriptionEvents.Error, (error) => {
      this.log('Deepgram error:', error);
      this.emit('error', { message: 'Deepgram error', error });
    });

    this.connection.on(LiveTranscriptionEvents.Warning, (warning) => {
      this.log('Deepgram warning:', warning);
    });

    this.connection.on(LiveTranscriptionEvents.Metadata, (metadata) => {
      this.log('Deepgram metadata:', metadata);
    });
  }

  start() {
    if (!this.isInitialized) {
      throw new Error('Not initialized. Call initialize() first.');
    }

    this.log('Starting microphone and speech recognition...');

    try {
      this.isStopping = false;
      this.isListeningForWakeWord = true;

      this.micStream = recorder.record({
        sampleRate: this.config.sampleRate,
        channels: this.config.channels,
        threshold: 0,
        verbose: false,
        recordProgram: 'sox',
        silence: '0',
      }).stream();

      this.micStream.on('data', (data) => {
        if (this.connection && this.connection.getReadyState() === 1) {
          this.connection.send(data);
        }
      });

      this.micStream.on('error', (error) => {
        this.log('Microphone error:', error);
        this.emit('error', { message: 'Microphone error', error });
      });

      this.log('Listening for wake word:', this.config.wakeWord);
      this.emit('started');
      this.emit('listeningForWakeWord', { wakeWord: this.config.wakeWord });
    } catch (error) {
      this.isListeningForWakeWord = false;
      this.log('Error starting:', error.message);
      throw error;
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

    if (this.micStream) {
      try {
        recorder.stop();
        this.micStream.end();
      } catch (e) {
        this.log('Error stopping microphone:', e.message);
      }
    }

    if (this.connection) {
      try {
        this.connection.finish();
      } catch (e) {
        this.log('Error closing Deepgram connection:', e.message);
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
    this.connection = null;
    this.microphone = null;
    this.micStream = null;
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
      isInitialized: this.isInitialized
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

export default WakeSleepSTT;
