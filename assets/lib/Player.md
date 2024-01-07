# Player

## Sequencer row with tones and attributes
```
const synth = new Tone.Synth().toDestination();
const stepLength = '4n'; // Define your step length

const tonesWithDuration = [
    { note: 'C4', duration: '8n' },
    { note: 'E4', duration: '16n' },
    { note: 'G4', duration: '8t' },
    { note: 'A4', duration: '4n' }
];

const sequence = new Tone.Sequence(
    (time, toneWithDuration) => {
        synth.triggerAttackRelease(toneWithDuration.note, toneWithDuration.duration, time);
    },
    tonesWithDuration,
    stepLength
);

// Start the Transport and the sequence
Tone.Transport.start();
sequence.start();
```
## Sequencer row with samples and attributes
```
// Define the sampler with your sample URLs and settings
const sampler = new Tone.Sampler({
	urls: {
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
	},
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
}).toDestination();

// Define your sequence data
const tonesWithDuration = [
    { note: 'C4', duration: '8n' },
    { note: 'D#4', duration: '16n' },
    { note: 'F#4', duration: '8t' },
    { note: 'A4', duration: '4n' }
];

// Define the step length
const stepLength = '4n';

// Create the sequence using the sampler
const sequence = new Tone.Sequence(
    (time, toneWithDuration) => {
        sampler.triggerAttackRelease(toneWithDuration.note, toneWithDuration.duration, time);
    },
    tonesWithDuration,
    stepLength
);

// Ensure all samples are loaded before starting the sequence
Tone.loaded().then(() => {
    // Start the Transport and the sequence
    Tone.Transport.start();
    sequence.start();
});
```
## Sequencer grid
```
// Create synths for each row
const synth1 = new Tone.Synth().toDestination();
const synth2 = new Tone.Synth().toDestination();
// Example with simple sequence
const sequence1 = new Tone.Sequence(
  (time, tone) => {
    synth1.triggerAttackRelease(tone, '4n', time);
  },
  ['C4', 'E4', 'G4', 'A4'],
  '4n'
);
// Example with attributes 
const sequence2 = new Tone.Sequence(
  (time, toneWithDuration) => {
    synth2.triggerAttackRelease(toneWithDuration.note, toneWithDuration.duration, time);
  },
  [
    { note: 'E4', duration: '8n' },
    { note: 'G4', duration: '16n' },
    { note: 'B4', duration: '8t' },
    { note: 'C5', duration: '4n' }
  ],
  '4n'
);

const play = () => {
  Tone.Transport.start()
  sequence1.start(0)
  sequence2.start(0)
}

const pause = () => {
  Tone.Transport.stop()
   sequence1.stop(0)
   sequence2.stop(0)
}
```