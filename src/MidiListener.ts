import EventEmitter from "./EventEmitter";

const MIDI_NOTE_ON = 0x90;
const MIDI_NOTE_OFF = 0x80;
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export default class MidiListener {
  onKeyPressed = new EventEmitter<string>();
  onKeyReleased = new EventEmitter<string>();
  onError = new EventEmitter<string>();

  start() {
    if (!navigator.requestMIDIAccess) {
      this.onError.emit("Web MIDI API is not supported in this browser.");
      return;
    }
    navigator
      .requestMIDIAccess()
      .then((midi) => {
        for (const input of midi.inputs.values()) {
          input.onmidimessage = (msg) => {
            if (!msg.data) return;
            const [status, note, velocity] = msg.data;
            const command = status & 0xf0;

            if (command === MIDI_NOTE_ON && velocity > 0) {
              this.onKeyPressed.emit(midiNoteToName(note));
              return;
            }

            if (
              command === MIDI_NOTE_OFF ||
              (command === MIDI_NOTE_ON && velocity === 0)
            ) {
              this.onKeyReleased.emit(midiNoteToName(note));
              return;
            }
          };
        }
      })
      .catch((err) => {
        this.onError.emit(`Failed to access MIDI devices: ${err.message}`);
      });
  }
}

function midiNoteToName(note: number) {
  const name = NOTE_NAMES[note % 12];
  const octave = Math.floor(note / 12) - 1;
  return `${name}${octave}`;
}
