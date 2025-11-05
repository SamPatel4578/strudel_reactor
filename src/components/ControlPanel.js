import React, { useState } from "react";
import "App.css";

// CustomDropdown Component
function CustomDropdown({ options, value, onChange, label }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="custom-dropdown">
            <label>{label}</label>
            <div
                className="dropdown-display"
                onClick={() => setOpen((o) => !o)}
                tabIndex={0}
            >
                <span>
                    {options.find((o) => o.value === value)?.icon}{" "}
                    {options.find((o) => o.value === value)?.label}
                </span>
                <span className="caret">▾</span>
            </div>

            {open && (
                <ul className="dropdown-list">
                    {options.map((o) => (
                        <li
                            key={o.value}
                            onClick={() => {
                                onChange(o.value);
                                setOpen(false);
                            }}
                        >
                            {o.icon} {o.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Main ControlPanel
export default function ControlPanel({ controls, onControlChange }) {
    const [alert, setAlert] = useState(null);

    // Validate tempo
    const handleTempoChange = (e) => {
        const value = Number(e.target.value);
        if (value < 40 || value > 200) {
            setAlert("⚠️ Tempo must be between 40 and 200 BPM.");
        } else {
            setAlert(null);
            onControlChange("tempo", value);
        }
    };

    return (
        <div className="card control-panel">
            <h3>Control Panel</h3>

            {alert && <div className="alert">{alert}</div>}

            {/* === Playback === */}
            <section className="control-section">
                <h4>▶ Playback</h4>
                <div className="controls-inline">
                    <button onClick={() => onControlChange("play", true)}>Play</button>
                    <button onClick={() => onControlChange("stop", true)}>Stop</button>
                </div>
                <div className="control">
                    <label>
                        Tempo:&nbsp;
                        <input
                            type="number"
                            min="40"
                            max="200"
                            value={controls.tempo}
                            onChange={handleTempoChange}
                        />{" "}
                        BPM
                    </label>
                </div>
            </section>

            {/* === Mixing === */}
            <section className="control-section">
                <h4>🎚 Mixing</h4>
                <div className="control">
                    <label>
                        Volume: {controls.volume}%
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={controls.volume}
                            onChange={(e) =>
                                onControlChange("volume", Number(e.target.value))
                            }
                        />
                    </label>
                </div>

                <div className="control">
                    <label>
                        Reverb Intensity:&nbsp;
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            onChange={(e) =>
                                onControlChange("reverbIntensity", Number(e.target.value))
                            }
                        />
                    </label>
                </div>
            </section>

            {/* === Instruments === */}
            <section className="control-section">
                <h4>🎹 Instruments</h4>
                <CustomDropdown
                    label="Select Instrument:"
                    value={controls.instrument}
                    onChange={(val) => onControlChange("instrument", val)}
                    options={[
                        { value: "piano", label: "Piano", icon: "🎹" },
                        { value: "drums", label: "Drums", icon: "🥁" },
                        { value: "synth", label: "Synth", icon: "🎛" },
                        { value: "bass", label: "Bass", icon: "🎸" },
                        { value: "guitar", label: "Guitar", icon: "🎵" },
                    ]}
                />
            </section>

            {/* === Effects === */}
            <section className="control-section">
                <h4>🎧 Effects</h4>
                <CustomDropdown
                    label="Select Effect:"
                    value={controls.effect || ""}
                    onChange={(val) => onControlChange("effect", val)}
                    options={[
                        { value: "", label: "None", icon: "✨" },
                        { value: "reverb", label: "Reverb", icon: "🌊" },
                        { value: "delay", label: "Delay", icon: "⏱" },
                        { value: "distortion", label: "Distortion", icon: "⚡" },
                        { value: "echo", label: "Echo", icon: "🔁" },
                    ]}
                />
            </section>

            {/* === Presets === */}
            <section className="control-section">
                <h4>💾 Presets</h4>
                <div className="controls-inline">
                    <button onClick={() => onControlChange("save", true)}>
                        Save Settings
                    </button>
                    <button onClick={() => onControlChange("load", true)}>
                        Load Settings
                    </button>
                </div>
            </section>

            {/* === Hotkeys === */}
            <section className="control-section">
                <h4>⌨️ Hotkeys</h4>
                <p className="hotkey-info">
                    • Press <b>1</b> to play preset 1<br />
                    • Press <b>2</b> to stop<br />
                    • Press <b>3</b> for Reverb + Delay preset
                </p>
            </section>
        </div>
    );
}