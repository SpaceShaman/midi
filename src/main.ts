import "./style.css";
import MidiListener from "./MidiListener";

const noteOnEl = document.getElementById("note-on")!;
const noteOffEl = document.getElementById("note-off")!;

const midiListener = new MidiListener();

midiListener.onKeyPressed.subscribe((note) => {
  noteOnEl.textContent = `Note On: ${note}`;
});

midiListener.onKeyReleased.subscribe((note) => {
  noteOffEl.textContent = `Note Off: ${note}`;
});

midiListener.start();
