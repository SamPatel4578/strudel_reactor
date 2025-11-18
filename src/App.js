// --------------------------------------------
// Strudel + React Integration
// --------------------------------------------
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import {
    initAudioOnFirstClick,
    getAudioContext,
    webaudioOutput,
    registerSynthSounds,
} from "@strudel/webaudio";
import { transpiler } from "@strudel/transpiler";
import { registerSoundfonts } from "@strudel/soundfonts";
import { stranger_tune } from "./tunes";
import console_monkey_patch from "./console-monkey-patch";

import ControlPanel from "./components/ControlPanel";
import Graph from "./components/Graph";

let globalEditor = null;
let gainNode = null;
let analyser = null;

// --- Preprocessing ---
export function ProcessText(match, ...args) {
    return document.getElementById("flexRadioDefault2")?.checked ? "_" : "";
}

export function Proc() {
    const procField = document.getElementById("proc");
    if (!procField || !globalEditor) return;
    const processed = procField.value.replaceAll("<p1_Radio>", ProcessText);
    globalEditor.setCode(processed);
}

export async function ProcAndPlay() {
    if (!globalEditor) return;

    Proc();
    try {
        globalEditor.evaluate();
    } catch (err) {
        console.error("Error evaluating code:", err);
    }
}

export default function App() {
    const [controls, setControls] = useState({
        play: false,
        stop: false,
        volume: 80,
        tempo: 140,
        tempoBase: 60,
        tempoDivisor: 4,  
        instrument: "piano",
        reverbIntensity: 0,
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const hasRun = useRef(false);
    const [audioReady, setAudioReady] = useState(false);

    // PLAY & STOP
    const handlePlay = async () => {
        if (!audioReady) {
            await initAudioOnFirstClick();
            setAudioReady(true);
        }
        await ProcAndPlay();
        setControls((p) => ({ ...p, play: true, stop: false }));
        setIsPlaying(true);
    };

    const handleStop = () => {
        globalEditor?.stop();
        setControls((p) => ({ ...p, play: false, stop: true }));
        setIsPlaying(false);
    };

    // CENTRAL CONTROL ROUTER

    const handleControlChange = (key, value) => {
        setControls((p) => ({ ...p, [key]: value }));

        if (key === "play" && value) handlePlay();
        if (key === "stop" && value) handleStop();

        if (["tempo", "tempoBase", "tempoDivisor"].includes(key)) {
            handleTempoUpdate(
                key === "tempo" ? value : controls.tempo,
                key === "tempoBase" ? value : controls.tempoBase,
                key === "tempoDivisor" ? value : controls.tempoDivisor
            );
        }

        if (key === "save") saveSettingsToJSON(controls);
        if (key === "load") loadSettingsFromJSON();
    };


    // SAVE / LOAD SETTINGS
    const saveSettingsToJSON = (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "strudel-settings.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const loadSettingsFromJSON = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target.result);
                    setControls((prev) => ({ ...prev, ...json }));
                } catch (err) {
                    alert("⚠️ Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        };

        input.click();
    };


    // ⭐ UPDATED TEMPO LOGIC (BPM + Base + Divisor)
    const handleTempoUpdate = (bpm, base, divisor) => {
        const editor = document.getElementById("proc");
        if (!editor) return;

        const lines = editor.value.split("\n");

        if (lines[0].trim().startsWith("setcps(")) {
            lines[0] = `setcps(${bpm}/${base}/${divisor})`;
        }

        editor.value = lines.join("\n");
        ProcAndPlay();
    };

    // INITIAL SETUP
    useEffect(() => {
        if (hasRun.current) return;
        console_monkey_patch();
        hasRun.current = true;

        const ctx = getAudioContext();
        gainNode = ctx.createGain();
        gainNode.gain.value = controls.volume / 100;
        analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        gainNode.connect(analyser);
        analyser.connect(ctx.destination);

        globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: document.getElementById("editor"),
            prebake: async () => {
                const loadModules = evalScope(
                    import("@strudel/core"),
                    import("@strudel/draw"),
                    import("@strudel/mini"),
                    import("@strudel/tonal"),
                    import("@strudel/webaudio")
                );
                await Promise.all([
                    loadModules,
                    registerSynthSounds(),
                    registerSoundfonts(),
                ]);
            },
        });

        const procField = document.getElementById("proc");
        if (procField) procField.value = stranger_tune;
        Proc();

        const handleKeyDown = async (e) => {
            const active = document.activeElement;
            if (
                active &&
                (active.tagName === "TEXTAREA" || active.id === "editor")
            )
                return;

            switch (e.key) {
                case "1":
                    if (!audioReady) {
                        await initAudioOnFirstClick();
                        setAudioReady(true);
                    }
                    await ProcAndPlay();
                    setControls((p) => ({ ...p, play: true, stop: false }));
                    setIsPlaying(true);
                    break;

                case "2":
                    globalEditor?.stop();
                    setControls((p) => ({ ...p, play: false, stop: true }));
                    setIsPlaying(false);
                    break;

                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [audioReady]);

    return (
        <>
            <h1 className="header text-center mt-4 text-white fw-bolder">
                🎵 Strudel Studio 🎛️
            </h1>

            <div className="app">
                <div className="top-row">
                    <div className="card preprocessor bg-black ">
                        <h3>Preprocessor Editor</h3>
                        <textarea id="proc" className="form-control bg-black text-white border-black" rows="15" />
                        <div className="controls-inline">
                            <button
                                onClick={async () => {
                                    await initAudioOnFirstClick();
                                    setAudioReady(true);
                                    ProcAndPlay();
                                }}
                            >
                                Proc & Play
                            </button>
                            <button onClick={Proc}>Preprocess</button>
                        </div>
                    </div>

                    <div className="card control-panel bg-black text-white">
                        <h3>Control Panel</h3>
                        <ControlPanel
                            controls={controls}
                            onControlChange={handleControlChange}
                        />
                    </div>
                </div>

                <div className="bottom-row">
                    <div className="card repl-output bg-black">
                        <h3>Strudel REPL Output</h3>
                        <div id="editor" />
                    </div>

                    <div className="card visualizer bg-black">
                        <h3>Live D3 Graph</h3>
                        <Graph analyser={analyser} isPlaying={isPlaying} />
                    </div>
                </div>
            </div>
        </>
    );
}
