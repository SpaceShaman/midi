import "./style.css";

const noteOnEl = document.getElementById("note-on")!;
const noteOffEl = document.getElementById("note-off")!;

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

navigator.requestMIDIAccess().then((midi) => {
  for (const input of midi.inputs.values()) {
    input.onmidimessage = (msg) => {
      if (!msg.data) return;
      const [status, note, velocity] = msg.data;

      if (status === 144 && velocity > 0) {
        noteOnEl.textContent = `Note On: ${midiNoteToName(note)}`;
      }

      if (status === 128 || velocity === 0) {
        noteOffEl.textContent = `Note Off: ${midiNoteToName(note)}`;
      }
    };
  }
});
