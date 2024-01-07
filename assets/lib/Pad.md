# Pad

## Attributes
```
const defaultInitToneSettings = {
  note: 'C4',                 // The pitch of the note (e.g., 'C4', 'G#3')
  duration: '4n',             // Length of the note (e.g., '4n' for quarter note)
  velocity: 1.0,              // Dynamics of the note (0.0 to 1.0)
  modulation: 0,              // Modulation amount (value depends on the synth's capabilities)
  glide: 0,                   // Portamento or glide time between notes
  attack: 0.5,                // Attack time of the note's envelope
  decay: 0.5,                 // Decay time of the note's envelope
  sustain: 0.5,               // Sustain level of the note's envelope
  release: 1.0,               // Release time of the note's envelope
  pan: 0,                     // Stereo panning (-1 for left, 1 for right, 0 for center)
  detune: 0,                  // Detuning of the note in cents
  oscillatorType: 'sine',     // Type of the oscillator (e.g., 'sine', 'square', 'triangle', 'sawtooth')
  filterFrequency: 1000,      // Frequency (in Hz) of the filter cutoff
  filterQ: 1,                 // Q factor of the filter
  filterEnvAttack: 0.5,       // Attack time of the filter envelope
  filterEnvDecay: 0.5,        // Decay time of the filter envelope
  filterEnvSustain: 0.5,      // Sustain level of the filter envelope
  filterEnvRelease: 1.0,      // Release time of the filter envelope
  reverbLevel: 0.5,           // Reverb effect level
  delayTime: 0.25,            // Delay effect time
  delayFeedback: 0.5          // Delay effect feedback
}
```