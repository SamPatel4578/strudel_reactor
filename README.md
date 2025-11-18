# Strudel Studio — README

This project is an interactive music live-coding environment built using React and the Strudel music engine.  
The interface allows users to write Strudel code, preprocess it, and play it back using a set of intuitive controls.

---

## Controls Overview (What Each Control Does)

### *1. Preprocessor Editor*
- This is the text area where users write or modify Strudel code before it is transformed.
- *Proc*: Applies preprocessing rules to your code but does not start playback.
- *Proc & Play*: Preprocesses the code and immediately evaluates it in the Strudel engine.

---

## Playback Controls

### *Play*
- Starts playing the currently processed Strudel code.
- Automatically initializes the AudioContext on the first use.

### *Stop*
- Stops all running Strudel patterns.

### *Hotkeys*
- *Press 1* → Play  
- *Press 2* → Stop  
Useful when using the application in a live or hands-free scenario.

---

## Tempo Controls

### *BPM*
- Sets beats per minute for the Strudel pattern.
- Changing this updates the first line of code in your preprocessor (setcps()).

### *Base*
- Denominator value used in the timing calculation inside setcps(bpm/base/divisor).

### *Divisor*
- Final component of the timing expression.
- Changing Base or Divisor recalculates timing immediately.

---

## Mixing Controls

### *Volume*
- Controls the master output level (0–100%).
- Adjusts a Web Audio GainNode in real time.

### *Reverb Intensity*
- Represents a future effects parameter.
- Currently updates UI state but does not apply a real reverb effect unless extended.

---

## Instrument Selector
A dropdown menu allowing users to choose between:
- Piano
- Drums
- Synth
- Bass
- Guitar

(Changing instruments updates UI state and is intended for future expansion of sound routing.)

---

## Effects Selector
Dropdown menu with:
- None
- Reverb
- Delay
- Distortion
- Echo

(These selections do not yet apply sonic effects but are stored for future implementation.)

---

## Preset Controls

### *Save Settings*
- Exports the current control panel state to a .json configuration file.

### *Load Settings*
- Loads a previously saved JSON configuration.
- Automatically updates all UI controls based on the file contents.

---

## Live D3 Graph (Visualizer Area)

- Currently a placeholder area connected to an audio analyser node.
- Intended for future visualizations (spectrum/waveform).
- Does not display a graph yet, which is expected behavior.

---

## *Usage Guidelines*

### *1. Audio Initialization*
The first time you click *Play* or *Proc & Play*, the browser will activate the AudioContext.  
This is a normal security requirement of web audio systems.

---

### *2. Tempo Changes Rewrite Code Automatically*
Changing BPM, Base, or Divisor rewrites the first line of your preprocessor code.  
If you manually remove the setcps() line, tempo controls will not function correctly.

---

### *3. Load Settings Requires a Valid JSON File*
Importing anything other than a valid preset JSON will result in an error message.

---

### *4. The Visualizer Area Is Intentionally Empty*
It is a placeholder and does not render visuals yet.

---

### *5. Effects and Instruments Are UI-Only*
They update state but do not yet influence Strudel’s audio output.

---

### *6. Preprocessor Tags*
If your code contains special placeholder tags (e.g., <p1_Radio>), preprocessing will modify them.  
Avoid removing required placeholders if your tune depends on them.

---

# Demonstration Video

 *Demo Video*  
 Pls refer to the zip folder submitted on learnOnline portal to see the demonstration video.