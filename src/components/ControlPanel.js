import React, { useEffect, useState } from "react";

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
    const [lastHotkey, setLastHotkey] = useState(null);

    // helper to show alerts programmatically
    const showAlert = (message, duration = 5000) => {
        setAlert(message);
        if (duration > 0) {
            setTimeout(() => setAlert(null), duration);
        }
    };

    // Hotkey handling
    useEffect(() => {
        const handleHotkeys = (e) => {
            switch (e.key) {
                case "1":
                    setLastHotkey("Play song");
                    onControlChange("play", true);
                    showAlert("Playing Song");
                    break;
                case "2":
                    setLastHotkey("Stop");
                    onControlChange("stop", true);
                    showAlert("Playback stopped");
                    break;
                default:
                    return;
            }

            setTimeout(() => setLastHotkey(null), 2500);
        };

        window.addEventListener("keydown", handleHotkeys);
        return () => window.removeEventListener("keydown", handleHotkeys);
    }, [onControlChange]);

    // BPM input handler
    const handleTempoInput = (e) => {
        const value = Number(e.target.value);
        if (value < 40 || value > 300) {
            showAlert("BPM must be between 40 and 300.");
        } else {
            setAlert(null);
            onControlChange("tempo", value);
        }
    };

    // Base input handler (no min/max required)
    const handleBaseInput = (e) => {
        const value = Number(e.target.value);
        if (value <= 0) {
            showAlert("Base must be greater than 0.");
        } else {
            setAlert(null);
            onControlChange("tempoBase", value);
        }
    };

    // Divisor handler
    const handleDivisorInput = (e) => {
        const value = Number(e.target.value);
        if (value <= 0) {
            showAlert("Divisor must be greater than 0.");
        } else {
            setAlert(null);
            onControlChange("tempoDivisor", value);
        }
    };

    return (
        <div className="control-panel">
            {alert && (
                <div
                    style={{
                        background: "rgba(255,255,0,0.1)",
                        color: "#ffcc00",
                        padding: "8px",
                        borderRadius: "6px",
                        marginBottom: "8px",
                        fontWeight: "600",
                        textAlign: "center",
                    }}
                >
                    {alert}
                </div>
            )}

            {/* === Playback === */}
            <section className="control-section">
                <h4>▶ Playback</h4>
                <div className="controls-inline">
                    <button onClick={() => onControlChange("play", true)}>Play</button>
                    <button onClick={() => onControlChange("stop", true)}>Stop</button>
                </div>

                {/* BPM INPUT */}
                <div className="control">
                    <label>
                        BPM:  &nbsp;
                        <input
                            type="number"
                            min="40"
                            max="300"
                            value={controls.tempo}
                            onChange={handleTempoInput}
                        />
                    </label>
                </div>

                {/* BASE INPUT */}
                <div className="control">
                    <label>
                        Base:  &nbsp;
                        <input
                            type="number"
                            value={controls.tempoBase}
                            onChange={handleBaseInput}
                        />
                    </label>
                </div>

                {/* DIVISOR INPUT */}
                <div className="control">
                    <label>
                        Divisor:&nbsp;
                        <input
                            type="number"
                            value={controls.tempoDivisor}
                            onChange={handleDivisorInput}
                        />
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
                        Reverb Intensity: {controls.reverbIntensity}%
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={controls.reverbIntensity}
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
                        { value: "bass", label: "Bass", icon: "🎵" },
                        { value: "guitar", label: "Guitar", icon: "🎸" },
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
                    • Press <b>1</b> to play<br />
                    • Press <b>2</b> to stop<br />
                </p>

                {lastHotkey && (
                    <div
                        style={{
                            marginTop: "8px",
                            padding: "6px",
                            background: "rgba(0,255,128,0.15)",
                            color: "#00ff99",
                            borderRadius: "6px",
                            textAlign: "center",
                            fontWeight: "600",
                        }}
                    >
                        🎵 {lastHotkey} triggered
                    </div>
                )}
            </section>
        </div>
    );
}
