//// --------------------------------------------
//// Strudel + React Integration (Audio Visualizer Version)
//// --------------------------------------------
//import React, { useEffect, useRef, useState } from "react";
//import "./App.css";
//import { StrudelMirror } from "@strudel/codemirror";
//import { evalScope } from "@strudel/core";
//import {
//    initAudioOnFirstClick,
//    getAudioContext,
//    webaudioOutput,
//    registerSynthSounds,
//} from "@strudel/webaudio";
//import { transpiler } from "@strudel/transpiler";
//import { registerSoundfonts } from "@strudel/soundfonts";
//import { stranger_tune } from "./tunes";
//import console_monkey_patch from "./console-monkey-patch";

//import ControlPanel from "./components/ControlPanel";
//import Visualizer from "./components/Visualizer";

//let globalEditor = null;
//let gainNode = null;
//let analyser = null;

//// --- Preprocessing ---
//export function ProcessText(match, ...args) {
//    return document.getElementById("flexRadioDefault2")?.checked ? "_" : "";
//}

//export function Proc() {
//    const procField = document.getElementById("proc");
//    if (!procField || !globalEditor) return;
//    const processed = procField.value.replaceAll("<p1_Radio>", ProcessText);
//    globalEditor.setCode(processed);
//}

//export async function ProcAndPlay() {
//    if (!globalEditor) return;

//    Proc(); // process text first
//    await initAudioOnFirstClick(); // ensure audio context active

//    try {
//        globalEditor.evaluate(); // directly evaluate
//    } catch (err) {
//        console.error("Error while evaluating:", err);
//    }
//}

//export default function App() {
//    const [controls, setControls] = useState({
//        play: false,
//        stop: false,
//        volume: 80,
//        tempo: 120,
//        instrument: "piano",
//    });

//    const [isPlaying, setIsPlaying] = useState(false);
//    const hasRun = useRef(false);

//    const handlePlay = async () => {
//        await ProcAndPlay();
//        setControls((p) => ({ ...p, play: true, stop: false }));
//        setIsPlaying(true);
//    };


//    const handleStop = () => {
//        globalEditor?.stop();
//        setControls((p) => ({ ...p, play: false, stop: true }));
//        setIsPlaying(false);
//    };

//    const handleControlChange = (key, value) => {
//        setControls((p) => ({ ...p, [key]: value }));
//        if (key === "play" && value) handlePlay();
//        if (key === "stop" && value) handleStop();
//    };

//    useEffect(() => {
//        if (hasRun.current) return;
//        console_monkey_patch();
//        hasRun.current = true;

//        const ctx = getAudioContext();
//        gainNode = ctx.createGain();
//        gainNode.gain.value = controls.volume / 100;
//        analyser = ctx.createAnalyser();
//        analyser.fftSize = 64;
//        gainNode.connect(analyser);
//        analyser.connect(ctx.destination);

//        globalEditor = new StrudelMirror({
//            defaultOutput: webaudioOutput,
//            getTime: () => getAudioContext().currentTime,
//            transpiler,
//            root: document.getElementById("editor"),
//            prebake: async () => {
//                await initAudioOnFirstClick();
//                const loadModules = evalScope(
//                    import("@strudel/core"),
//                    import("@strudel/draw"),
//                    import("@strudel/mini"),
//                    import("@strudel/tonal"),
//                    import("@strudel/webaudio")
//                );
//                await Promise.all([
//                    loadModules,
//                    registerSynthSounds(),
//                    registerSoundfonts(),
//                ]);
//            },
//        });

//        const procField = document.getElementById("proc");
//        if (procField) procField.value = stranger_tune;
//        Proc();
//    }, []);

//    return (
//        <>
//            <h1 className="header text-center mt-4 text-white fw-bolder">🎵 Strudel Studio 🎛️</h1>
//            <div className="app">
//                {/* === TOP SECTION === */}
//                <div className="top-row">
//                    <div className="card preprocessor">
//                        <h3>Preprocessor Editor</h3>
//                        <textarea id="proc" className="form-control" rows="15" />
//                        <div className="controls-inline">
//                            <button onClick={Proc}>Preprocess</button>
//                            <button onClick={ProcAndPlay}>Proc & Play</button>
//                        </div>
//                    </div>

//                    <div className="card control-panel">
//                        <h3>Control Panel</h3>
//                        <ControlPanel
//                            controls={controls}
//                            onControlChange={handleControlChange}
//                        />
//                    </div>
//                </div>

//                {/* === BOTTOM SECTION === */}
//                <div className="bottom-row">
//                    <div className="card repl-output">
//                        <h3>Strudel REPL Output</h3>
//                        <div id="editor" />
//                    </div>

//                    <div className="card visualizer">
//                        <h3>Live D3 Graph</h3>
//                        <Visualizer
//                            analyser={analyser}
//                            isPlaying={isPlaying}
//                        />
//                    </div>
//                </div>
//            </div>
//        </>
//    );
//}


// --------------------------------------------
// Strudel + React Integration (Audio Visualizer Version)
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
import Visualizer from "./components/Visualizer";

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
        tempo: 120,
        instrument: "piano",
    });

    const [isPlaying, setIsPlaying] = useState(false);
    const hasRun = useRef(false);
    const [audioReady, setAudioReady] = useState(false);

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

    const handleControlChange = (key, value) => {
        setControls((p) => ({ ...p, [key]: value }));
        if (key === "play" && value) handlePlay();
        if (key === "stop" && value) handleStop();
    };

    useEffect(() => {
        if (hasRun.current) return;
        console_monkey_patch();
        hasRun.current = true;

        const ctx = getAudioContext();
        gainNode = ctx.createGain();
        gainNode.gain.value = controls.volume / 100;
        analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
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

        // 🎹 HOTKEYS SECTION
        const handleKeyDown = async (e) => {
            // prevent hotkeys while typing
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

                case "3":
                    if (!audioReady) {
                        await initAudioOnFirstClick();
                        setAudioReady(true);
                    }
                    if (globalEditor) {
                        const presetCode = `"bd sn" # gain 0.8 # room 0.7 # delay 0.3`;
                        globalEditor.setCode(presetCode);
                        globalEditor.evaluate();
                        setControls((p) => ({ ...p, play: true, stop: false }));
                        setIsPlaying(true);
                    }
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
                {/* === TOP SECTION === */}
                <div className="top-row">
                    <div className="card preprocessor">
                        <h3>Preprocessor Editor</h3>
                        <textarea id="proc" className="form-control" rows="15" />
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

                    <div className="card control-panel">
                        <h3>Control Panel</h3>
                        <ControlPanel
                            controls={controls}
                            onControlChange={handleControlChange}
                        />
                    </div>
                </div>

                {/* === BOTTOM SECTION === */}
                <div className="bottom-row">
                    <div className="card repl-output">
                        <h3>Strudel REPL Output</h3>
                        <div id="editor" />
                    </div>

                    <div className="card visualizer">
                        <h3>Live D3 Graph</h3>
                        <Visualizer analyser={analyser} isPlaying={isPlaying} />
                    </div>
                </div>
            </div>
        </>
    );
}


