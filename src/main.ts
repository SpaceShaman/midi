import "./style.css";

const noteOnEl = document.getElementById("note-on")!;
const noteOffEl = document.getElementById("note-off")!;

navigator.requestMIDIAccess().then((midi) => {
  for (const input of midi.inputs.values()) {
    input.onmidimessage = (msg) => {
      const [status, note, velocity] = msg.data;

      if (status === 144 && velocity > 0) {
        noteOnEl.textContent = `Note On: ${note}`;
      }

      if (status === 128 || velocity === 0) {
        noteOffEl.textContent = `Note Off: ${note}`;
      }
    };
  }
});
