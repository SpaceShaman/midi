import EventEmitter from "./EventEmitter";

export default class MidiListener {
  onKeyPressed = new EventEmitter<string>();
  onKeyReleased = new EventEmitter<string>();

  start() {
    navigator.requestMIDIAccess().then((midi) => {
      for (const input of midi.inputs.values()) {
        input.onmidimessage = (msg) => {
          if (!msg.data) return;
          const [status, note] = msg.data;

          if (status === 144) {
            this.onKeyPressed.emit(midiNoteToName(note));
          }

          if (status === 128) {
            this.onKeyReleased.emit(midiNoteToName(note));
          }
        };
      }
    });
  }
}

function midiNoteToName(note: number) {
  const noteNames = [
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
  const name = noteNames[note % 12];
  const octave = Math.floor(note / 12) - 1;
  return `${name}${octave}`;
}
