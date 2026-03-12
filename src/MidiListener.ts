import EventEmitter from "./EventEmitter";

export default class MidiListener {
  onKeyPressed = new EventEmitter<string>();
  onKeyReleased = new EventEmitter<string>();

  start() {
    navigator.requestMIDIAccess().then((midi) => {
      for (const input of midi.inputs.values()) {
        input.onmidimessage = (msg) => {
          if (!msg.data) return;
          const [status, note, velocity] = msg.data;

          if (status === 144 && velocity > 0) {
            this.onKeyPressed.emit(midiNoteToName(note));
          }

          if (status === 128 || velocity === 0) {
            this.onKeyReleased.emit(midiNoteToName(note));
          }
        };
      }
    });
  }
}

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

function midiNoteToName(note: number) {
  const name = NOTE_NAMES[note % 12];
  const octave = Math.floor(note / 12) - 1;
  return `${name}${octave}`;
}
